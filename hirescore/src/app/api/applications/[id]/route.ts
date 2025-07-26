import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Only employers can view application details" },
        { status: 403 }
      );
    }

    // Fetch the application with all related data
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
            questions: true,
          },
        },
        scores: true,
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify the application belongs to a job posted by this employer
    if (application.job.employerId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Format the response
    const formattedApplication = {
      id: application.id,
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      candidatePhone: application.candidatePhone,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      resumeUrl: application.resumeUrl,
      resumeText: application.resumeText,
      githubUrl: application.githubUrl,
      websiteUrl: application.websiteUrl,
      coverLetter: application.coverLetter,
      job: {
        id: application.job.id,
        title: application.job.title,
        description: application.job.description,
        location: application.job.location,
        type: application.job.type,
        salary: application.job.salary,
        requirements: application.job.requirements,
        createdAt: application.job.createdAt,
      },
      scores: application.scores
        ? {
            resumeScore: application.scores.resumeScore,
            coverLetterScore: application.scores.coverLetterScore,
            overallScore: application.scores.overallScore,
            strengths: application.scores.strengths
              ? JSON.parse(application.scores.strengths)
              : [],
            improvements: application.scores.improvements
              ? JSON.parse(application.scores.improvements)
              : [],
            tips: application.scores.tips
              ? JSON.parse(application.scores.tips)
              : [],
            feedback: application.scores.feedback,
            createdAt: application.scores.createdAt,
          }
        : null,
      questionAnswers: application.answers.map((answer) => ({
        questionId: answer.questionId,
        question: answer.question.question,
        questionType: answer.question.type,
        required: answer.question.required,
        answer: answer.answer,
      })),
    };

    return NextResponse.json(formattedApplication);
  } catch (error) {
    console.error("Error fetching application details:", error);
    return NextResponse.json(
      { error: "Failed to fetch application details" },
      { status: 500 }
    );
  }
}

// Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("PATCH /api/applications/[id] - Application ID:", id);

    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      console.log("PATCH /api/applications/[id] - Unauthorized: No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "EMPLOYER") {
      console.log("PATCH /api/applications/[id] - Forbidden: Not an employer");
      return NextResponse.json(
        { error: "Only employers can update applications" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;
    console.log(
      "PATCH /api/applications/[id] - Requested status change to:",
      status
    );

    if (
      !status ||
      !["PENDING", "REVIEWING", "INTERVIEWED", "HIRED", "REJECTED"].includes(
        status
      )
    ) {
      console.log("PATCH /api/applications/[id] - Invalid status:", status);
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify the application belongs to a job posted by this employer
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application) {
      console.log("PATCH /api/applications/[id] - Application not found:", id);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.job.employerId !== session.user.id) {
      console.log(
        "PATCH /api/applications/[id] - Access denied: Job belongs to different employer"
      );
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(
      "PATCH /api/applications/[id] - Updating application status from",
      application.status,
      "to",
      status
    );

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
    });

    console.log(
      "PATCH /api/applications/[id] - Status updated successfully:",
      updatedApplication.status
    );

    return NextResponse.json({
      message: "Application status updated successfully",
      status: updatedApplication.status,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
