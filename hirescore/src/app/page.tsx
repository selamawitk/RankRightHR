import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-black">
              HireScore
            </Link>
            <div className="flex items-center gap-6">
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
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h1 className="text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
            AI-Powered
            <br />
            <span className="text-gray-500">Hiring</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Streamline your hiring process with intelligent candidate
            evaluation. Get objective, bias-free scoring for every application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=employer">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-12 px-8 text-base font-medium">
                Start hiring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register?role=candidate">
              <Button
                variant="outline"
                className="border-gray-200 text-black hover:bg-gray-50 rounded-md h-12 px-8 text-base"
              >
                Find jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Instant Evaluation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive candidate scores within seconds of application
                submission.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Bias-Free Scoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI evaluates purely on professional qualifications,
                eliminating unconscious bias.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Detailed Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Receive structured feedback with strengths, improvements, and
                actionable tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-16">How it works</h2>
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Post your job
              </h3>
              <p className="text-gray-600">
                Create a job listing with title and description.
              </p>
            </div>

            <div>
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Candidates apply
              </h3>
              <p className="text-gray-600">
                Receive applications with resumes and portfolios.
              </p>
            </div>

            <div>
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                AI evaluates
              </h3>
              <p className="text-gray-600">
                Get instant scores and detailed feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join companies using AI to find the best talent.
          </p>
          <Link href="/auth/register">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-md h-12 px-8 text-base font-medium">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-black font-semibold mb-4 md:mb-0">
              HireScore
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <Link href="/auth/login" className="hover:text-black">
                Sign in
              </Link>
              <Link href="/auth/register" className="hover:text-black">
                Sign up
              </Link>
              <a href="#" className="hover:text-black">
                Privacy
              </a>
              <a href="#" className="hover:text-black">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2024 HireScore. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
