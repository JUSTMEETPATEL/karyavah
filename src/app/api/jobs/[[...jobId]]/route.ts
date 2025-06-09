import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@/utils/session'; // Assuming this utility is correctly implemented

// Validation schema for creating a job
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  userId: z.string().min(1, 'User ID is required'),
  // Updated: tags are now an optional array of strings
  tags: z.array(z.string().min(1, 'Tag names cannot be empty')).optional(),
});

// Validation schema for updating a job
const updateJobSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED']).optional(),
  // Add tags to update schema if you want to allow updating them via PUT
  // tags: z.array(z.string().min(1, 'Tag names cannot be empty')).optional(),
});

export async function POST(req: NextRequest) {
  // Ensure the user is authenticated before allowing job creation
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = createJobSchema.safeParse(body);

    if (!validation.success) {
      // Return detailed validation errors
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Destructure all validated data, including tags
    const { title, description, userId, tags } = validation.data;

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
        // Conditionally add tags to the creation data
        ...(tags && tags.length > 0 && {
          tags: {
            connectOrCreate: tags.map(tagName => ({
              where: { name: tagName }, // Try to find an existing tag by name
              create: { name: tagName }, // If not found, create a new tag
            })),
          },
        }),
      },
      // Include tags in the response so you can see them immediately
      include: {
        tags: true,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    // Provide a more specific error message if possible for common issues
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { jobId?: string[] } }) {
  const jobId = params.jobId?.[0];

  try {
    if (jobId) {
      // GET /api/jobs/:id (Fetch a single job by its ID)
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
          tags: true, // Include associated tags for single job retrieval
        },
      });

      if (!job) {
        return NextResponse.json({ message: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json(job, { status: 200 });
    } else {
      // GET /api/jobs or GET /api/jobs?userId=... (Fetch multiple jobs)
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId'); // Get userId from query parameters

      const whereClause: { userId?: string } = {};
      if (userId) {
        whereClause.userId = userId; // Add userId to the where clause if present
      }

      const jobs = await prisma.job.findMany({
        where: whereClause, // Apply the filter
        take: 10, // Limit to 10 jobs for performance
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: true, // Include associated tags for list retrieval
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
  // Ensure the user is authenticated before allowing job updates
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

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
      include: { // Include tags in the response if you want to see them on update
        tags: true,
      },
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { jobId?: string[] } }) {
  // Ensure the user is authenticated before allowing job deletion
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const jobId = params.jobId?.[0];

  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Optional: Add authorization check here if only the job creator can delete
    // if (job.userId !== session.user.id) {
    //   return NextResponse.json({ message: 'Forbidden: You can only delete your own jobs' }, { status: 403 });
    // }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
