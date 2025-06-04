"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfilePage from '@/components/pages/profile'
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';
import { useEffect } from 'react';

interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  // Add other profile fields as per your Prisma schema
}

const Page = () => {

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  
  // Fetch user profile when the component mounts and session is available

  useEffect(() => {
    const fetchUserProfile = async () => {
      setProfileData(null);
      setError(null);
      setLoading(true);

      try {
        const apiUrl = `/api/profile/user/${session.data?.user.id}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data: UserProfile = await response.json();
          setProfileData(data);
        } else {
          const errorBody = await response.json();
          setError(`Error ${response.status}: ${errorBody.error || response.statusText}`);
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(`Network error: Could not connect to the server or an unexpected error occurred. Details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (session.data?.user.id) {
      fetchUserProfile();
    }
  }, [session.data?.user.id]);
  if(error){
    return <div>Error: {error}</div>;
  }
  if(loading){
    return <div>Loading...</div>;
  }
  // Map UserProfile to the expected ProfilePage user prop shape
  const mappedUser = profileData
    ? {
        id: session.data?.user.id ?? '', // Ensure id is always a string
        name: session.data?.user.name ?? '', // Ensure name is always a string
        email: session.data?.user.email ?? '', // Ensure email is always a string
        role: (['Client', 'Worker', 'Admin'].includes(profileData.role)
          ? profileData.role
          : 'Client') as 'Client' | 'Worker' | 'Admin', // Ensure role is valid
        bio: profileData.bio,
        avatar: undefined, // Add avatar if available in UserProfile
        location: profileData.location ?? '',
        joinedDate: profileData.createdAt,
      }
    : undefined;

  return (
    <div>
      <ProfilePage user={mappedUser} />
    </div>
  )
}

export default Page
