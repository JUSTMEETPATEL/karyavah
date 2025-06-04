/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/profile/user/[userId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path
import { getSession } from "@/utils/session";

// GET profile by userId
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();

  if (!session || !session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized: Not logged in" },
      { status: 401 }
    );
  }
  const { userId } = await params;
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH (update) profile by userId
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();

  if (!session || !session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized: Not logged in" },
      { status: 401 }
    );
  }
  const { userId } = await params;
  try {
    const body = await request.json();
    const { bio, location } = body;

    const dataToUpdate: { bio?: string; location?: string } = {};
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (location !== undefined) dataToUpdate.location = location;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    if (error.code === "P2025") {
      // Prisma error code for record to update not found
      return NextResponse.json(
        { error: "Profile not found for this user" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE profile by userId
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();

  if (!session || !session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized: Not logged in" },
      { status: 401 }
    );
  }
  const { userId } =await params;
  try {
    await prisma.profile.delete({
      where: { userId },
    });
    return NextResponse.json(
      { message: "Profile deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting profile:", error);
    if (error.code === "P2025") {
      // Prisma error code for record to delete not found
      return NextResponse.json(
        { error: "Profile not found for this user" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete profile", details: error.message },
      { status: 500 }
    );
  }
}
