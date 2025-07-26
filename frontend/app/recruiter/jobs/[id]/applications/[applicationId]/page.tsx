"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Github,
  Globe,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  Award,
  Send,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScoreCard } from "@/components/score-card"

// Mock application data
const applicationData = {
  id: 1,
  candidateName: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  appliedDate: "2024-01-20",
  status: "pending",
  aiScore: 92,
  experience: "5 years",
  skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "AWS", "Docker", "Jest"],
  portfolioUrl: "https://sarahjohnson.dev",
  githubUrl: "https://github.com/sarahjohnson",
  linkedinUrl: "https://linkedin.com/in/sarahjohnson",
  avatar: "/placeholder.svg?height=80&width=80",
  componentScores: {
    skillsMatch: 95,
    experienceFit: 88,
    communication: 93,
  },
  resume: `SARAH JOHNSON
Senior Frontend Developer

CONTACT INFORMATION
Email: sarah.johnson@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA
Portfolio: https://sarahjohnson.dev
GitHub: https://github.com/sarahjohnson

PROFESSIONAL SUMMARY
Experienced frontend developer with 5+ years building scalable web applications using modern JavaScript frameworks. Passionate about creating intuitive user experiences and writing clean, maintainable code. Strong background in React ecosystem and full-stack development.

WORK EXPERIENCE

Senior Frontend Developer | TechStart Inc. | 2022 - Present
• Led development of customer-facing dashboard serving 10,000+ daily active users
• Implemented micro-frontend architecture reducing bundle size by 40%
• Mentored 3 junior developers and established code review best practices
• Collaborated with design team to implement pixel-perfect UI components
• Technologies: React, TypeScript, Next.js, GraphQL, AWS

Frontend Developer | WebSolutions Co. | 2020 - 2022
• Built responsive web applications for e-commerce clients
• Optimized application performance resulting in 25% faster load times
• Integrated third-party APIs and payment processing systems
• Participated in agile development process and sprint planning
• Technologies: React, JavaScript, Node.js, MongoDB, Stripe

Junior Frontend Developer | StartupXYZ | 2019 - 2020
• Developed user interfaces for mobile-first web applications
• Implemented automated testing reducing bug reports by 30%
• Collaborated with backend team to design RESTful APIs
• Technologies: React, JavaScript, HTML5, CSS3, Jest

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2015 - 2019
GPA: 3.8/4.0

TECHNICAL SKILLS
Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Sass, Tailwind CSS
Backend: Node.js, Express, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis
Tools: Git, Docker, AWS, Webpack, Jest, Cypress
Design: Figma, Adobe XD, Responsive Design

PROJECTS
E-commerce Platform (2023)
• Built full-stack e-commerce platform with React and Node.js
• Implemented real-time inventory management and payment processing
• Deployed on AWS with CI/CD pipeline

Task Management App (2022)
• Created collaborative task management application
• Features include real-time updates, file sharing, and team collaboration
• Used React, TypeScript, and WebSocket for real-time functionality

CERTIFICATIONS
• AWS Certified Developer Associate (2023)
• React Developer Certification (2022)`,
  coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at TechCorp Inc. With over 5 years of experience building scalable web applications and a passion for creating exceptional user experiences, I am excited about the opportunity to contribute to your innovative team.

In my current role as Senior Frontend Developer at TechStart Inc., I have led the development of a customer-facing dashboard that serves over 10,000 daily active users. This experience has given me deep expertise in React, TypeScript, and Next.js – technologies that align perfectly with your requirements. I successfully implemented a micro-frontend architecture that reduced our bundle size by 40%, demonstrating my commitment to performance optimization and scalable solutions.

What particularly excites me about TechCorp is your mission to revolutionize the fintech space through innovative user experiences. I have experience integrating payment processing systems and working with financial data, having built several e-commerce platforms with complex transaction flows. My background in both frontend and backend development allows me to collaborate effectively with cross-functional teams and understand the full stack implications of frontend decisions.

I am particularly drawn to your emphasis on mentorship and team growth. In my current role, I mentor three junior developers and have established code review best practices that have improved our team's code quality and development velocity. I believe in fostering a collaborative environment where everyone can learn and grow.

