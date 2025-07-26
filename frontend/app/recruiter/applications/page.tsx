"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, Calendar, TrendingUp, Users, Clock, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicationCard } from "@/components/application-card"

// Mock applications data across all jobs
const allApplications = [
  {
    id: 1,
    candidateName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    appliedDate: "2024-01-20",
    status: "pending",
    aiScore: 92,
    experience: "5 years",
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
    portfolioUrl: "https://sarahjohnson.dev",
    githubUrl: "https://github.com/sarahjohnson",
    resumeSnippet: "Experienced frontend developer with 5+ years building scalable web applications...",
    coverLetterSnippet:
      "I'm excited about the opportunity to join TechCorp and contribute to your innovative projects...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 95, experienceFit: 88, communication: 93 },
    jobId: 1,
    jobTitle: "Senior Frontend Developer",
    jobLocation: "San Francisco, CA",
  },
  {
    id: 2,
    candidateName: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    appliedDate: "2024-01-19",
    status: "shortlisted",
    aiScore: 87,
    experience: "7 years",
    skills: ["React", "Vue.js", "JavaScript", "Python"],
    portfolioUrl: "https://michaelchen.portfolio.com",
    githubUrl: "https://github.com/mchen",
    resumeSnippet: "Full-stack developer with expertise in modern JavaScript frameworks and backend technologies...",
    coverLetterSnippet:
      "Your company's mission to revolutionize user experiences aligns perfectly with my career goals...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 82, experienceFit: 90, communication: 89 },
    jobId: 1,
    jobTitle: "Senior Frontend Developer",
    jobLocation: "San Francisco, CA",
  },
  {
    id: 3,
    candidateName: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    appliedDate: "2024-01-18",
    status: "reviewed",
    aiScore: 85,
    experience: "4 years",
    skills: ["Product Strategy", "Analytics", "Agile", "User Research"],
    portfolioUrl: "https://emilyrodriguez.com",
    githubUrl: "https://github.com/erodriguez",
    resumeSnippet: "Product manager with strong analytical skills and user-focused approach...",
    coverLetterSnippet: "I've been following TechCorp's work in the fintech space and would love to contribute...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 88, experienceFit: 79, communication: 88 },
    jobId: 2,
    jobTitle: "Product Manager",
    jobLocation: "New York, NY",
  },
  {
    id: 4,
    candidateName: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 321-0987",
    location: "Seattle, WA",
    appliedDate: "2024-01-17",
    status: "interview",
    aiScore: 78,
    experience: "3 years",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    portfolioUrl: "https://davidkim.dev",
    githubUrl: "https://github.com/dkim",
    resumeSnippet: "UX designer with strong user research background and design system experience...",
    coverLetterSnippet:
      "I'm excited about the opportunity to grow my skills while contributing to meaningful projects...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 75, experienceFit: 72, communication: 85 },
    jobId: 3,
    jobTitle: "UX Designer",
    jobLocation: "Remote",
  },
  {
    id: 5,
    candidateName: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    phone: "+1 (555) 654-3210",
    location: "Remote",
    appliedDate: "2024-01-16",
    status: "rejected",
    aiScore: 65,
    experience: "2 years",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    portfolioUrl: "https://lisathompson.portfolio.com",
    githubUrl: "https://github.com/lthompson",
    resumeSnippet: "Backend developer with experience in Node.js and cloud technologies...",
    coverLetterSnippet: "I'm passionate about backend development and eager to take on new challenges...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 58, experienceFit: 65, communication: 72 },
    jobId: 4,
    jobTitle: "Backend Developer",
    jobLocation: "Austin, TX",
  },
  {
    id: 6,
    candidateName: "Alex Martinez",
    email: "alex.martinez@email.com",
    phone: "+1 (555) 789-0123",
    location: "Los Angeles, CA",
    appliedDate: "2024-01-15",
    status: "pending",
    aiScore: 89,
    experience: "6 years",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    portfolioUrl: "https://alexmartinez.ai",
    githubUrl: "https://github.com/amartinez",
    resumeSnippet: "Data scientist with expertise in machine learning and statistical analysis...",
    coverLetterSnippet: "I'm excited to apply my data science skills to solve complex business problems...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 92, experienceFit: 85, communication: 90 },
    jobId: 5,
    jobTitle: "Data Scientist",
    jobLocation: "Seattle, WA",
  },
  {
    id: 7,
    candidateName: "Jennifer Wu",
    email: "jennifer.wu@email.com",
    phone: "+1 (555) 234-5678",
    location: "Boston, MA",
    appliedDate: "2024-01-14",
    status: "shortlisted",
    aiScore: 91,
    experience: "8 years",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    portfolioUrl: "https://jenniferwu.tech",
    githubUrl: "https://github.com/jwu",
    resumeSnippet: "Senior DevOps engineer with extensive experience in cloud infrastructure and automation...",
    coverLetterSnippet: "I'm passionate about building scalable infrastructure and improving development workflows...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 94, experienceFit: 88, communication: 91 },
    jobId: 6,
    jobTitle: "DevOps Engineer",
    jobLocation: "Remote",
  },
  {
    id: 8,
    candidateName: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    appliedDate: "2024-01-13",
    status: "reviewed",
    aiScore: 83,
    experience: "5 years",
    skills: ["React", "TypeScript", "GraphQL", "AWS"],
    portfolioUrl: "https://roberttaylor.dev",
    githubUrl: "https://github.com/rtaylor",
    resumeSnippet: "Full-stack developer with strong frontend skills and cloud experience...",
    coverLetterSnippet: "I'm interested in joining a team that values innovation and technical excellence...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: { skillsMatch: 86, experienceFit: 80, communication: 83 },
    jobId: 1,
    jobTitle: "Senior Frontend Developer",
    jobLocation: "San Francisco, CA",
  },
]

