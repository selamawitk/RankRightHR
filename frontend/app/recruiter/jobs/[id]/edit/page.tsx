"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, X, Save, Eye, Trash2, AlertTriangle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock job data - in real app, fetch based on ID
const mockJobData = {
  id: 1,
  title: "Senior Frontend Developer",
  description: `We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences. You will work with modern technologies and collaborate with a talented team of designers and developers.

Key Responsibilities:
• Develop and maintain high-quality web applications using React and TypeScript
• Collaborate with designers to implement pixel-perfect UI components
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and contribute to team best practices

Requirements:
• 5+ years of experience in frontend development
• Strong proficiency in React, TypeScript, and modern JavaScript
• Experience with Next.js and server-side rendering
• Knowledge of CSS frameworks like Tailwind CSS
• Familiarity with version control systems (Git)
• Excellent problem-solving and communication skills`,
  location: "San Francisco, CA",
  experienceLevel: "senior",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
  jobType: "full-time",
  workMode: "hybrid",
  salaryMin: "120000",
  salaryMax: "180000",
  isActive: true,
  applicationDeadline: "2024-03-15",
  postedDate: "2024-01-15",
  totalApplications: 24,
  company: "TechCorp Inc.",
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    experienceLevel: "",
    skills: [] as string[],
    currentSkill: "",
    jobType: "",
    workMode: "",
    salaryMin: "",
    salaryMax: "",
    isActive: true,
    applicationDeadline: "",
  })

  // Load job data on component mount
  useEffect(() => {
    // In real app, fetch job data based on params.id
    setFormData({
      title: mockJobData.title,
      description: mockJobData.description,
      location: mockJobData.location,
      experienceLevel: mockJobData.experienceLevel,
      skills: mockJobData.skills,
      currentSkill: "",
      jobType: mockJobData.jobType,
      workMode: mockJobData.workMode,
      salaryMin: mockJobData.salaryMin,
      salaryMax: mockJobData.salaryMax,
      isActive: mockJobData.isActive,
      applicationDeadline: mockJobData.applicationDeadline,
    })
  }, [params.id])

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    setHasUnsavedChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      console.log("Updating job:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setHasUnsavedChanges(false)
      // Show success message or redirect
      router.push("/recruiter/jobs")
    } catch (error) {
      console.error("Error updating job:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (formData.currentSkill.trim() && !formData.skills.includes(formData.currentSkill.trim())) {
      handleInputChange("skills", [...formData.skills, formData.currentSkill.trim()])
      handleInputChange("currentSkill", "")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    handleInputChange(
      "skills",
      formData.skills.filter((skill) => skill !== skillToRemove),
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const handleDeleteJob = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      console.log("Deleting job:", params.id)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/recruiter/jobs")
    } catch (error) {
      console.error("Error deleting job:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout userType="recruiter">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/recruiter/jobs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
              <p className="text-gray-600">
                Modify your job posting • {mockJobData.totalApplications} applications received
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/recruiter/jobs/${params.id}/applications`}>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Applications
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Delete Job Posting
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this job posting? This action cannot be undone and will remove all{" "}
                    {mockJobData.totalApplications} applications associated with this job.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteJob} className="bg-red-600 hover:bg-red-700">
                    Delete Job
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the core details of your job posting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => handleInputChange("experienceLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select value={formData.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workMode">Work Mode</Label>
                  <Select value={formData.workMode} onValueChange={(value) => handleInputChange("workMode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary (USD)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="e.g. 120000"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary (USD)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="e.g. 180000"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>Add the key skills required for this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill and press Enter"
                  value={formData.currentSkill}
                  onChange={(e) => handleInputChange("currentSkill", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Provide a detailed description of the role and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={12}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </CardContent>
          </Card>

          {/* Job Status */}
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
              <CardDescription>Control whether this job is actively accepting applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isActive" className="text-base font-medium">
                    Active Job Posting
                  </Label>
                  <p className="text-sm text-gray-600">When enabled, candidates can view and apply to this job</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Last updated: {new Date(mockJobData.postedDate).toLocaleDateString()}
            </div>
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
