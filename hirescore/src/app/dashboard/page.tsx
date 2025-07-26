"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/lib/auth-client";
import type { AuthUser } from "@/types/auth";
import {
  Plus,
  Briefcase,
  Users,
  LogOut,
  User,
  BarChart3,
  Building,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold text-black">HireScore</div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-gray-900">
                    {user.name || user.email}
                  </span>
                  {user.role === "EMPLOYER" && user.companyName && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {user.companyName}
                    </span>
                  )}
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full lowercase">
                  {user.role.toLowerCase()}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-black h-8 px-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="py-12 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-black mb-3">
            Welcome back, {user.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-gray-600 text-lg">
            {user.role === "EMPLOYER"
              ? `Manage your job postings and review applications${
                  user.companyName ? ` for ${user.companyName}` : ""
                }.`
              : "Discover new opportunities and track your applications."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="py-12">
          {user.role === "EMPLOYER" ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Post new job
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Create a new job posting to attract qualified candidates.
                </p>
                <Link href="/jobs/create">
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-9 px-4 text-sm">
                    Create job
                  </Button>
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Active jobs
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Manage your current job postings and view their performance.
                </p>
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No active jobs</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Applications
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Review and manage candidate applications with AI insights.
                </p>
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No applications yet</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Browse jobs
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Discover new opportunities that match your skills and
                  interests.
                </p>
                <Link href="/jobs">
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-9 px-4 text-sm">
                    View jobs
                  </Button>
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  My applications
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Track your job applications and view AI feedback.
                </p>
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No applications yet</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <User className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Profile
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Update your profile information and preferences.
                </p>
                <Button
                  variant="outline"
                  className="border-gray-200 text-black hover:bg-gray-50 rounded-md h-9 px-4 text-sm"
                >
                  Edit profile
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="py-12 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-black mb-8">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-black mb-1">0</div>
              <div className="text-sm text-gray-600">
                {user.role === "EMPLOYER" ? "Active jobs" : "Applications sent"}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-black mb-1">0</div>
              <div className="text-sm text-gray-600">
                {user.role === "EMPLOYER"
                  ? "Total applications"
                  : "Responses received"}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-black mb-1">0</div>
              <div className="text-sm text-gray-600">
                {user.role === "EMPLOYER" ? "Pending review" : "In progress"}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-black mb-1">0</div>
              <div className="text-sm text-gray-600">
                {user.role === "EMPLOYER" ? "Hired this month" : "Interviews"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
