import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/lib/auth";
import { z } from "zod";

const customQuestionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  type: z.enum(["TEXT", "TEXTAREA", "MULTIPLE_CHOICE", "YES_NO", "NUMBER"]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  order: z.number().default(0),
});

const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  requirements: z.string().optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"])
    .default("FULL_TIME"),
  customQuestions: z.array(customQuestionSchema).optional().default([]),
});

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        employer: {
          select: {
            name: true,
            email: true,
            companyName: true,
          },
        },
        questions: {
          orderBy: {
            order: "asc",
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

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Only employers can post jobs" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createJobSchema.parse(body);

    // Create the job with custom questions in a transaction
    const job = await prisma.$transaction(async (tx) => {
      // Create the job
      const newJob = await tx.job.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          requirements: validatedData.requirements,
          location: validatedData.location,
          salary: validatedData.salary,
          type: validatedData.type,
          employerId: session.user.id,
        },
      });

      // Create custom questions if any
      if (
        validatedData.customQuestions &&
        validatedData.customQuestions.length > 0
      ) {
        await tx.jobQuestion.createMany({
          data: validatedData.customQuestions.map((q) => ({
            jobId: newJob.id,
            question: q.question,
            type: q.type,
            required: q.required,
            options: q.options ? JSON.stringify(q.options) : null,
            order: q.order,
          })),
        });
      }

      // Return the job with questions
      return await tx.job.findUnique({
        where: { id: newJob.id },
        include: {
          employer: {
            select: {
              name: true,
              email: true,
              companyName: true,
            },
          },
          questions: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
