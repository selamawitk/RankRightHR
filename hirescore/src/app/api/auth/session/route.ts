import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      sessionToken,
      process.env.BETTER_AUTH_SECRET || "default-secret"
    ) as { userId: string };

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.session.delete({
          where: { token: sessionToken },
        });
      }

      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete("session-token");
      return response;
    }

    return NextResponse.json(
      {
        user: session.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session error:", error);
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete("session-token");
    return response;
  }
}
