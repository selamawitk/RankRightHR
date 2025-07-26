"use client";

import { useState, useEffect, use } from "react";
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
  Loader2,
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

export default function ApplyJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [evaluationStatus, setEvaluationStatus] = useState("");
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
        const response = await fetch(`/api/jobs/${resolvedParams.id}`);
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
  }, [resolvedParams.id]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOC, or DOCX file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size must be less than 10MB");
        return;
      }

      setFormData((prev) => ({ ...prev, resumeFile: file }));
      setError("");

      // Extract text from file (basic implementation)
      if (file.type === "text/plain") {
        const text = await file.text();
        setFormData((prev) => ({ ...prev, resumeText: text }));
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobId", resolvedParams.id);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const result = await response.json();
    return result.fileUrl;
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
    if (!formData.resumeFile) return "Please upload your resume";

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
    setEvaluationStatus("Preparing application...");

    try {
      let resumeUrl = "text-resume";

      // Upload file if provided
      if (formData.resumeFile) {
        setEvaluationStatus("Uploading resume...");
        setUploadProgress(25);
        resumeUrl = await uploadFile(formData.resumeFile);
        setUploadProgress(50);
      }

      setEvaluationStatus("Submitting application and analyzing with AI...");
      setUploadProgress(75);

      const applicationData = {
        jobId: resolvedParams.id,
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        candidatePhone: formData.candidatePhone,
        resumeText: formData.resumeText,
        resumeUrl: resumeUrl,
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

      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      const result = await response.json();

      setSuccess(
        `Application submitted successfully! Your application has been evaluated by AI and sent to the employer. Application ID: ${result.applicationId}`
      );
      setEvaluationStatus("");

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
      setEvaluationStatus("");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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

          {/* Evaluation Status */}
          {evaluationStatus && (
            <Alert className="border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <AlertDescription className="text-blue-800">
                  {evaluationStatus}
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </div>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  Upload Resume *
                </Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                    required
                  />
                  <Label htmlFor="resumeFile" className="cursor-pointer">
                    <span className="text-black font-medium text-lg">
                      Click to upload your resume
                    </span>
                    <br />
                    <span className="text-gray-600">or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  {formData.resumeFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          {formData.resumeFile.name}
                        </span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">
                        {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Our AI will analyze your resume to match you with the job
                  requirements and provide instant feedback.
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                className="bg-black text-white hover:bg-gray-800 rounded-md h-10 px-8 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing Application...
                  </div>
                ) : (
                  "Submit Application"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/jobs")}
                disabled={isSubmitting}
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
