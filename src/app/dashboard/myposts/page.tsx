"use client"

import { useEffect, useState } from "react"
import { JobCard } from "@/components/global/job-card"
import { getSession } from "@/utils/session"
import { Loader2, Briefcase } from "lucide-react"

interface Job {
  id: string
  title: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
  status: "PENDING" | "ASSIGNED" | "COMPLETED" | "CANCELLED"
  user: {
    id: string
    name: string
  }
  tags: Array<{
    id: string
    name: string
  }>
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getJobs = async () => {
    try {
      setLoading(true)
      const session = await getSession()
      const userId = session?.user.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      const response = await fetch(`/api/jobs?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch jobs")
      }

      const jobsData = await response.json()
      setJobs(jobsData)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getJobs()
  }, [])


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading jobs...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading jobs</div>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">You haven&apos;t created any jobs yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Jobs</h1>
        <p className="text-muted-foreground">Manage and track your job listings ({jobs.length} total)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            author={job.user.name}
            status={
              job.status === "ASSIGNED"
                ? "ACTIVE"
                : job.status
            }
            tags={job.tags.map((tag) => tag.name)}
            description={job.description}
            createdAt={job.createdAt}
            // Optionally add handlers:
            // onViewJob={() => handleView(job)}
            // onMessagePoster={() => ...}
          />
        ))}
      </div>
    </div>
  )
}