// Mock job postings for filter
const jobPostings = [
  { id: 1, title: "Senior Frontend Developer", applications: 3 },
  { id: 2, title: "Product Manager", applications: 1 },
  { id: 3, title: "UX Designer", applications: 1 },
  { id: 4, title: "Backend Developer", applications: 1 },
  { id: 5, title: "Data Scientist", applications: 1 },
  { id: 6, title: "DevOps Engineer", applications: 1 },
]

export default function RecruiterApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [activeTab, setActiveTab] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredApplications = allApplications
    .filter((app) => {
      const matchesSearch =
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const matchesJob = jobFilter === "all" || app.jobId.toString() === jobFilter
      const matchesTab = activeTab === "all" || app.status === activeTab
      return matchesSearch && matchesStatus && matchesJob && matchesTab
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.aiScore - a.aiScore
        case "date":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        case "name":
          return a.candidateName.localeCompare(b.candidateName)
        default:
          return 0
      }
    })

  const statusCounts = {
    all: allApplications.length,
    pending: allApplications.filter((app) => app.status === "pending").length,
    reviewed: allApplications.filter((app) => app.status === "reviewed").length,
    shortlisted: allApplications.filter((app) => app.status === "shortlisted").length,
    interview: allApplications.filter((app) => app.status === "interview").length,
    rejected: allApplications.filter((app) => app.status === "rejected").length,
  }

  const averageScore = Math.round(allApplications.reduce((sum, app) => sum + app.aiScore, 0) / allApplications.length)

  const recentApplications = allApplications.filter(
    (app) => new Date().getTime() - new Date(app.appliedDate).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length

  return (
    <DashboardLayout userType="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Applications</h1>
            <p className="text-gray-600">Manage applications across all your job postings</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allApplications.length}</div>
              <p className="text-xs text-muted-foreground">Across all job postings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentApplications}</div>
              <p className="text-xs text-muted-foreground">New applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">AI match score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.pending}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search candidates, jobs, or emails..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobPostings.map((job) => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title} ({job.applications})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Application Date</SelectItem>
              <SelectItem value="score">AI Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
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
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <span>Pending</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex items-center space-x-2">
              <span>Reviewed</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.reviewed}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="shortlisted" className="flex items-center space-x-2">
              <span>Shortlisted</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.shortlisted}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center space-x-2">
              <span>Interview</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.interview}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center space-x-2">
              <span>Rejected</span>
              <Badge variant="secondary" className="ml-1">
                {statusCounts.rejected}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                Showing {filteredApplications.length} of {allApplications.length} applications
              </div>
              {filteredApplications.length > 0 && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Avg Score:{" "}
                    {Math.round(
                      filteredApplications.reduce((sum, app) => sum + app.aiScore, 0) / filteredApplications.length,
                    )}
                    %
                  </div>
                </div>
              )}
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <div key={application.id} className="relative">
                  {/* Job Title Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {application.jobTitle}
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{application.jobLocation}</span>
                    </div>
                    <Link href={`/recruiter/jobs/${application.jobId}/applications`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All for This Job
                      </Button>
                    </Link>
                  </div>
                  <ApplicationCard
                    application={application}
                    onViewDetails={() => console.log("View details", application.id)}
                  />
                </div>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No applications found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {filteredApplications.length > 0 && filteredApplications.length >= 10 && (
              <div className="text-center pt-8">
                <Button variant="outline">Load More Applications</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
