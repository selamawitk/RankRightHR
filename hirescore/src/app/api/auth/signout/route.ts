import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (token) {
      // Delete session from database
      await deleteSession(token);
    }

    // Clear the session cookie
    const response = NextResponse.json({
      message: "Signed out successfully",
    });

    response.cookies.delete("auth-token");

    return response;
  } catch (error) {
    console.error("Sign out error:", error);

    // Even if there's an error, clear the cookie
    const response = NextResponse.json({
      message: "Signed out successfully",
    });

    response.cookies.delete("auth-token");
    return response;
  }
}
