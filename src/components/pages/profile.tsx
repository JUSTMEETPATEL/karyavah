/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth-client"
import { Edit, Mail, Calendar, Camera, Save, X, LocationEditIcon } from "lucide-react"

interface ProfilePageProps {
  user?: {
    id: string
    name: string
    email: string
    location: string
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
    location: "San Francisco, CA",
  },
  currentUser = {
    id: "1",
    role: "Worker",
  },
  onEditProfile,
}: ProfilePageProps) {
  const session = useSession()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio || "",
    avatar: user.avatar || "",
    location: user.location || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [canEditProfile, setCanEditProfile] = useState(false)
  

  console.log("Current User:", user.id, "Session User:", session.data?.user.id);
  // Check if user can edit profile - either they have a session and it's their profile, or they're an admin
  useEffect(() => {
    console.log("Current User ID:", user.id, "Session User ID:", session.data?.user.id);
    if (session.data?.user.id === user.id) {
      setCanEditProfile(true);
    } else {
      setCanEditProfile(false); // Explicitly set to false if condition is not met
    }
  }, [session.data?.user.id, user.id]); // Dependencies for the effect  
  const isAdmin = currentUser?.role === "Admin"
  const canViewEmail = canEditProfile || isAdmin

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

  const handleEditProfile = () => {
    setIsEditDialogOpen(true)
  }

    const handleSaveProfile = async () => {
    setIsLoading(true) // Start loading state
    try {
      // Get the userId from the component's props
      const userId = user.id;
      // Construct the API URL for the PATCH request
      const apiUrl = `/api/profile/user/${userId}`;

      // Prepare the data to send to the API.
      // Your PATCH API expects `bio` and `location`.
      const dataToUpdate = {
        bio: editForm.bio,
        location: editForm.location,
      };

      // Make the PATCH API call
      const response = await fetch(apiUrl, {
        method: 'PATCH', // Specify the HTTP method
        headers: {
          'Content-Type': 'application/json', // Indicate that the body is JSON
          // IMPORTANT: Include your authentication token here if your `getSession()`
          // relies on an `Authorization` header (e.g., Bearer token).
          // Example (assuming your session object has a token property):
          // 'Authorization': `Bearer ${session.data?.user?.token}`,
        },
        body: JSON.stringify(dataToUpdate), // Convert the JavaScript object to a JSON string
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const updatedProfile = await response.json(); // Parse the JSON response from the API
        console.log("Profile updated successfully:", updatedProfile);

        // Close the dialog on successful update
        setIsEditDialogOpen(false);

        // Call the parent's onEditProfile if provided, to trigger data re-fetch or state update
        if (onEditProfile) {
          onEditProfile();
        }
        // You can add a toast notification here for user feedback
      } else {
        // Handle HTTP errors (e.g., 400, 401, 404, 500)
        const errorData = await response.json(); // Attempt to parse error details from the response body
        console.error("Failed to update profile:", errorData);
        // Display a user-friendly error message
        alert(`Failed to update profile: ${errorData.error || response.statusText}`);
      }
    } catch (error: any) {
      // Handle network errors or unexpected issues during the fetch operation
      console.error("Network or unexpected error during profile update:", error);
      alert(`An unexpected error occurred: ${error.message || 'Please check your network connection.'}`);
    } finally {
      setIsLoading(false); // End loading state regardless of success or failure
      window.location.reload(); // Reload the page to reflect changes
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would typically upload the file and get a URL
      // For now, we'll create a local URL for preview
      const url = URL.createObjectURL(file)
      setEditForm((prev) => ({ ...prev, avatar: url }))
    }
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

                {canEditProfile && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleEditProfile} className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={editForm.avatar || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="text-lg font-semibold">
                      {getInitials(editForm.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="avatar-upload"
                      />
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Change Avatar
                      </Button>
                    </div>
                    </div>

                    {/* Location Field */}
                    <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter your location"
                    />
                    </div>

                    {/* Bio Field */}
                    <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e: { target: { value: any } }) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                    />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    </div>
                  </div>
                  </DialogContent>
                </Dialog>
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
            <p className="text-muted-foreground italic">
              {canEditProfile ? "No bio available. Click 'Edit Profile' to add one." : "No bio available."}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LocationEditIcon className="w-4 h-4" />
            <span>{user.location || "Location not specified"}</span>
          </div>
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
