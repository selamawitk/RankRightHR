import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Eye, Calendar, MapPin, Users } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock jobs data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    postedDate: "2024-01-15",
    applications: 24,
    status: "active",
    description: "We are looking for a skilled Frontend Developer to join our team...",
    experienceLevel: "Senior Level",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Manager",
    location: "New York, NY",
    postedDate: "2024-01-12",
    applications: 18,
    status: "active",
    description: "Join our product team to drive innovation and deliver exceptional products...",
    experienceLevel: "Mid Level",
    type: "Full-time",
  },
  {
    id: 3,
    title: "UX Designer",
    location: "Remote",
    postedDate: "2024-01-10",
    applications: 31,
    status: "closed",
    description: "We need a creative UX Designer to help us create intuitive user experiences...",
    experienceLevel: "Mid Level",
    type: "Contract",
  },
  {
    id: 4,
    title: "Backend Developer",
    location: "Austin, TX",
    postedDate: "2024-01-08",
    applications: 15,
    status: "active",
    description: "Looking for a Backend Developer to work on our scalable infrastructure...",
    experienceLevel: "Senior Level",
    type: "Full-time",
  },
  {
    id: 5,
    title: "Data Scientist",
    location: "Seattle, WA",
    postedDate: "2024-01-05",
    applications: 22,
    status: "paused",
    description: "Join our data team to extract insights and build ML models...",
    experienceLevel: "Mid Level",
    type: "Full-time",
  },
]

export default function RecruiterJobsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <DashboardLayout userType="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
            <p className="text-gray-600">Manage your job postings and track applications</p>
          </div>
          <Link href="/recruiter/post-job">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search job postings..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge className={getStatusColor(job.status)} variant="outline">
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted {formatDate(job.postedDate)}
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{job.applications}</div>
                    <div className="text-sm text-gray-500">applications</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{job.experienceLevel}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/recruiter/jobs/${job.id}/applications`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Applications
                      </Button>
                    </Link>
                    <Link href={`/recruiter/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit Job
                      </Button>
                    </Link>
                    <Button size="sm">Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-8">
          <Button variant="outline">Load More Jobs</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
