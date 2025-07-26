import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, TrendingUp, ArrowLeft, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScoreCard } from "@/components/score-card"

// Mock AI feedback data
const feedbackData = {
  overallScore: 82,
  jobTitle: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  componentScores: {
    skillsMatch: 88,
    experienceFit: 79,
    communication: 85,
  },
  strengths: [
    "Strong technical background in React and TypeScript",
    "Excellent communication skills demonstrated in cover letter",
    "Relevant project experience with modern frontend technologies",
    "Good understanding of user experience principles",
  ],
  improvements: [
    "Consider highlighting more specific examples of leadership experience",
    "Add metrics to quantify your impact in previous roles",
    "Mention experience with testing frameworks like Jest or Cypress",
    "Include examples of cross-functional collaboration",
  ],
  recommendations: [
    "Expand on your experience with Next.js and server-side rendering",
    "Highlight any experience with design systems or component libraries",
    "Mention familiarity with CI/CD processes and deployment strategies",
  ],
}

export default function ApplicationResultPage() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <DashboardLayout userType="candidate">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Analysis</h1>
            <p className="text-gray-600">
              AI-powered feedback for your application to {feedbackData.jobTitle} at {feedbackData.company}
            </p>
          </div>
          <Link href="/candidate/jobs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        {/* Overall Score */}
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Overall Application Score</CardTitle>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="text-6xl font-bold text-blue-600">{feedbackData.overallScore}%</div>
              <div className="text-left">
                <Badge variant={getScoreVariant(feedbackData.overallScore)} className="mb-2">
                  {feedbackData.overallScore >= 80
                    ? "Excellent"
                    : feedbackData.overallScore >= 60
                      ? "Good"
                      : "Needs Improvement"}
                </Badge>
                <p className="text-sm text-gray-600">Your application shows strong potential for this role</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Component Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard
            title="Skills Match"
            score={feedbackData.componentScores.skillsMatch}
            description="How well your skills align with job requirements"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <ScoreCard
            title="Experience Fit"
            score={feedbackData.componentScores.experienceFit}
            description="Relevance of your experience to the role"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <ScoreCard
            title="Communication"
            score={feedbackData.componentScores.communication}
            description="Quality of your cover letter and presentation"
            icon={<AlertCircle className="h-5 w-5" />}
          />
        </div>

        {/* Detailed Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Top Strengths
              </CardTitle>
              <CardDescription>What makes your application stand out</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedbackData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <TrendingUp className="h-5 w-5 mr-2" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>Areas to enhance for future applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedbackData.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Specific suggestions to strengthen your profile for similar roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedbackData.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Detailed Report
              </Button>
              <Link href="/candidate/jobs" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Apply to More Jobs
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 bg-transparent">
                Share Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
