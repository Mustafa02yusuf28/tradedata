import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/blog';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const drafts = url.searchParams.get('drafts') === 'true';

  if (!drafts) {
    const result = await getBlogPosts();
    if (!result.posts) {
      return NextResponse.json({ error: 'Failed to fetch blog posts.' }, { status: 500 });
    }
    return NextResponse.json({ posts: result.posts });
  }

  // Fetch drafts for the current user
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const authorId = payload.email as string;
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('blog');
  const draftsList = await db
    .collection('content')
    .find({ isPublished: false, authorId })
    .sort({ updatedAt: -1 })
    .toArray();
  await client.close();
  return NextResponse.json({ posts: draftsList });
}

export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromCookies();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user details from database to check role
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('Users');
    const collection = db.collection('Detail');
    
    const user = await collection.findOne({ email: payload.email });
    await client.close();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to create posts
    if (user.role !== 'premium' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Premium subscription required to create posts' },
        { status: 403 }
      );
    }

    // Parse FormData instead of JSON
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const contentString = formData.get('content') as string;
    const thumbnail = formData.get('thumbnail') as string;
    const thumbnailFile = formData.get('thumbnailFile') as File;
    const visibility = ((formData.get('visibility') as string) || 'public') as 'public' | 'premium';
    // Optional keywords for SEO
    let keywords: string[] | undefined = undefined;
    const keywordsRaw = formData.get('keywords');
    if (keywordsRaw && typeof keywordsRaw === 'string') {
      keywords = keywordsRaw.split(',').map(k => k.trim()).filter(Boolean);
    }

    // Optional isDraft flag
    const isDraft = formData.get('isDraft') === 'true';

    // Parse content JSON string
    let content;
    try {
      content = JSON.parse(contentString);
    } catch {
      return NextResponse.json(
        { error: 'Invalid content format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!title || !description || !content || !Array.isArray(content)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle thumbnail file upload if present
    let thumbnailUrl = thumbnail;
    if (thumbnailFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', thumbnailFile);
        
        const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          thumbnailUrl = uploadData.url;
        }
      } catch (error) {
        console.error('Thumbnail upload error:', error);
        // Continue without thumbnail if upload fails
      }
    }

    const blogData = {
      title,
      description,
      content,
      author: (payload.name as string) || (payload.email as string) || 'Anonymous',
      authorId: (payload.email as string) || 'anonymous',
      thumbnail: thumbnailUrl,
      visibility,
      keywords,
      isPublished: !isDraft, // If draft, not published
    };

    const result = await createBlogPost(blogData);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ post: result.post }, { status: 201 });
  } catch (_error) {
    console.error('Blog creation error:', _error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 