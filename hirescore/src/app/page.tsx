import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Target,
  Zap,
  Search,
  Briefcase,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold text-black">HireScore</div>
            <div className="flex items-center gap-4">
              <Link href="/jobs">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-black"
                >
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-black"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-9 px-4">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
            AI-Powered Hiring
            <br />
            <span className="text-gray-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your hiring process with intelligent candidate
            evaluation. Post jobs, receive applications, and get AI-powered
            insights to find the perfect fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-12 px-8 text-base">
                <Search className="h-5 w-5 mr-2" />
                Find Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                className="border-gray-200 text-black hover:bg-gray-50 rounded-md h-12 px-8 text-base"
              >
                Start Hiring
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Discovery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Discover Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through AI-evaluated job opportunities from
              forward-thinking companies
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-black mb-4">
                  Ready to find your next role?
                </h3>
                <p className="text-gray-600 mb-6">
                  Apply to jobs with our streamlined process. Get instant AI
                  feedback on your application and stand out to employers with
                  detailed scoring.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>No account required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Instant AI evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Direct employer contact</span>
                  </div>
                </div>
                <Link href="/jobs">
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-11 px-6">
                    Browse All Jobs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Search className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Why Choose HireScore?
            </h2>
            <p className="text-lg text-gray-600">
              Built for modern hiring teams and ambitious candidates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                AI-Powered Evaluation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI analyzes resumes, cover letters, and portfolios
                to provide objective scoring and detailed feedback for every
                application.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Bias-Free Hiring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Focus purely on skills and qualifications. Our system evaluates
                candidates without considering demographic information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Streamlined Process
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From job posting to hiring decision, our platform simplifies
                every step of the recruitment process for better outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your hiring?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join forward-thinking companies using AI to find the best talent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button className="bg-white text-black hover:bg-gray-100 rounded-md h-12 px-8 text-base">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black rounded-md h-12 px-8 text-base"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-semibold text-black mb-4 md:mb-0">
              HireScore
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/jobs" className="hover:text-black">
                Browse Jobs
              </Link>
              <Link href="/auth/register" className="hover:text-black">
                For Employers
              </Link>
              <Link href="/auth/login" className="hover:text-black">
                Sign In
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-600">
            © 2024 HireScore. AI-powered hiring for the modern workplace.
          </div>
        </div>
      </footer>
    </div>
  );
}
