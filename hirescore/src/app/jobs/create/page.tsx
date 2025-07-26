"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCurrentUser } from "@/lib/auth-client";
import type { AuthUser } from "@/types/auth";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CustomQuestion {
  id: string;
  question: string;
  type: "TEXT" | "TEXTAREA" | "MULTIPLE_CHOICE" | "YES_NO" | "NUMBER";
  required: boolean;
  options?: string[];
}

export default function CreateJobPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    type: "FULL_TIME" as
      | "FULL_TIME"
      | "PART_TIME"
      | "CONTRACT"
      | "FREELANCE"
      | "INTERNSHIP",
  });

  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }
        if (currentUser.role !== "EMPLOYER") {
          router.push("/dashboard");
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "TEXT",
      required: false,
      options: [],
    };
    setCustomQuestions([...customQuestions, newQuestion]);
  };

  const updateCustomQuestion = (
    id: string,
    field: keyof CustomQuestion,
    value: any
  ) => {
    setCustomQuestions((questions) =>
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((questions) => questions.filter((q) => q.id !== id));
  };

  const addOption = (questionId: string) => {
    setCustomQuestions((questions) =>
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...(q.options || []), ""] } : q
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setCustomQuestions((questions) =>
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setCustomQuestions((questions) =>
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, idx) => idx !== optionIndex),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          customQuestions: customQuestions.map((q, index) => ({
            question: q.question,
            type: q.type,
            required: q.required,
            options:
              q.type === "MULTIPLE_CHOICE"
                ? q.options?.filter((opt) => opt.trim())
                : undefined,
            order: index,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create job");
      }

      setSuccess("Job posted successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setIsSubmitting(false);
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-black">
              Create Job Posting
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
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

          {/* Basic Job Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Job Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-black"
                >
                  Job Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-sm font-medium text-black"
                >
                  Job Type *
                </Label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="h-10 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-0"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-black"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Remote, New York, NY"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="salary"
                  className="text-sm font-medium text-black"
                >
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. $80,000 - $120,000"
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-black"
              >
                Job Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
                className="border-gray-200 focus:border-black focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="requirements"
                className="text-sm font-medium text-black"
              >
                Requirements
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="List the key requirements, skills, and qualifications..."
                rows={4}
                className="border-gray-200 focus:border-black focus:ring-0"
              />
            </div>
          </div>

          {/* Custom Questions */}
          <div className="space-y-6 border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Custom Questions
              </h2>
              <Button
                type="button"
                onClick={addCustomQuestion}
                className="bg-black text-white hover:bg-gray-800 rounded-md h-9 px-4 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {customQuestions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No custom questions added. Click &quot;Add Question&quot; to
                create application-specific questions.
              </p>
            ) : (
              <div className="space-y-6">
                {customQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-black">
                        Question {index + 1}
                      </h3>
                      <Button
                        type="button"
                        onClick={() => removeCustomQuestion(question.id)}
                        variant="ghost"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-black">
                          Question
                        </Label>
                        <Input
                          value={question.question}
                          onChange={(e) =>
                            updateCustomQuestion(
                              question.id,
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="Enter your question..."
                          className="h-10 border-gray-200 focus:border-black focus:ring-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-black">
                          Type
                        </Label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            updateCustomQuestion(
                              question.id,
                              "type",
                              e.target.value
                            )
                          }
                          className="h-10 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-0"
                        >
                          <option value="TEXT">Short Text</option>
                          <option value="TEXTAREA">Long Text</option>
                          <option value="MULTIPLE_CHOICE">
                            Multiple Choice
                          </option>
                          <option value="YES_NO">Yes/No</option>
                          <option value="NUMBER">Number</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id={`required-${question.id}`}
                        checked={question.required}
                        onChange={(e) =>
                          updateCustomQuestion(
                            question.id,
                            "required",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <Label
                        htmlFor={`required-${question.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        Required
                      </Label>
                    </div>

                    {question.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-black">
                            Options
                          </Label>
                          <Button
                            type="button"
                            onClick={() => addOption(question.id)}
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-black hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <Input
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${optionIndex + 1}`}
                              className="h-9 border-gray-200 focus:border-black focus:ring-0"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                removeOption(question.id, optionIndex)
                              }
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-gray-800 rounded-md h-10 px-8"
              >
                {isSubmitting ? "Creating Job..." : "Post Job"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
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
