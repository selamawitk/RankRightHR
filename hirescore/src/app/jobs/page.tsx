"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  Clock,
  Search,
  Building,
  Users,
  Calendar,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  type: string;
  createdAt: string;
  employer: {
    name?: string;
    companyName?: string;
  };
  _count: {
    applications: number;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs");
        if (response.ok) {
          const jobsData = await response.json();
          setJobs(jobsData);
          setFilteredJobs(jobsData);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.companyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const formatJobType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted today";
    if (diffDays === 2) return "Posted yesterday";
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    return `Posted ${date.toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-black">
              HireScore
            </Link>
            <div className="flex items-center gap-4">
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover jobs from companies using AI-powered hiring
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-0 text-base"
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No jobs found" : "No jobs available"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms or browse all available positions."
                  : "Check back later for new opportunities."}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="mt-4 border-gray-200 text-black hover:bg-gray-50"
                >
                  Show All Jobs
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {filteredJobs.length} job
                  {filteredJobs.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-black mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {job.employer.companyName && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.employer.companyName}
                            </div>
                          )}
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-700"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {formatJobType(job.type)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(job.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Link href={`/jobs/${job.id}/apply`}>
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-md">
                          Apply Now
                        </Button>
                      </Link>
                    </div>

                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {job.description.length > 200
                        ? `${job.description.substring(0, 200)}...`
                        : job.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {job._count.applications} applicant
                        {job._count.applications !== 1 ? "s" : ""}
                      </span>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-black hover:underline font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
