import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCV } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  console.log(
    "POST /api/applications/public - Starting application submission"
  );

  try {
    const body = await request.json();
    console.log("Request body received:", {
      ...body,
      resumeText: "[TRUNCATED]",
    });

    // Basic validation without Zod to avoid initialization issues
    if (!body.jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    if (!body.candidateName?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!body.candidateEmail?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.candidateEmail)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Either resumeText or a meaningful resumeUrl should be provided
    if (
      !body.resumeText?.trim() &&
      (!body.resumeUrl || body.resumeUrl === "text-resume")
    ) {
      return NextResponse.json(
        { error: "Resume content or file is required" },
        { status: 400 }
      );
    }

    // Validate URLs if provided
    if (body.githubUrl && body.githubUrl.trim() && body.githubUrl !== "") {
      try {
        new URL(body.githubUrl);
      } catch {
        return NextResponse.json(
          { error: "Invalid GitHub URL" },
          { status: 400 }
        );
      }
    }

    if (body.websiteUrl && body.websiteUrl.trim() && body.websiteUrl !== "") {
      try {
        new URL(body.websiteUrl);
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL" },
          { status: 400 }
        );
      }
    }

    const validatedData = {
      jobId: body.jobId,
      candidateName: body.candidateName.trim(),
      candidateEmail: body.candidateEmail.trim(),
      candidatePhone: body.candidatePhone?.trim() || null,
      resumeText: body.resumeText?.trim() || "",
      resumeUrl: body.resumeUrl || "text-resume",
      githubUrl: body.githubUrl?.trim() || null,
      websiteUrl: body.websiteUrl?.trim() || null,
      coverLetter: body.coverLetter?.trim() || null,
      questionAnswers: body.questionAnswers || {},
    };

    console.log("Data validated successfully");

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: {
        id: validatedData.jobId,
        status: "ACTIVE",
      },
      include: {
        questions: true,
      },
    });

    if (!job) {
      console.log("Job not found:", validatedData.jobId);
      return NextResponse.json(
        { error: "Job not found or no longer active" },
        { status: 404 }
      );
    }

    console.log("Job found:", job.title);

    // Validate required custom questions
    const requiredQuestions = job.questions.filter((q) => q.required);
    for (const question of requiredQuestions) {
      if (!validatedData.questionAnswers[question.id]?.trim()) {
        return NextResponse.json(
          { error: `Please answer required question: ${question.question}` },
          { status: 400 }
        );
      }
    }

    console.log("All required questions answered");

    // Create application and evaluate with AI in a transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log("Creating application...");

      // Create the application
      const application = await tx.application.create({
        data: {
          jobId: validatedData.jobId,
          candidateName: validatedData.candidateName,
          candidateEmail: validatedData.candidateEmail,
          candidatePhone: validatedData.candidatePhone,
          resumeUrl: validatedData.resumeUrl,
          resumeText: validatedData.resumeText,
          githubUrl: validatedData.githubUrl,
          websiteUrl: validatedData.websiteUrl,
          coverLetter: validatedData.coverLetter,
          status: "PENDING",
        },
      });

      console.log("Application created with ID:", application.id);

      // Save custom question answers
      if (Object.keys(validatedData.questionAnswers).length > 0) {
        const answerData = Object.entries(validatedData.questionAnswers).map(
          ([questionId, answer]) => ({
            applicationId: application.id,
            questionId,
            answer: String(answer),
          })
        );

        await tx.jobQuestionAnswer.createMany({
          data: answerData,
        });

        console.log("Custom question answers saved");
      }

      return application;
    });

    console.log("Starting AI evaluation...");
    let evaluationResult = null;
    try {
      console.log("🤖 Preparing data for AI evaluation:");
      console.log("   Job Title:", job.title);
      console.log(
        "   Job Description length:",
        job.description?.length || 0,
        "characters"
      );
      console.log(
        "   Resume Text length:",
        validatedData.resumeText?.length || 0,
        "characters"
      );
      console.log(
        "   Cover Letter:",
        validatedData.coverLetter ? "Provided" : "Not provided"
      );

      // Prepare resume content for AI evaluation
      let resumeContentForAI = validatedData.resumeText;

      // If resume text is empty but we have a file upload, provide a structured placeholder
      if (!resumeContentForAI || resumeContentForAI.trim().length < 10) {
        if (
          validatedData.resumeUrl &&
          validatedData.resumeUrl !== "text-resume"
        ) {
          resumeContentForAI = `
CANDIDATE PROFILE
=================

Candidate Name: ${validatedData.candidateName}
Email: ${validatedData.candidateEmail}
${validatedData.candidatePhone ? `Phone: ${validatedData.candidatePhone}` : ""}

RESUME DOCUMENT
===============
The candidate has uploaded a resume document (${validatedData.resumeUrl}).
Please evaluate based on the following information:

- Professional resume document has been submitted
- Candidate took time to prepare and upload their CV
- Resume is available for detailed review by hiring team
- File format indicates professional presentation

ADDITIONAL INFORMATION
======================
${validatedData.githubUrl ? `GitHub Profile: ${validatedData.githubUrl}` : ""}
${validatedData.websiteUrl ? `Portfolio/Website: ${validatedData.websiteUrl}` : ""}

COVER LETTER
============
${validatedData.coverLetter || "No cover letter provided."}

EVALUATION NOTES
================
This candidate has submitted a professional application with a resume file.
Please provide evaluation based on:
1. Professional presentation (resume file upload)
2. Completeness of application
3. Additional links and information provided
4. Cover letter quality (if provided)
5. Overall professionalism and interest in the position
          `.trim();
        } else {
          console.log("   ❌ No meaningful resume content available!");
          throw new Error("Resume content is required for AI evaluation");
        }
      }

      // Log first 200 characters of resume content for debugging
      console.log(
        "   Resume Content Preview:",
        resumeContentForAI.substring(0, 200) + "..."
      );

      evaluationResult = await evaluateCV({
        jobTitle: job.title,
        jobDescription: job.description,
        resumeText: resumeContentForAI,
        coverLetter: validatedData.coverLetter,
      });

      console.log("🎉 AI evaluation completed successfully:", {
        resumeScore: evaluationResult.resumeScore,
        coverLetterScore: evaluationResult.coverLetterScore,
        overallScore: evaluationResult.overallScore,
        feedbackLength: evaluationResult.feedback?.length || 0,
      });

      // Save the AI evaluation scores
      await prisma.score.create({
        data: {
          applicationId: result.id,
          resumeScore: evaluationResult.resumeScore,
          coverLetterScore: evaluationResult.coverLetterScore || null,
          overallScore: evaluationResult.overallScore,
          strengths: JSON.stringify(evaluationResult.strengths),
          improvements: JSON.stringify(evaluationResult.improvements),
          tips: JSON.stringify(evaluationResult.tips),
          feedback: evaluationResult.feedback,
        },
      });

      console.log("AI evaluation scores saved to database");
    } catch (evaluationError) {
      console.error(
        "AI evaluation failed, saving fallback scores:",
        evaluationError
      );

      // Save fallback scores if AI evaluation fails
      await prisma.score.create({
        data: {
          applicationId: result.id,
          resumeScore: 6,
          coverLetterScore: validatedData.coverLetter ? 6 : null,
          overallScore: 6,
          strengths: JSON.stringify(["Application received successfully"]),
          improvements: JSON.stringify(["Manual review required"]),
          tips: JSON.stringify(["Application will be reviewed by hiring team"]),
          feedback:
            "Application received and will be reviewed manually by the hiring team.",
        },
      });
    }

    console.log("Application submission completed successfully");

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: result.id,
        evaluationCompleted: evaluationResult !== null,
        scores: evaluationResult
          ? {
              resumeScore: evaluationResult.resumeScore,
              coverLetterScore: evaluationResult.coverLetterScore,
              overallScore: evaluationResult.overallScore,
            }
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating public application:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
