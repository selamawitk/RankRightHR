import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Zap, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">JobMatch</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">AI-Powered Job Matching Platform</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect talented candidates with amazing opportunities using intelligent matching and instant feedback.
        </p>
        <div className="space-x-4">
          <Link href="/auth/signup?type=candidate">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Find Jobs
            </Button>
          </Link>
          <Link href="/auth/signup?type=recruiter">
            <Button size="lg" variant="outline">
              Hire Talent
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered algorithms match candidates with the perfect job opportunities.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Instant Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get immediate insights on your application with detailed scoring and suggestions.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>For Recruiters</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Post jobs and find qualified candidates with comprehensive application insights.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Briefcase className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>For Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Browse opportunities and improve your applications with AI-powered feedback.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
