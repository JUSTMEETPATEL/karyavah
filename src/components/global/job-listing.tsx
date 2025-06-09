/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { JobCard } from "./job-card"
import { AddJobDialog } from "./add-job-dialog"
import { ErrorBoundary } from "./error-boundary"

const sampleJobs = [
  {
    id: "1",
    title: "Paint My House",
    author: "John Doe",
    status: "PENDING" as const,
    tags: ["Painter", "Interior"],
    description:
      "Need a reliable painter to redo the living room and kitchen. Looking for someone with experience in modern color schemes and attention to detail.",
    createdAt: "2023-10-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Garden Landscaping",
    author: "Sarah Wilson",
    status: "ACTIVE" as const,
    tags: ["Landscaping", "Outdoor", "Design"],
    description:
      "Transform my backyard into a beautiful garden space with native plants and a small water feature. Budget is flexible for quality work.",
    createdAt: "2023-10-01T10:00:00Z",
  },
  {
    id: "3",
    title: "Kitchen Renovation",
    author: "Mike Johnson",
    status: "COMPLETED" as const,
    tags: ["Renovation", "Kitchen", "Plumbing"],
    description:
      "Complete kitchen makeover including new cabinets, countertops, and appliances. Need experienced contractor with references.",
    createdAt: "2023-10-01T10:00:00Z",
  },
  {
    id: "4",
    title: "Roof Repair",
    author: "Emma Davis",
    status: "CANCELLED" as const,
    tags: ["Roofing", "Repair", "Emergency"],
    description:
      "Urgent roof repair needed after storm damage. Several shingles missing and minor leak detected in the attic area.",
    createdAt: "2023-09-28T14:30:00Z",
  },
]

// Type for the API response from Prisma
interface PrismaJob {
  id: string
  title: string
  description: string
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  tags: string[]
  createdAt: string
  user: {
    id: string
    name: string
  }
}

// Transform Prisma job to our component format
const transformPrismaJob = (prismaJob: PrismaJob) => ({
  id: String(prismaJob.id),
  title: String(prismaJob.title || ""),
  author: String(prismaJob.user?.name || "Unknown User"),
  status: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"].includes(prismaJob.status)
    ? prismaJob.status
    : ("PENDING" as const),
  tags: Array.isArray(prismaJob.tags) ? prismaJob.tags.map((tag: any) => String(tag)) : [],
  description: String(prismaJob.description || ""),
  createdAt: prismaJob.createdAt || new Date().toISOString(),
})

export function JobListings() {
  const [jobs, setJobs] = useState<typeof sampleJobs>(sampleJobs)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/jobs")
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        const data = await response.json()

        // Transform Prisma jobs to our component format
        const transformedJobs = Array.isArray(data) ? data.map(transformPrismaJob) : sampleJobs

        setJobs(transformedJobs)
        setError(null)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setError("Failed to load jobs. Please try again.")
        // Keep sample jobs as fallback
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleViewJob = (id: string) => {
    console.log("Viewing job:", id)
  }

  const handleMessagePoster = (id: string) => {
    console.log("Messaging poster for job:", id)
  }

  const handleJobAdded = (newJob: any) => {
    // Transform the new job if it comes from the API
    const transformedJob = newJob.user
      ? transformPrismaJob(newJob)
      : {
          id: String(newJob.id || Math.random()),
          title: String(newJob.title || ""),
          author: String(newJob.author || "Unknown User"),
          status: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"].includes(newJob.status)
            ? newJob.status
            : ("PENDING" as const),
          tags: Array.isArray(newJob.tags) ? newJob.tags.map((tag: any) => String(tag)) : [],
          description: String(newJob.description || ""),
          createdAt: newJob.createdAt || new Date().toISOString(),
        }

    setJobs((prev) => [transformedJob, ...prev])
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = !selectedStatus || job.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Listings</h1>
          <AddJobDialog onJobAdded={handleJobAdded} />
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-900"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedStatus === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(null)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              All
            </Button>
            {["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredJobs.map((job) => (
              <ErrorBoundary key={job.id}>
                <JobCard
                  id={job.id}
                  title={job.title}
                  author={job.author}
                  status={job.status}
                  tags={job.tags}
                  description={job.description}
                  createdAt={job.createdAt}
                  onViewJob={handleViewJob}
                  onMessagePoster={handleMessagePoster}
                />
              </ErrorBoundary>
            ))}
          </div>
        )}

        {filteredJobs.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
