'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Users, 
  Star, 
  Mail, 
  Phone, 
  Calendar,
  ExternalLink,
  Github,
  Globe,
  FileText,
  Award,
  TrendingUp,
  MapPin,
  Building,
  Clock
} from 'lucide-react'

interface Application {
  id: string
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  status: string
  createdAt: string
  resumeUrl: string
  githubUrl?: string
  websiteUrl?: string
  coverLetter?: string
  scores?: {
    resumeScore: number
    coverLetterScore?: number
    overallScore: number
    strengths: string[]
    improvements: string[]
    tips: string[]
    feedback: string
  }
}

interface Job {
  id: string
  title: string
  description: string
  location?: string
  type: string
  createdAt: string
}

interface ApplicantsData {
  job: Job
  applications: Application[]
  totalApplications: number
}

export default function JobApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [data, setData] = useState<ApplicantsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`/api/jobs/${resolvedParams.id}/applicants`, {
          credentials: 'include'
        })

        if (response.status === 401) {
          router.push('/auth/login')
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch applicants')
        }

        const applicantsData = await response.json()
        setData(applicantsData)
      } catch (err) {
        console.error('Error fetching applicants:', err)
        setError(err instanceof Error ? err.message : 'Failed to load applicants')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplicants()
  }, [resolvedParams.id, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REVIEWING': return 'bg-blue-100 text-blue-800'
      case 'INTERVIEWED': return 'bg-purple-100 text-purple-800'
      case 'HIRED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading applicants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button className="bg-black text-white hover:bg-gray-800">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">No Data Found</h1>
          <Link href="/dashboard">
            <Button className="bg-black text-white hover:bg-gray-800">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h1 className="text-xl font-semibold text-black">Job Applicants</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Job Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">{data.job.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                {data.job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {data.job.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatJobType(data.job.type)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {formatDate(data.job.createdAt)}
                </div>
              </div>
              <p className="text-gray-700 max-w-3xl">{data.job.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-black">{data.totalApplications}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {data.applications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">No Applications Yet</h3>
            <p className="text-gray-600">This job hasn't received any applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">
                Applications ({data.applications.length})
              </h3>
              <div className="text-sm text-gray-600">
                Sorted by AI score (highest first)
              </div>
            </div>

            <div className="grid gap-4">
              {data.applications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-black">
                          {application.candidateName}
                        </h4>
                        <Badge className={`${getStatusColor(application.status)} border-0`}>
                          {application.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                        {application.scores && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className={`font-semibold ${getScoreColor(application.scores.overallScore)}`}>
                              {application.scores.overallScore}/10
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {application.candidateEmail}
                        </div>
                        {application.candidatePhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {application.candidatePhone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Applied {formatDate(application.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          {application.githubUrl && (
                            <a 
                              href={application.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-black"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {application.websiteUrl && (
                            <a 
                              href={application.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-black"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                          {application.resumeUrl && application.resumeUrl !== 'text-resume' && (
                            <a 
                              href={application.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-black"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {application.scores && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Resume:</span>
                            <span className={`font-medium ${getScoreColor(application.scores.resumeScore)}`}>
                              {application.scores.resumeScore}/10
                            </span>
                          </div>
                          {application.scores.coverLetterScore && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-600">Cover Letter:</span>
                              <span className={`font-medium ${getScoreColor(application.scores.coverLetterScore)}`}>
                                {application.scores.coverLetterScore}/10
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">Overall:</span>
                            <span className={`font-medium ${getScoreColor(application.scores.overallScore)}`}>
                              {application.scores.overallScore}/10
                            </span>
                          </div>
                        </div>
                      )}

                      {application.scores && application.scores.feedback && (
                        <div className="bg-gray-50 rounded p-3 mb-4">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {application.scores.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Link href={`/jobs/${data.job.id}/applicants/${application.id}`}>
                        <Button className="bg-black text-white hover:bg-gray-800 h-10 px-4">
                          <span className="mr-2">View Details</span>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 