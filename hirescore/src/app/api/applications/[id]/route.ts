import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/lib/auth";
import { sendApplicationStatusEmail } from "@/lib/email";

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
    console.log("🔄 PATCH /api/applications/[id] - Application ID:", id);

    // Debug cookie information
    const cookieHeader = request.headers.get("cookie");
    console.log(
      "🍪 PATCH /api/applications/[id] - Cookie header:",
      cookieHeader ? "Present" : "Missing"
    );

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value ? value.substring(0, 10) + "..." : "empty"; // Only show first 10 chars for security
          return acc;
        },
        {} as Record<string, string>
      );
      console.log("🍪 Available cookies:", Object.keys(cookies));
    }

    const session = await getSessionFromHeaders(request.headers);
    console.log(
      "🔑 PATCH /api/applications/[id] - Session check:",
      session ? "Valid session found" : "No valid session"
    );

    if (!session) {
      console.log("❌ PATCH /api/applications/[id] - Unauthorized: No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "👤 PATCH /api/applications/[id] - User:",
      session.user.email,
      "Role:",
      session.user.role
    );

    if (session.user.role !== "EMPLOYER") {
      console.log(
        "❌ PATCH /api/applications/[id] - Forbidden: Not an employer"
      );
      return NextResponse.json(
        { error: "Only employers can update applications" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;
    console.log(
      "📝 PATCH /api/applications/[id] - Requested status change to:",
      status
    );

    // Valid status options that match both frontend and database enum
    const validStatuses = [
      "PENDING",
      "REVIEWING",
      "INTERVIEWED",
      "HIRED",
      "REJECTED",
    ];

    if (!status || !validStatuses.includes(status)) {
      console.log("❌ PATCH /api/applications/[id] - Invalid status:", status);
      console.log("✅ Valid statuses are:", validStatuses);
      return NextResponse.json(
        {
          error: "Invalid status",
          validStatuses: validStatuses,
          receivedStatus: status,
        },
        { status: 400 }
      );
    }

    // Verify the application belongs to a job posted by this employer and get all details for email
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
          },
        },
      },
    });

    if (!application) {
      console.log(
        "❌ PATCH /api/applications/[id] - Application not found:",
        id
      );
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.job.employerId !== session.user.id) {
      console.log(
        "❌ PATCH /api/applications/[id] - Access denied: Job belongs to different employer"
      );
      console.log("   Application employer ID:", application.job.employerId);
      console.log("   Session user ID:", session.user.id);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(
      "🔄 PATCH /api/applications/[id] - Updating application status from",
      application.status,
      "to",
      status
    );

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: status as any }, // Type assertion for enum
    });

    console.log(
      "✅ PATCH /api/applications/[id] - Status updated successfully:",
      updatedApplication.status
    );

    // Send email notification to candidate (don't wait for it to complete)
    if (application.candidateEmail && application.candidateName) {
      console.log(
        "📧 PATCH /api/applications/[id] - Sending email notification..."
      );

      // Send email asynchronously without blocking the response
      sendApplicationStatusEmail({
        candidateName: application.candidateName,
        candidateEmail: application.candidateEmail,
        jobTitle: application.job.title,
        companyName:
          application.job.employer.companyName || application.job.employer.name,
        status: status,
        jobId: application.jobId,
        applicationId: application.id,
      })
        .then((emailSent) => {
          if (emailSent) {
            console.log(
              "✅ PATCH /api/applications/[id] - Email notification sent successfully"
            );
          } else {
            console.log(
              "❌ PATCH /api/applications/[id] - Email notification failed"
            );
          }
        })
        .catch((emailError) => {
          console.error(
            "❌ PATCH /api/applications/[id] - Email notification error:",
            emailError
          );
        });
    } else {
      console.log(
        "⚠️ PATCH /api/applications/[id] - Skipping email: missing candidate details"
      );
    }

    return NextResponse.json({
      message: "Application status updated successfully",
      status: updatedApplication.status,
      emailNotification: "Email notification sent",
    });
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