Some key achievements that I believe make me a strong fit for this role:

• Led development of high-traffic applications serving 10,000+ daily users
• Reduced application bundle size by 40% through architectural improvements
• Mentored junior developers and established team best practices
• Consistently delivered projects on time while maintaining high code quality
• Strong experience with your tech stack: React, TypeScript, Next.js, and AWS

I am excited about the possibility of bringing my technical expertise, leadership experience, and passion for user experience to TechCorp. I would welcome the opportunity to discuss how my background and skills can contribute to your team's continued success.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
Sarah Johnson`,
  notes: [],
  timeline: [
    {
      date: "2024-01-20",
      action: "Application submitted",
      description: "Candidate submitted application with resume and cover letter",
      type: "application",
    },
    {
      date: "2024-01-21",
      action: "AI analysis completed",
      description: "Application scored 92% overall with strong skills match",
      type: "analysis",
    },
  ],
}

// Mock job data
const jobData = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState(applicationData.status)
  const [note, setNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200"
      case "interview":
        return "bg-purple-100 text-purple-800 border-purple-200"
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

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // In real app, make API call to update status
    console.log("Updating status to:", newStatus)
  }

  const handleAddNote = () => {
    if (note.trim()) {
      // In real app, make API call to add note
      console.log("Adding note:", note)
      setNote("")
      setIsAddingNote(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <DashboardLayout userType="recruiter">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/recruiter/jobs/${params.id}/applications`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{applicationData.candidateName}</h1>
              <p className="text-gray-600">
                Application for {jobData.title} • Applied {formatDate(applicationData.appliedDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Save Candidate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={applicationData.avatar || "/placeholder.svg"}
                        alt={applicationData.candidateName}
                      />
                      <AvatarFallback className="text-lg">
                        {applicationData.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{applicationData.candidateName}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {applicationData.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {applicationData.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {applicationData.location}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(applicationData.aiScore)}`}>
                      {applicationData.aiScore}%
                    </div>
                    <div className="text-sm text-gray-500">AI Match Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{applicationData.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Applied {formatDate(applicationData.appliedDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {applicationData.portfolioUrl && (
                      <a href={applicationData.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {applicationData.githubUrl && (
                      <a href={applicationData.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <Github className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {applicationData.linkedinUrl && (
                      <a href={applicationData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScoreCard
                title="Skills Match"
                score={applicationData.componentScores.skillsMatch}
                description="Alignment with required skills"
                icon={<CheckCircle className="h-5 w-5" />}
              />
              <ScoreCard
                title="Experience Fit"
                score={applicationData.componentScores.experienceFit}
                description="Relevance of work experience"
                icon={<Award className="h-5 w-5" />}
              />
              <ScoreCard
                title="Communication"
                score={applicationData.componentScores.communication}
                description="Quality of written communication"
                icon={<MessageSquare className="h-5 w-5" />}
              />
            </div>

            {/* Skills Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Analysis</CardTitle>
                <CardDescription>Comparison between required skills and candidate skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant={applicationData.skills.includes(skill) ? "default" : "outline"}
                          className={
                            applicationData.skills.includes(skill)
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {skill}
                          {applicationData.skills.includes(skill) ? (
                            <CheckCircle className="h-3 w-3 ml-1" />
                          ) : (
                            <XCircle className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {applicationData.skills
                        .filter((skill) => !jobData.skills.includes(skill))
                        .map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
                <CardDescription>Full resume content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{applicationData.resume}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>Candidate's cover letter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{applicationData.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Update the current status of this application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className={getStatusColor(status)} variant="outline">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interview">Interview Scheduled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Add to Talent Pool
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 bg-transparent" size="sm">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Add private notes about this candidate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicationData.notes.length === 0 && !isAddingNote && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">No notes yet</p>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingNote(true)}>
                      Add Note
                    </Button>
                  </div>
                )}

                {isAddingNote && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note about this candidate..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleAddNote}>
                        <Send className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsAddingNote(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {!isAddingNote && applicationData.notes.length === 0 && (
                  <Button variant="outline" size="sm" onClick={() => setIsAddingNote(true)}>
                    Add Note
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
                <CardDescription>Track of all activities for this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.action}</p>
                        <p className="text-xs text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
