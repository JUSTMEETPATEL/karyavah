"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { JobCard } from "./job-card"

const sampleJobs = [
  {
    id: "1",
    title: "Paint My House",
    author: "John Doe",
    status: "PENDING" as const,
    tags: ["Painter", "Interior"],
    description:
      "Need a reliable painter to redo the living room and kitchen. Looking for someone with experience in modern color schemes and attention to detail.",
    createdAt: new Date("2023-10-01T10:00:00Z"),
  },
  {
    id: "2",
    title: "Garden Landscaping",
    author: "Sarah Wilson",
    status: "ACTIVE" as const,
    tags: ["Landscaping", "Outdoor", "Design"],
    description:
      "Transform my backyard into a beautiful garden space with native plants and a small water feature. Budget is flexible for quality work.",
      createdAt: new Date("2023-10-01T10:00:00Z"),
  },
  {
    id: "3",
    title: "Kitchen Renovation",
    author: "Mike Johnson",
    status: "COMPLETED" as const,
    tags: ["Renovation", "Kitchen", "Plumbing"],
    description:
      "Complete kitchen makeover including new cabinets, countertops, and appliances. Need experienced contractor with references.",
      createdAt: new Date("2023-10-01T10:00:00Z"),
  },
  {
    id: "4",
    title: "Roof Repair",
    author: "Emma Davis",
    status: "CANCELLED" as const,
    tags: ["Roofing", "Repair", "Emergency"],
    description:
      "Urgent roof repair needed after storm damage. Several shingles missing and minor leak detected in the attic area.",
  },
]

export function JobListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const handleViewJob = (id: string) => {
    console.log("Viewing job:", id)
  }

  const handleMessagePoster = (id: string) => {
    console.log("Messaging poster for job:", id)
  }

  const filteredJobs = sampleJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = !selectedStatus || job.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 w-f">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Job Listings</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-black"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} onViewJob={handleViewJob} onMessagePoster={handleMessagePoster} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
