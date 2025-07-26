import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session-token")?.value;

    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      });
    }

    // Clear the session cookie
    const response = NextResponse.json({
      message: "Signed out successfully",
    });

    response.cookies.delete("session-token");

    return response;
  } catch (error) {
    console.error("Sign out error:", error);

    // Even if there's an error, clear the cookie
    const response = NextResponse.json({
      message: "Signed out successfully",
    });

    response.cookies.delete("session-token");
    return response;
  }
}
