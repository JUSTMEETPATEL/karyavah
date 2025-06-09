"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Home, MessageCircle, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface JobCardProps {
  id: string
  title: string
  author: string
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  tags: string[]
  description: string
  onViewJob?: (id: string) => void
  onMessagePoster?: (id: string) => void
  className?: string
}

const statusConfig = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    label: "PENDING",
  },
  ACTIVE: {
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    label: "ACTIVE",
  },
  COMPLETED: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    label: "COMPLETED",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    label: "CANCELLED",
  },
}

export function JobCard({
  id,
  title,
  author,
  status,
  tags,
  description,
  onViewJob,
  onMessagePoster,
  className,
}: JobCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl",
        "border border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-black",
        "shadow-sm hover:shadow-md dark:shadow-black/20",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Home className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <h3 className="font-semibold text-lg text-black dark:text-gray-100 truncate">{title}</h3>
          </div>
          <Badge
            variant="secondary"
            className={cn("text-xs font-medium px-2 py-1 flex-shrink-0", statusConfig[status].color)}
          >
            {statusConfig[status].label}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          By: <span className="font-medium text-black dark:text-gray-100">{author}</span>
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              🏷️ {tag}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">&quot;{description}&quot;</p>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="flex gap-2 w-full">
          <Button
            variant="default"
            size="sm"
            onClick={() => onViewJob?.(id)}
            className="flex-1 bg-black hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-black"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Job
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessagePoster?.(id)}
            className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message Poster
          </Button>
        </div>
      </CardFooter>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-50/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}
