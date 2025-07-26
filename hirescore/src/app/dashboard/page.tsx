"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Building,
  Briefcase,
  Clock,
  MapPin,
  Star
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName?: string | null;
}

interface DashboardData {
  stats: {
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    hiredThisMonth: number;
  };
  jobs: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    applicationsCount: number;
    type: string;
    location?: string;
  }>;
  recentApplications: Array<{
    id: string;
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    status: string;
    createdAt: string;
    overallScore?: number;
    resumeScore?: number;
    coverLetterScore?: number;
  }>;
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }
        setUser(currentUser);
        
        if (currentUser.role === "EMPLOYER") {
          const response = await fetch("/api/dashboard", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatJobType = (type: string) => {
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWING":
        return "bg-blue-100 text-blue-800";
      case "INTERVIEWED":
        return "bg-purple-100 text-purple-800";
      case "HIRED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "EMPLOYER") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only employers can access the dashboard.</p>
          <Link href="/">
            <Button className="bg-black text-white hover:bg-gray-800">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 text-gray-600" />
              <div>
                <h1 className="text-xl font-semibold text-black">
                  {user.companyName || user.name}
                </h1>
                <p className="text-sm text-gray-600">Employer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/jobs/create">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-10 px-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Statistics */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-black">{dashboardData.stats.activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-black">{dashboardData.stats.totalApplications}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-black">{dashboardData.stats.pendingApplications}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hired This Month</p>
                  <p className="text-3xl font-bold text-black">{dashboardData.stats.hiredThisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Your Job Posts</h2>
              <Link href="/jobs/create">
                <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50 h-9 px-3">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Job
                </Button>
              </Link>
            </div>

            {dashboardData?.jobs && dashboardData.jobs.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.jobs.slice(0, 5).map((job) => (
                  <Link 
                    key={job.id} 
                    href={`/jobs/${job.id}/applicants`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-black">{job.title}</h3>
                          <Badge className={`${getStatusColor(job.status)} border-0 text-xs`}>
                            {job.status.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(job.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatJobType(job.type)}
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-black">{job.applicationsCount}</div>
                        <div className="text-xs text-gray-600">applications</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {dashboardData.jobs.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">No jobs posted yet</h3>
                    <p className="text-gray-600 mb-4">Create your first job posting to start receiving applications.</p>
                    <Link href="/jobs/create">
                      <Button className="bg-black text-white hover:bg-gray-800">
                        Create Your First Job
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No jobs posted yet</h3>
                <p className="text-gray-600 mb-4">Create your first job posting to start receiving applications.</p>
                <Link href="/jobs/create">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Create Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Recent Applications</h2>
            </div>

            {dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-black">{application.candidateName}</h4>
                        <p className="text-sm text-gray-600">{application.jobTitle}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getApplicationStatusColor(application.status)} border-0 text-xs mb-1`}>
                          {application.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                        {application.overallScore && (
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className={`text-sm font-medium ${getScoreColor(application.overallScore)}`}>
                              {application.overallScore}/10
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{application.candidateEmail}</span>
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No applications yet</h3>
                <p className="text-gray-600">Applications will appear here when candidates apply to your jobs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
