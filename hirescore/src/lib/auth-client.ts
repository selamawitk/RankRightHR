"use client";

import type { AuthUser } from "@/types/auth";

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  companyName?: string;
  role: "EMPLOYER" | "CANDIDATE";
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Sign up failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export async function signIn(data: SignInData) {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Sign in failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Clear any client-side auth state if needed
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
