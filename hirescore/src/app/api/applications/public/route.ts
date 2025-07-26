import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCV } from "@/lib/gemini";
import { z } from "zod";

const publicApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  candidateName: z.string().min(1, "Name is required"),
  candidateEmail: z.string().email("Valid email is required"),
  candidatePhone: z.string().optional(),
  resumeText: z.string().min(10, "Resume content is required"),
  resumeUrl: z.string().default("text-resume"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  questionAnswers: z.record(z.string()).default({}),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = publicApplicationSchema.parse(body);

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
      return NextResponse.json(
        { error: "Job not found or no longer active" },
        { status: 404 }
      );
    }

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

    // Create application and evaluate with AI in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the application
      const application = await tx.application.create({
        data: {
          jobId: validatedData.jobId,
          candidateName: validatedData.candidateName,
          candidateEmail: validatedData.candidateEmail,
          candidatePhone: validatedData.candidatePhone || null,
          resumeUrl: validatedData.resumeUrl,
          resumeText: validatedData.resumeText,
          githubUrl: validatedData.githubUrl || null,
          websiteUrl: validatedData.websiteUrl || null,
          coverLetter: validatedData.coverLetter || null,
          status: "PENDING",
        },
      });

      // Save custom question answers
      if (Object.keys(validatedData.questionAnswers).length > 0) {
        const answerData = Object.entries(validatedData.questionAnswers).map(
          ([questionId, answer]) => ({
            applicationId: application.id,
            questionId,
            answer,
          })
        );

        await tx.jobQuestionAnswer.createMany({
          data: answerData,
        });
      }

      // Evaluate CV with Gemini AI
      try {
        const evaluation = await evaluateCV({
          jobTitle: job.title,
          jobDescription: job.description,
          resumeText: validatedData.resumeText,
          coverLetter: validatedData.coverLetter,
        });

        // Save the AI evaluation scores
        await tx.score.create({
          data: {
            applicationId: application.id,
            resumeScore: evaluation.resumeScore,
            coverLetterScore: evaluation.coverLetterScore || null,
            overallScore: evaluation.overallScore,
            strengths: JSON.stringify(evaluation.strengths),
            improvements: JSON.stringify(evaluation.improvements),
            tips: JSON.stringify(evaluation.tips),
            feedback: evaluation.feedback,
          },
        });

        console.log(
          `AI evaluation completed for application ${application.id}:`,
          {
            resumeScore: evaluation.resumeScore,
            coverLetterScore: evaluation.coverLetterScore,
            overallScore: evaluation.overallScore,
          }
        );
      } catch (evaluationError) {
        console.error(
          "AI evaluation failed, but application was saved:",
          evaluationError
        );

        // Save fallback scores if AI evaluation fails
        await tx.score.create({
          data: {
            applicationId: application.id,
            resumeScore: 6,
            coverLetterScore: validatedData.coverLetter ? 6 : null,
            overallScore: 6,
            strengths: JSON.stringify(["Application received successfully"]),
            improvements: JSON.stringify(["Manual review required"]),
            tips: JSON.stringify([
              "Application will be reviewed by hiring team",
            ]),
            feedback:
              "Application received and will be reviewed manually by the hiring team.",
          },
        });
      }

      return application;
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating public application:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
