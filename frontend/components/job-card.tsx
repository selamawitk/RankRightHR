import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Briefcase } from "lucide-react"

interface Job {
  id: number
  title: string
  company: string
  location: string
  description: string
  skills: string[]
  experienceLevel: string
  postedDate: string
  type: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <CardDescription className="text-lg font-medium text-gray-700">{job.company}</CardDescription>
          </div>
          <Badge variant="secondary">{job.type}</Badge>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(job.postedDate)}
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-1" />
            {job.experienceLevel}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <Link href={`/candidate/apply/${job.id}`} className="flex-1">
            <Button className="w-full">Apply Now</Button>
          </Link>
          <Button variant="outline">Save</Button>
        </div>
      </CardContent>
    </Card>
  )
}
