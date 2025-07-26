"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  Download,
  Briefcase,
  Building,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock applications data for the candidate
const candidateApplications = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    appliedDate: "2024-01-20",
    status: "under_review",
    aiScore: 92,
    jobType: "Full-time",
    salary: "$120,000 - $180,000",
    description: "We are looking for a skilled Frontend Developer to join our team...",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    companyLogo: "/placeholder.svg?height=40&width=40",
    lastUpdate: "2024-01-22",
    updateMessage: "Your application is being reviewed by our technical team",
    componentScores: {
      skillsMatch: 95,
      experienceFit: 88,
      communication: 93,
    },
    timeline: [
      {
        date: "2024-01-20",
        status: "submitted",
        message: "Application submitted successfully",
      },
      {
        date: "2024-01-21",
        status: "ai_reviewed",
        message: "AI analysis completed - 92% match",
      },
      {
        date: "2024-01-22",
        status: "under_review",
        message: "Application under review by hiring team",
      },
    ],
  },
  {
    id: 2,
    jobTitle: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    appliedDate: "2024-01-18",
    status: "interview_scheduled",
    aiScore: 87,
    jobType: "Full-time",
    salary: "$130,000 - $160,000",
    description: "Join our product team to drive innovation and deliver exceptional products...",
    skills: ["Product Strategy", "Analytics", "Agile", "User Research"],
    companyLogo: "/placeholder.svg?height=40&width=40",
    lastUpdate: "2024-01-23",
    updateMessage: "Interview scheduled for January 25th at 2:00 PM",
    componentScores: {
      skillsMatch: 82,
      experienceFit: 90,
      communication: 89,
    },
    timeline: [
      {
        date: "2024-01-18",
        status: "submitted",
        message: "Application submitted successfully",
      },
      {
        date: "2024-01-19",
        status: "ai_reviewed",
        message: "AI analysis completed - 87% match",
      },
      {
        date: "2024-01-20",
        status: "shortlisted",
        message: "Congratulations! You've been shortlisted",
      },
      {
        date: "2024-01-23",
        status: "interview_scheduled",
        message: "Interview scheduled for January 25th",
      },
    ],
  },
  {
    id: 3,
    jobTitle: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    appliedDate: "2024-01-15",
    status: "rejected",
    aiScore: 75,
    jobType: "Contract",
    salary: "$80,000 - $100,000",
    description: "We need a creative UX Designer to help us create intuitive user experiences...",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    companyLogo: "/placeholder.svg?height=40&width=40",
    lastUpdate: "2024-01-21",
    updateMessage: "Thank you for your interest. We've decided to move forward with other candidates.",
    componentScores: {
      skillsMatch: 70,
      experienceFit: 75,
      communication: 80,
    },
    timeline: [
      {
        date: "2024-01-15",
        status: "submitted",
        message: "Application submitted successfully",
      },
      {
        date: "2024-01-16",
        status: "ai_reviewed",
        message: "AI analysis completed - 75% match",
      },
      {
        date: "2024-01-21",
        status: "rejected",
        message: "Application not selected for this position",
      },
    ],
  },
  {
    id: 4,
    jobTitle: "Full Stack Developer",
    company: "WebSolutions",
    location: "Austin, TX",
    appliedDate: "2024-01-12",
    status: "submitted",
    aiScore: 89,
    jobType: "Full-time",
    salary: "$110,000 - $150,000",
    description: "Looking for a versatile Full Stack Developer to work on exciting projects...",
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    companyLogo: "/placeholder.svg?height=40&width=40",
    lastUpdate: "2024-01-12",
    updateMessage: "Application submitted and pending initial review",
    componentScores: {
      skillsMatch: 88,
      experienceFit: 85,
      communication: 94,
    },
    timeline: [
      {
        date: "2024-01-12",
        status: "submitted",
        message: "Application submitted successfully",
      },
    ],
  },
  {
    id: 5,
    jobTitle: "Data Scientist",
    company: "DataCorp",
    location: "Seattle, WA",
    appliedDate: "2024-01-10",
    status: "withdrawn",
    aiScore: 82,
    jobType: "Full-time",
    salary: "$140,000 - $170,000",
    description: "Join our data team to extract insights and build machine learning models...",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    companyLogo: "/placeholder.svg?height=40&width=40",
    lastUpdate: "2024-01-14",
    updateMessage: "Application withdrawn by candidate",
    componentScores: {
      skillsMatch: 85,
      experienceFit: 78,
      communication: 83,
    },
    timeline: [
      {
        date: "2024-01-10",
        status: "submitted",
        message: "Application submitted successfully",
      },
      {
        date: "2024-01-11",
        status: "ai_reviewed",
        message: "AI analysis completed - 82% match",
      },
      {
        date: "2024-01-14",
        status: "withdrawn",
        message: "Application withdrawn by candidate",
      },
    ],
  },
]

