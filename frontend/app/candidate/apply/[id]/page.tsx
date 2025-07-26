"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock job data - in real app, fetch based on ID
const jobData = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  description:
    "We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences. You will work with modern technologies and collaborate with a talented team of designers and developers.",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  experienceLevel: "Senior Level",
}

export default function ApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    resume: "",
    portfolioUrl: "",
    githubUrl: "",
    coverLetter: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    console.log("Submitting application:", formData)
    // Redirect to results page
    router.push(`/candidate/application-result/${params.id}`)
  }

  return (
    <DashboardLayout userType="candidate">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        {/* Job Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{jobData.title}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {jobData.company} • {jobData.location}
                </CardDescription>
              </div>
              <Badge variant="secondary">{jobData.experienceLevel}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{jobData.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {jobData.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Application</CardTitle>
            <CardDescription>Fill out the form below to apply for this position</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV *</Label>
                <Textarea
                  id="resume"
                  placeholder="Paste your resume content here or describe your experience, education, and skills..."
                  rows={8}
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-500">
                  You can paste your resume text or provide a summary of your experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub Profile</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter *</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                  rows={6}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Submit Application
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
