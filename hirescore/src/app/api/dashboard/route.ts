import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Only employers can access dashboard data" },
        { status: 403 }
      );
    }

    // Get all jobs for this employer
    const jobs = await prisma.job.findMany({
      where: {
        employerId: session.user.id,
      },
      include: {
        applications: {
          include: {
            scores: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate stats
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;
    const totalApplications = jobs.reduce(
      (sum, job) => sum + job._count.applications,
      0
    );
    const pendingApplications = jobs.reduce(
      (sum, job) =>
        sum + job.applications.filter((app) => app.status === "PENDING").length,
      0
    );

    // Get applications from this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const hiredThisMonth = jobs.reduce(
      (sum, job) =>
        sum +
        job.applications.filter(
          (app) => app.status === "HIRED" && app.updatedAt >= thisMonth
        ).length,
      0
    );

    // Get recent applications (last 5)
    const recentApplications = await prisma.application.findMany({
      where: {
        job: {
          employerId: session.user.id,
        },
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
        scores: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        activeJobs,
        totalApplications,
        pendingApplications,
        hiredThisMonth,
      },
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        createdAt: job.createdAt,
        applicationsCount: job._count.applications,
        type: job.type,
        location: job.location,
      })),
      recentApplications: recentApplications.map((app) => ({
        id: app.id,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail,
        jobTitle: app.job.title,
        status: app.status,
        createdAt: app.createdAt,
        overallScore: app.scores?.overallScore,
        resumeScore: app.scores?.resumeScore,
        coverLetterScore: app.scores?.coverLetterScore,
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
