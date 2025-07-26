"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Star,
  Mail,
  Phone,
  Calendar,
  Github,
  Globe,
  FileText,
  Award,
  TrendingUp,
  MapPin,
  Building,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
} from "lucide-react";

interface ApplicationDetail {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resumeUrl: string;
  resumeText?: string;
  githubUrl?: string;
  websiteUrl?: string;
  coverLetter?: string;
  job: {
    id: string;
    title: string;
    description: string;
    location?: string;
    type: string;
    salary?: string;
    requirements?: string;
    createdAt: string;
  };
  scores?: {
    resumeScore: number;
    coverLetterScore?: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    tips: string[];
    feedback: string;
    createdAt: string;
  };
  questionAnswers: Array<{
    questionId: string;
    question: string;
    questionType: string;
    required: boolean;
    answer: string;
  }>;
}

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "REVIEWING",
    label: "Reviewing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "INTERVIEWED",
    label: "Interviewed",
    color: "bg-purple-100 text-purple-800",
  },
  { value: "HIRED", label: "Hired", color: "bg-green-100 text-green-800" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>;
}) {
  const resolvedParams = use(params);
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `/api/applications/${resolvedParams.applicationId}`,
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch application details"
          );
        }

        const applicationData = await response.json();
        setApplication(applicationData);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load application details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [resolvedParams.applicationId, router]);

  const updateStatus = async (newStatus: string) => {
    console.log("Updating application status to:", newStatus);
    setIsUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/applications/${resolvedParams.applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log("Status update response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Status update failed:", errorData);
        throw new Error(errorData.error || "Failed to update status");
      }

      const result = await response.json();
      console.log("Status update successful:", result);
      setSuccess(`Application status updated successfully! ${application.candidateEmail ? 'Email notification sent to candidate.' : ''}`);

      // Update local state
      if (application) {
        setApplication({
          ...application,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        });
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Status update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update status");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatJobType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href={`/jobs/${resolvedParams.id}/applicants`}>
            <Button className="bg-black text-white hover:bg-gray-800">
              Back to Applicants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">
            Application Not Found
          </h1>
          <Link href={`/jobs/${resolvedParams.id}/applicants`}>
            <Button className="bg-black text-white hover:bg-gray-800">
              Back to Applicants
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
          <div className="flex h-16 items-center gap-4">
            <Link
              href={`/jobs/${resolvedParams.id}/applicants`}
              className="text-gray-600 hover:text-black"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <h1 className="text-xl font-semibold text-black">
                Application Details
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert
            variant="destructive"
            className="border-red-200 bg-red-50 mb-6"
          >
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Candidate Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {application.candidateName}
                  </h2>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      className={`${getStatusColor(
                        application.status
                      )} border-0`}
                    >
                      {application.status.toLowerCase().replace("_", " ")}
                    </Badge>
                    {application.scores && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span
                          className={`font-semibold ${getScoreColor(
                            application.scores.overallScore
                          )}`}
                        >
                          {application.scores.overallScore}/10 (
                          {getScoreLabel(application.scores.overallScore)})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>Applied: {formatDate(application.createdAt)}</div>
                  <div>Updated: {formatDate(application.updatedAt)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <a
                    href={`mailto:${application.candidateEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {application.candidateEmail}
                  </a>
                </div>
                {application.candidatePhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <a
                      href={`tel:${application.candidatePhone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {application.candidatePhone}
                    </a>
                  </div>
                )}
                {application.githubUrl && (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-gray-600" />
                    <a
                      href={application.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {application.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <a
                      href={application.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Portfolio
                    </a>
                  </div>
                )}
              </div>

              {application.resumeUrl &&
                application.resumeUrl !== "text-resume" && (
                  <div className="mb-6">
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </div>
                )}

              {/* Cover Letter */}
              {application.coverLetter && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Cover Letter
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Question Answers */}
              {application.questionAnswers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    {application.questionAnswers.map((qa, index) => (
                      <div
                        key={qa.questionId}
                        className="border-l-4 border-gray-200 pl-4"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-black">
                            {qa.question}
                          </p>
                          {qa.required && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                        </div>
                        <p className="text-gray-700">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Evaluation */}
            {application.scores && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  AI Evaluation Report
                </h3>

                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        application.scores.resumeScore
                      )} mb-1`}
                    >
                      {application.scores.resumeScore}/10
                    </div>
                    <div className="text-sm text-gray-600">Resume Score</div>
                    <div
                      className={`text-xs font-medium ${getScoreColor(
                        application.scores.resumeScore
                      )}`}
                    >
                      {getScoreLabel(application.scores.resumeScore)}
                    </div>
                  </div>
                  {application.scores.coverLetterScore && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div
                        className={`text-3xl font-bold ${getScoreColor(
                          application.scores.coverLetterScore
                        )} mb-1`}
                      >
                        {application.scores.coverLetterScore}/10
                      </div>
                      <div className="text-sm text-gray-600">Cover Letter</div>
                      <div
                        className={`text-xs font-medium ${getScoreColor(
                          application.scores.coverLetterScore
                        )}`}
                      >
                        {getScoreLabel(application.scores.coverLetterScore)}
                      </div>
                    </div>
                  )}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        application.scores.overallScore
                      )} mb-1`}
                    >
                      {application.scores.overallScore}/10
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                    <div
                      className={`text-xs font-medium ${getScoreColor(
                        application.scores.overallScore
                      )}`}
                    >
                      {getScoreLabel(application.scores.overallScore)}
                    </div>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {application.scores.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="text-green-700 text-sm flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {application.scores.improvements.map(
                        (improvement, index) => (
                          <li
                            key={index}
                            className="text-yellow-700 text-sm flex items-start gap-2"
                          >
                            <span className="text-yellow-500 mt-1">•</span>
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Hiring Tips
                    </h4>
                    <ul className="space-y-1">
                      {application.scores.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-blue-700 text-sm flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Detailed Feedback
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {application.scores.feedback}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  AI evaluation generated on{" "}
                  {formatDate(application.scores.createdAt)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-black mb-4">
                Job Information
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-black">
                    {application.job.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    {application.job.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{application.job.location}</span>
                        <span>•</span>
                      </>
                    )}
                    <Clock className="h-3 w-3" />
                    <span>{formatJobType(application.job.type)}</span>
                  </div>
                  {application.job.salary && (
                    <div className="text-sm text-gray-600 mt-1">
                      {application.job.salary}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-3">Update Status</h4>
                  <div className="space-y-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => updateStatus(status.value)}
                        disabled={
                          isUpdatingStatus ||
                          application.status === status.value
                        }
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors relative ${
                          application.status === status.value
                            ? `${status.color} font-medium`
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{status.label}</span>
                          <div className="flex items-center gap-2">
                            {isUpdatingStatus &&
                              application.status !== status.value && (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              )}
                            {application.status === status.value && (
                              <span className="text-green-600 font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {isUpdatingStatus && (
                    <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      Updating status...
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link href={`/jobs/${resolvedParams.id}/applicants`}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 text-black hover:bg-gray-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to All Applicants
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
