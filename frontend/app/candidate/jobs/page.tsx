import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock job data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    description:
      "We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences...",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experienceLevel: "Senior Level",
    postedDate: "2024-01-15",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    description:
      "Join our product team to drive innovation and deliver exceptional products that delight our customers...",
    skills: ["Product Strategy", "Analytics", "Agile", "User Research"],
    experienceLevel: "Mid Level",
    postedDate: "2024-01-14",
    type: "Full-time",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    description: "We need a creative UX Designer to help us create intuitive and beautiful user experiences...",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    experienceLevel: "Mid Level",
    postedDate: "2024-01-13",
    type: "Contract",
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Austin, TX",
    description: "Looking for a versatile Full Stack Developer to work on exciting projects across our tech stack...",
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    experienceLevel: "Senior Level",
    postedDate: "2024-01-12",
    type: "Full-time",
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "DataCorp",
    location: "Seattle, WA",
    description:
      "Join our data team to extract insights and build machine learning models that drive business decisions...",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    experienceLevel: "Mid Level",
    postedDate: "2024-01-11",
    type: "Full-time",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    description:
      "We need a DevOps Engineer to help us scale our infrastructure and improve our deployment processes...",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    experienceLevel: "Senior Level",
    postedDate: "2024-01-10",
    type: "Full-time",
  },
]

export default function JobsPage() {
  return (
    <DashboardLayout userType="candidate">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600">Discover your next opportunity</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search jobs, companies, or skills..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Job Results */}
        <div className="text-sm text-gray-600 mb-4">Showing {jobs.length} jobs</div>

        {/* Job Cards Grid */}
        <div className="grid gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
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
