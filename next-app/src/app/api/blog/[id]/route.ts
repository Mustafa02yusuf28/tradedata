import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/blog';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getBlogPostById(id);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    if (!result.post) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
    }
    const post = result.post;

    if (post.visibility === 'premium') {
      // Require authentication and premium/admin role
      const token = await getTokenFromCookies();
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      // Get user role from DB
      const client = await MongoClient.connect(process.env.MONGODB_URI!);
      const db = client.db('Users');
      const collection = db.collection('Detail');
      const user = await collection.findOne({ email: payload.email });
      await client.close();
      if (!user || (user.role !== 'premium' && user.role !== 'admin')) {
        return NextResponse.json({ error: 'Premium content' }, { status: 403 });
      }
    }

    return NextResponse.json({ post });
  } catch (_error) {
    console.error('Blog post fetch error:', _error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const contentString = formData.get('content') as string;
    let content;
    try {
      content = JSON.parse(contentString);
    } catch {
      return NextResponse.json(
        { error: 'Invalid content format' },
        { status: 400 }
      );
    }
    const thumbnail = formData.get('thumbnail') as string;
    const thumbnailFile = formData.get('thumbnailFile') as File;
    const visibility = ((formData.get('visibility') as string) || 'public') as 'public' | 'premium';
    // Optional keywords for SEO
    let keywords: string[] | undefined = undefined;
    const keywordsRaw = formData.get('keywords');
    if (keywordsRaw && typeof keywordsRaw === 'string') {
      keywords = keywordsRaw.split(',').map(k => k.trim()).filter(Boolean);
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
    const updateData = {
      title,
      description,
      content,
      thumbnail: thumbnailUrl,
      visibility,
      updatedAt: new Date(),
      keywords,
    };

    const { id } = await params;
    const result = await updateBlogPost(
      id,
      updateData,
      payload.email as string,
      user.role
    );
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ post: result.post });
  } catch (_error) {
    console.error('Blog post update error:', _error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const result = await deleteBlogPost(
      id,
      payload.email as string,
      user.role
    );
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (_error) {
    console.error('Blog post delete error:', _error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 