export default function CandidateApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [activeTab, setActiveTab] = useState("all")

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "submitted":
        return {
          label: "Submitted",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Clock className="h-3 w-3" />,
        }
      case "under_review":
        return {
          label: "Under Review",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Eye className="h-3 w-3" />,
        }
      case "interview_scheduled":
        return {
          label: "Interview Scheduled",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: <Calendar className="h-3 w-3" />,
        }
      case "rejected":
        return {
          label: "Not Selected",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-3 w-3" />,
        }
      case "withdrawn":
        return {
          label: "Withdrawn",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <XCircle className="h-3 w-3" />,
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="h-3 w-3" />,
        }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredApplications = candidateApplications
    .filter((app) => {
      const matchesSearch =
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const matchesTab = activeTab === "all" || app.status === activeTab
      return matchesSearch && matchesStatus && matchesTab
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.aiScore - a.aiScore
        case "date":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        case "company":
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

  const statusCounts = {
    all: candidateApplications.length,
    submitted: candidateApplications.filter((app) => app.status === "submitted").length,
    under_review: candidateApplications.filter((app) => app.status === "under_review").length,
    interview_scheduled: candidateApplications.filter((app) => app.status === "interview_scheduled").length,
    rejected: candidateApplications.filter((app) => app.status === "rejected").length,
    withdrawn: candidateApplications.filter((app) => app.status === "withdrawn").length,
  }

  const averageScore = Math.round(
    candidateApplications.reduce((sum, app) => sum + app.aiScore, 0) / candidateApplications.length,
  )

  const activeApplications = candidateApplications.filter(
    (app) => !["rejected", "withdrawn"].includes(app.status),
  ).length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <DashboardLayout userType="candidate">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600">Track your job applications and their progress</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/candidate/jobs">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Find More Jobs
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidateApplications.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeApplications}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">AI match score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.interview_scheduled}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs or companies..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="rejected">Not Selected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Application Date</SelectItem>
              <SelectItem value="score">AI Score</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <span>All</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex items-center space-x-2">
              <span>Submitted</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.submitted}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="under_review" className="flex items-center space-x-2">
              <span>Review</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.under_review}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="interview_scheduled" className="flex items-center space-x-2">
              <span>Interview</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.interview_scheduled}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center space-x-2">
              <span>Rejected</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.rejected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="withdrawn" className="flex items-center space-x-2">
              <span>Withdrawn</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.withdrawn}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                Showing {filteredApplications.length} of {candidateApplications.length} applications
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.map((application) => {
                const statusInfo = getStatusInfo(application.status)
                return (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{application.jobTitle}</CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                {application.company}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {application.location}
                              </div>
                              <Badge variant="outline">{application.jobType}</Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(application.aiScore)}`}>
                            {application.aiScore}%
                          </div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Status and Timeline */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={statusInfo.color} variant="outline">
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                          </Badge>
                          <span className="text-sm text-gray-500">Applied {formatDate(application.appliedDate)}</span>
                        </div>
                        <div className="text-sm text-gray-500">Last update: {formatDate(application.lastUpdate)}</div>
                      </div>

                      {/* Latest Update */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{application.updateMessage}</p>
                      </div>

                      {/* Skills */}
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {application.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
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

                      {/* Salary */}
                      {application.salary && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Salary:</span> {application.salary}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex space-x-2">
                          <Link href={`/candidate/application-result/${application.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Feedback
                            </Button>
                          </Link>
                          {application.status === "interview_scheduled" && (
                            <Button size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              View Interview Details
                            </Button>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Job
                          </Button>
                          {["submitted", "under_review"].includes(application.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredApplications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No applications found</h3>
                    <p className="mb-4">Try adjusting your search or filter criteria.</p>
                    <Link href="/candidate/jobs">
                      <Button>Browse Jobs</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
