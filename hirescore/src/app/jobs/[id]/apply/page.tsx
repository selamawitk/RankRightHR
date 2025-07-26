"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Clock,
  Building,
  FileText,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salary?: string;
  type: string;
  employer: {
    name?: string;
    companyName?: string;
  };
  questions: Array<{
    id: string;
    question: string;
    type: string;
    required: boolean;
    options?: string;
  }>;
}

interface ApplicationData {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeFile: File | null;
  resumeText: string;
  githubUrl: string;
  websiteUrl: string;
  coverLetter: string;
  questionAnswers: Record<string, string>;
}

export default function ApplyJobPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState<ApplicationData>({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    resumeFile: null,
    resumeText: "",
    githubUrl: "",
    websiteUrl: "",
    coverLetter: "",
    questionAnswers: {},
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);
        } else {
          setError("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      questionAnswers: {
        ...prev.questionAnswers,
        [questionId]: answer,
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resumeFile: file }));

      // For MVP, we'll ask user to paste CV text
      // In production, you'd implement PDF parsing
      setFormData((prev) => ({ ...prev, resumeText: "" }));
    }
  };

  const formatJobType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const validateForm = () => {
    if (!formData.candidateName.trim()) return "Name is required";
    if (!formData.candidateEmail.trim()) return "Email is required";
    if (!formData.resumeText.trim() && !formData.resumeFile)
      return "Resume is required";

    // Check required custom questions
    if (job?.questions) {
      for (const question of job.questions) {
        if (
          question.required &&
          !formData.questionAnswers[question.id]?.trim()
        ) {
          return `Please answer: ${question.question}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // For MVP, we'll send resume text directly
      // In production, you'd handle file upload properly
      const applicationData = {
        jobId: params.id,
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        candidatePhone: formData.candidatePhone,
        resumeText: formData.resumeText,
        resumeUrl: "text-resume", // Placeholder for MVP
        githubUrl: formData.githubUrl || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        coverLetter: formData.coverLetter || undefined,
        questionAnswers: formData.questionAnswers,
      };

      const response = await fetch("/api/applications/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      setSuccess(
        "Application submitted successfully! You will be contacted if selected."
      );

      // Clear form
      setFormData({
        candidateName: "",
        candidateEmail: "",
        candidatePhone: "",
        resumeFile: null,
        resumeText: "",
        githubUrl: "",
        websiteUrl: "",
        coverLetter: "",
        questionAnswers: {},
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-4">
            The job you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/jobs">
            <Button className="bg-black text-white hover:bg-gray-800">
              Browse Jobs
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
            <Link href="/jobs" className="text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-black">
              Apply for Position
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Job Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-3">{job.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {job.employer.companyName && (
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {job.employer.companyName}
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </div>
            )}
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 mb-4">
            <Clock className="h-3 w-3 mr-1" />
            {formatJobType(job.type)}
          </Badge>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-black">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="candidateName"
                  className="text-sm font-medium text-black"
                >
                  Full Name *
                </Label>
                <Input
                  id="candidateName"
                  name="candidateName"
                  required
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="candidateEmail"
                  className="text-sm font-medium text-black"
                >
                  Email Address *
                </Label>
                <Input
                  id="candidateEmail"
                  name="candidateEmail"
                  type="email"
                  required
                  value={formData.candidateEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="candidatePhone"
                  className="text-sm font-medium text-black"
                >
                  Phone Number
                </Label>
                <Input
                  id="candidatePhone"
                  name="candidatePhone"
                  type="tel"
                  value={formData.candidatePhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Resume/CV */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-black">Resume/CV *</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="resumeFile"
                  className="text-sm font-medium text-black"
                >
                  Upload Resume (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="resumeFile" className="cursor-pointer">
                    <span className="text-black font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  {formData.resumeFile && (
                    <p className="text-sm text-green-600 mt-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      {formData.resumeFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="resumeText"
                  className="text-sm font-medium text-black"
                >
                  Resume Content * (Paste your CV text below)
                </Label>
                <Textarea
                  id="resumeText"
                  name="resumeText"
                  required
                  value={formData.resumeText}
                  onChange={handleInputChange}
                  placeholder="Paste your complete CV/resume content here. Include your experience, education, skills, and achievements..."
                  rows={12}
                  className="border-gray-200 focus:border-black focus:ring-0"
                />
                <p className="text-sm text-gray-500">
                  Our AI will analyze this content to match you with the job
                  requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-black">
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="githubUrl"
                  className="text-sm font-medium text-black"
                >
                  GitHub Profile
                </Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="websiteUrl"
                  className="text-sm font-medium text-black"
                >
                  Portfolio/Website
                </Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="coverLetter"
                className="text-sm font-medium text-black"
              >
                Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                rows={6}
                className="border-gray-200 focus:border-black focus:ring-0"
              />
            </div>
          </div>

          {/* Custom Questions */}
          {job.questions && job.questions.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-black">
                Additional Questions
              </h3>

              <div className="space-y-6">
                {job.questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-sm font-medium text-black">
                      {question.question}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>

                    {question.type === "TEXT" && (
                      <Input
                        value={formData.questionAnswers[question.id] || ""}
                        onChange={(e) =>
                          handleQuestionAnswer(question.id, e.target.value)
                        }
                        placeholder="Your answer..."
                        className="h-10 border-gray-200 focus:border-black focus:ring-0"
                        required={question.required}
                      />
                    )}

                    {question.type === "TEXTAREA" && (
                      <Textarea
                        value={formData.questionAnswers[question.id] || ""}
                        onChange={(e) =>
                          handleQuestionAnswer(question.id, e.target.value)
                        }
                        placeholder="Your answer..."
                        rows={4}
                        className="border-gray-200 focus:border-black focus:ring-0"
                        required={question.required}
                      />
                    )}

                    {question.type === "MULTIPLE_CHOICE" &&
                      question.options && (
                        <select
                          value={formData.questionAnswers[question.id] || ""}
                          onChange={(e) =>
                            handleQuestionAnswer(question.id, e.target.value)
                          }
                          className="h-10 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-0"
                          required={question.required}
                        >
                          <option value="">Select an option...</option>
                          {JSON.parse(question.options).map(
                            (option: string, index: number) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            )
                          )}
                        </select>
                      )}

                    {question.type === "YES_NO" && (
                      <select
                        value={formData.questionAnswers[question.id] || ""}
                        onChange={(e) =>
                          handleQuestionAnswer(question.id, e.target.value)
                        }
                        className="h-10 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-0"
                        required={question.required}
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    )}

                    {question.type === "NUMBER" && (
                      <Input
                        type="number"
                        value={formData.questionAnswers[question.id] || ""}
                        onChange={(e) =>
                          handleQuestionAnswer(question.id, e.target.value)
                        }
                        placeholder="Enter number..."
                        className="h-10 border-gray-200 focus:border-black focus:ring-0"
                        required={question.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-gray-800 rounded-md h-10 px-8"
              >
                {isSubmitting
                  ? "Submitting Application..."
                  : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/jobs")}
                className="border-gray-200 text-black hover:bg-gray-50 rounded-md h-10 px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
