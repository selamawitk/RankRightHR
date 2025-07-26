import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  companyName: z.string().optional(),
  role: z.enum(["EMPLOYER", "CANDIDATE"]).default("EMPLOYER"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        companyName: validatedData.companyName,
        role: validatedData.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        role: true,
        createdAt: true,
      },
    });

    // Create session
    const token = await createSession(user.id);

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          companyName: user.companyName,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Sign up error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
