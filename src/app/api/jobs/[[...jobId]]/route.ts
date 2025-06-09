import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';



// Validation schema for creating a job
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  userId: z.string().min(1, 'User ID is required'),
  // You can add tag validation if needed, e.g., an array of tag IDs
});

// Validation schema for updating a job
const updateJobSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { title, description, userId } = validation.data;

    // Optional: Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { jobId?: string[] } }) {
  const jobId = params.jobId?.[0];

  try {
    if (jobId) {
      // GET /api/jobs/:id
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          user: { // Include user details in the response
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true, // Include associated tags
        },
      });

      if (!job) {
        return NextResponse.json({ message: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json(job, { status: 200 });
    } else {
      // GET /api/jobs
      const jobs = await prisma.job.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(jobs, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { jobId?: string[] } }) {
  const jobId = params.jobId?.[0];

  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validation = updateJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: validation.data,
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { jobId?: string[] } }) {
  const jobId = params.jobId?.[0];

  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}