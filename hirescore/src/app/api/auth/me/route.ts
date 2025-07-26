import { NextRequest, NextResponse } from "next/server";
import { getSessionFromHeaders } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromHeaders(request.headers);

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
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
    response.cookies.delete("auth-token");
    return response;
  }
}
