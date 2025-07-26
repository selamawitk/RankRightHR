import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Briefcase, Users, Eye, Calendar } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock data
const recentJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    postedDate: "2024-01-15",
    applications: 24,
    status: "active",
  },
  {
    id: 2,
    title: "Product Manager",
    location: "New York, NY",
    postedDate: "2024-01-12",
    applications: 18,
    status: "active",
  },
  {
    id: 3,
    title: "UX Designer",
    location: "Remote",
    postedDate: "2024-01-10",
    applications: 31,
    status: "closed",
  },
]

export default function RecruiterDashboard() {
  return (
    <DashboardLayout userType="recruiter">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
          <Link href="/recruiter/post-job">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">43</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4d</div>
              <p className="text-xs text-muted-foreground">-0.3d from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Your latest job postings and their performance</CardDescription>
              </div>
              <Link href="/recruiter/jobs">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Posted on {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600">{job.applications}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                  <div className="ml-4">
                    <Link href={`/recruiter/jobs/${job.id}/applications`}>
                      <Button variant="outline" size="sm">
                        View Applications
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
