"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Eye, Star, Calendar, MapPin, Mail, Github, Globe } from "lucide-react"
import Link from "next/link"

interface Application {
  id: number
  candidateName: string
  email: string
  phone: string
  location: string
  appliedDate: string
  status: string
  aiScore: number
  experience: string
  skills: string[]
  portfolioUrl: string
  githubUrl: string
  resumeSnippet: string
  coverLetterSnippet: string
  avatar: string
  componentScores: {
    skillsMatch: number
    experienceFit: number
    communication: number
  }
  jobId?: number
}

interface ApplicationCardProps {
  application: Application
  onViewDetails: (application: Application) => void
}

export function ApplicationCard({ application, onViewDetails }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={application.avatar || "/placeholder.svg"} alt={application.candidateName} />
              <AvatarFallback>
                {application.candidateName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{application.candidateName}</CardTitle>
              <CardDescription className="flex items-center space-x-4 mt-1">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {application.email}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {application.location}
                </div>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(application.status)} variant="outline">
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(application.aiScore)}`}>{application.aiScore}%</div>
              <div className="text-xs text-gray-500">AI Score</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Info */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Applied {formatDate(application.appliedDate)}
            </div>
            <div>{application.experience} experience</div>
          </div>
          <div className="flex items-center space-x-2">
            {application.portfolioUrl && (
              <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
              </a>
            )}
            {application.githubUrl && (
              <a href={application.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex flex-wrap gap-2">
            {application.skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {application.skills.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{application.skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {/* Component Scores */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Skills Match</span>
              <span className={getScoreColor(application.componentScores.skillsMatch)}>
                {application.componentScores.skillsMatch}%
              </span>
            </div>
            <Progress value={application.componentScores.skillsMatch} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Experience</span>
              <span className={getScoreColor(application.componentScores.experienceFit)}>
                {application.componentScores.experienceFit}%
              </span>
            </div>
            <Progress value={application.componentScores.experienceFit} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Communication</span>
              <span className={getScoreColor(application.componentScores.communication)}>
                {application.componentScores.communication}%
              </span>
            </div>
            <Progress value={application.componentScores.communication} className="h-2" />
          </div>
        </div>

        {/* Resume/Cover Letter Snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Resume Summary</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{application.resumeSnippet}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Cover Letter</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{application.coverLetterSnippet}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-2">
            <Link href={`/recruiter/jobs/${application.jobId || 1}/applications/${application.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Shortlist
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Schedule Interview
            </Button>
            <Button size="sm">Contact Candidate</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
