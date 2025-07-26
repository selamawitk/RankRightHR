import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import type { AuthSession } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

  // Store session in database
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return token;
}

export async function verifySession(
  token: string
): Promise<AuthSession | null> {
  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Check if session exists in database and is valid
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            companyName: true,
            role: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.session.delete({ where: { token } });
      }
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        companyName: session.user.companyName,
        role: session.user.role as "EMPLOYER" | "CANDIDATE" | "ADMIN",
      },
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    return null;
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await prisma.session.deleteMany({
      where: { token },
    });
  } catch (error) {
    // Ignore errors when deleting sessions
  }
}

// Helper function to get session from request headers
export async function getSessionFromHeaders(
  headers: Headers
): Promise<AuthSession | null> {
  // Try to get token from Authorization header
  const authHeader = headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifySession(token);
  }

  // Try to get token from cookie header
  const cookieHeader = headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    // Check for both possible cookie names
    const token = cookies["auth-token"] || cookies["session-token"];
    if (token) {
      return verifySession(token);
    }
  }

  return null;
}
