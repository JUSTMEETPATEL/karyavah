"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Edit, Mail, Calendar } from "lucide-react"

interface ProfilePageProps {
  user?: {
    id: string
    name: string
    email: string
    role: "Client" | "Worker" | "Admin"
    bio?: string
    avatar?: string
    joinedDate: string
  }
  currentUser?: {
    id: string
    role: "Client" | "Worker" | "Admin"
  }
  onEditProfile?: () => void
}

export default function ProfilePage({
  user = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Worker",
    bio: "Experienced full-stack developer with a passion for creating innovative solutions. Always eager to take on new challenges and collaborate with amazing teams.",
    avatar: "/placeholder.svg?height=128&width=128",
    joinedDate: "2023-03-15",
  },
  currentUser = {
    id: "1",
    role: "Worker",
  },
  onEditProfile,
}: ProfilePageProps) {
  const isCurrentUser = currentUser?.id === user.id
  const isAdmin = currentUser?.role === "Admin"
  const canViewEmail = isCurrentUser || isAdmin

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive"
      case "Worker":
        return "default"
      case "Client":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl font-semibold">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <Badge variant={getRoleBadgeVariant(user.role)} className="w-fit">
                  {user.role}
                </Badge>
              </div>

              {isCurrentUser && (
                <Button variant="outline" size="sm" onClick={onEditProfile} className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* About / Bio Section */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">About</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.bio ? (
            <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
          ) : (
            <p className="text-muted-foreground italic">No bio available.</p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Joined on {formatJoinDate(user.joinedDate)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Contact / Metadata Section */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Contact Information</h3>
        </CardHeader>
        <CardContent>
          {canViewEmail ? (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Contact information is private.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
