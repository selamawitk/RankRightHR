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
        { error: "Only employers can view applicants" },
        { status: 403 }
      );
    }

    // Verify the job belongs to this employer
    const job = await prisma.job.findUnique({
      where: {
        id,
        employerId: session.user.id,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or access denied" },
        { status: 404 }
      );
    }

    // Fetch all applications for this job with scores
    const applications = await prisma.application.findMany({
      where: {
        jobId: id,
      },
      include: {
        scores: true,
      },
      orderBy: [{ scores: { overallScore: "desc" } }, { createdAt: "desc" }],
    });

    // Format the response
    const formattedApplications = applications.map((app) => ({
      id: app.id,
      candidateName: app.candidateName,
      candidateEmail: app.candidateEmail,
      candidatePhone: app.candidatePhone,
      status: app.status,
      createdAt: app.createdAt,
      resumeUrl: app.resumeUrl,
      githubUrl: app.githubUrl,
      websiteUrl: app.websiteUrl,
      coverLetter: app.coverLetter,
      scores: app.scores
        ? {
            resumeScore: app.scores.resumeScore,
            coverLetterScore: app.scores.coverLetterScore,
            overallScore: app.scores.overallScore,
            strengths: app.scores.strengths
              ? JSON.parse(app.scores.strengths)
              : [],
            improvements: app.scores.improvements
              ? JSON.parse(app.scores.improvements)
              : [],
            tips: app.scores.tips ? JSON.parse(app.scores.tips) : [],
            feedback: app.scores.feedback,
          }
        : null,
    }));

    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        createdAt: job.createdAt,
      },
      applications: formattedApplications,
      totalApplications: formattedApplications.length,
    });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
