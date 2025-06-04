/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/utils/session';


export async function POST(request: Request) {
  try {
    const session = await getSession();

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized: Not logged in' }, { status: 401 });
  }
    const body = await request.json();
    const { userId, bio, location } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Optional: Check if user exists before creating a profile
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        return NextResponse.json({ error: 'User not found, cannot create profile.' }, { status: 404 });
    }

    // Check if profile already exists for this user, as userId is unique in Profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists for this user' }, { status: 409 }); // 409 Conflict
    }

    const newProfile = await prisma.profile.create({
      data: {
        userId,
        bio,
        location,
      },
    });
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profile:', error);
     // Catch specific Prisma error for foreign key constraint violation if user doesn't exist
    if (error.code === 'P2003' && error.meta?.field_name?.includes('userId')) {
        return NextResponse.json({ error: 'Invalid userId. User does not exist.' }, { status: 400 });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('userId')) { // Unique constraint failed
        return NextResponse.json({ error: 'Profile already exists for this user (duplicate userId).' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create profile', details: error.message }, { status: 500 });
  }
}