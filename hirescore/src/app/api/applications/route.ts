import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/lib/auth";
import { evaluateCandidate } from "@/lib/openai";
import { z } from "zod";

const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  resumeUrl: z.string().min(1, "Resume is required"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Only candidates can submit applications" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createApplicationSchema.parse(body);

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: validatedData.jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: session.user.id,
          jobId: validatedData.jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        candidateId: session.user.id,
        jobId: validatedData.jobId,
        resumeUrl: validatedData.resumeUrl,
        githubUrl: validatedData.githubUrl || null,
        websiteUrl: validatedData.websiteUrl || null,
        coverLetter: validatedData.coverLetter || null,
      },
    });

    // Trigger AI evaluation in background
    try {
      const evaluation = await evaluateCandidate({
        resume: validatedData.resumeUrl, // For MVP, this would be the file content
        github: validatedData.githubUrl,
        website: validatedData.websiteUrl,
        coverLetter: validatedData.coverLetter,
        jobTitle: job.title,
        jobDescription: job.description,
      });

      // Save the evaluation results (convert arrays to JSON strings for SQLite)
      await prisma.score.create({
        data: {
          applicationId: application.id,
          resumeScore: evaluation.resumeScore,
          githubScore: evaluation.githubScore,
          websiteScore: evaluation.websiteScore,
          coverLetterScore: evaluation.coverLetterScore,
          overallScore: evaluation.overallScore,
          technicalSkills: evaluation.technicalSkills,
          experience: evaluation.experience,
          cultureFit: evaluation.cultureFit,
          communication: evaluation.communication,
          strengths: JSON.stringify(evaluation.strengths),
          improvements: JSON.stringify(evaluation.improvements),
          tips: JSON.stringify(evaluation.tips),
        },
      });
    } catch (evaluationError) {
      console.error("Error during AI evaluation:", evaluationError);
      // Application is still created, but evaluation failed
      // We could retry this later or handle it differently
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    let applications;

    if (session.user.role === "EMPLOYER") {
      // Employers see applications for their jobs
      const whereClause: {
        job: {
          employerId: string;
        };
        jobId?: string;
      } = {
        job: {
          employerId: session.user.id,
        },
      };

      if (jobId) {
        whereClause.jobId = jobId;
      }

      applications = await prisma.application.findMany({
        where: whereClause,
        include: {
          candidate: {
            select: {
              name: true,
              email: true,
            },
          },
          job: {
            select: {
              title: true,
              id: true,
            },
          },
          scores: true,
        },
        orderBy: [
          {
            scores: {
              overallScore: "desc",
            },
          },
          {
            createdAt: "desc",
          },
        ],
      });

      // Parse JSON strings back to arrays for response
      applications = applications.map((app) => ({
        ...app,
        scores: app.scores
          ? {
              ...app.scores,
              strengths: JSON.parse(app.scores.strengths),
              improvements: JSON.parse(app.scores.improvements),
              tips: JSON.parse(app.scores.tips),
            }
          : null,
      }));
    } else {
      // Candidates see their own applications
      applications = await prisma.application.findMany({
        where: {
          candidateId: session.user.id,
        },
        include: {
          job: {
            select: {
              title: true,
              id: true,
              employer: {
                select: {
                  name: true,
                  companyName: true,
                },
              },
            },
          },
          scores: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Parse JSON strings back to arrays for response
      applications = applications.map((app) => ({
        ...app,
        scores: app.scores
          ? {
              ...app.scores,
              strengths: JSON.parse(app.scores.strengths),
              improvements: JSON.parse(app.scores.improvements),
              tips: JSON.parse(app.scores.tips),
            }
          : null,
      }));
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
