"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Download, Calendar, MapPin } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicationCard } from "@/components/application-card"

// Mock job data
const jobData = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  postedDate: "2024-01-15",
  status: "active",
  totalApplications: 24,
}

// Mock applications data
const applications = [
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
    componentScores: {
      skillsMatch: 95,
      experienceFit: 88,
      communication: 93,
    },
  },
  {
    id: 2,
    candidateName: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    appliedDate: "2024-01-19",
    status: "reviewed",
    aiScore: 87,
    experience: "7 years",
    skills: ["React", "Vue.js", "JavaScript", "Python"],
    portfolioUrl: "https://michaelchen.portfolio.com",
    githubUrl: "https://github.com/mchen",
    resumeSnippet: "Full-stack developer with expertise in modern JavaScript frameworks and backend technologies...",
    coverLetterSnippet:
      "Your company's mission to revolutionize user experiences aligns perfectly with my career goals...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: {
      skillsMatch: 82,
      experienceFit: 90,
      communication: 89,
    },
  },
  {
    id: 3,
    candidateName: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    appliedDate: "2024-01-18",
    status: "shortlisted",
    aiScore: 85,
    experience: "4 years",
    skills: ["React", "TypeScript", "GraphQL", "AWS"],
    portfolioUrl: "https://emilyrodriguez.com",
    githubUrl: "https://github.com/erodriguez",
    resumeSnippet: "Creative frontend developer passionate about creating intuitive user interfaces...",
    coverLetterSnippet: "I've been following TechCorp's work in the fintech space and would love to contribute...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: {
      skillsMatch: 88,
      experienceFit: 79,
      communication: 88,
    },
  },
  {
    id: 4,
    candidateName: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 321-0987",
    location: "Seattle, WA",
    appliedDate: "2024-01-17",
    status: "pending",
    aiScore: 78,
    experience: "3 years",
    skills: ["React", "JavaScript", "CSS", "Node.js"],
    portfolioUrl: "https://davidkim.dev",
    githubUrl: "https://github.com/dkim",
    resumeSnippet: "Junior to mid-level developer with strong fundamentals and eagerness to learn...",
    coverLetterSnippet:
      "I'm excited about the opportunity to grow my skills while contributing to meaningful projects...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: {
      skillsMatch: 75,
      experienceFit: 72,
      communication: 85,
    },
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
    skills: ["HTML", "CSS", "JavaScript", "jQuery"],
    portfolioUrl: "https://lisathompson.portfolio.com",
    githubUrl: "https://github.com/lthompson",
    resumeSnippet: "Entry-level developer with foundational web development skills...",
    coverLetterSnippet: "I'm passionate about web development and eager to take on new challenges...",
    avatar: "/placeholder.svg?height=40&width=40",
    componentScores: {
      skillsMatch: 58,
      experienceFit: 65,
      communication: 72,
    },
  },
]

export default function ViewApplicationsPage() {
  const params = useParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("score")
  const [selectedApplication, setSelectedApplication] = useState<(typeof applications)[0] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      return matchesSearch && matchesStatus
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
    all: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewed: applications.filter((app) => app.status === "reviewed").length,
    shortlisted: applications.filter((app) => app.status === "shortlisted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  }

  return (
    <DashboardLayout userType="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/recruiter/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="font-medium">{jobData.title}</span>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {jobData.location}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted {new Date(jobData.postedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.reviewed}</div>
              <div className="text-sm text-gray-600">Reviewed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.shortlisted}</div>
              <div className="text-sm text-gray-600">Shortlisted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search candidates..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">AI Score</SelectItem>
              <SelectItem value="date">Application Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} onViewDetails={setSelectedApplication} />
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
      </div>
    </DashboardLayout>
  )
}
