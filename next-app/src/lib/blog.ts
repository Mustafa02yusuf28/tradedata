import clientPromise from '@/lib/mongodb';
import type { Document } from 'mongodb';
import { ObjectId } from 'mongodb';

export interface BlogPost extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  content: BlogContent[];
  author: string;
  authorId: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  visibility: 'public' | 'premium';
  keywords?: string[];
}

export interface BlogContent {
  type: 'paragraph' | 'image' | 'link';
  content: string;
  order: number;
  title?: string;
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: 'small' | 'normal' | 'large' | 'xlarge';
    color?: string;
    highlight?: boolean;
  };
  imageFile?: File | null;
  imageUrl?: string;
}

export interface CreateBlogPostData {
  title: string;
  description: string;
  content: BlogContent[];
  author: string;
  authorId: string;
  thumbnail?: string;
  thumbnailFile?: File;
  visibility?: 'public' | 'premium';
  keywords?: string[];
}

export async function getBlogPosts(): Promise<{ posts?: BlogPost[], error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('blog');

    const posts = await db
      .collection<BlogPost>('content')
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .toArray();

    return { posts };
  } catch (e) {
    console.error('Error fetching blog posts:', e);
    return { error: 'Failed to fetch blog posts.' };
  }
}

export async function getBlogPostById(id: string): Promise<{ post?: BlogPost, error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('blog');

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return { error: 'Invalid blog post ID.' };
    }

    const post = await db
      .collection<BlogPost>('content')
      .findOne({ _id: objectId, isPublished: true });

    if (!post) {
      return { error: 'Blog post not found.' };
    }

    return { post };
  } catch (e) {
    console.error('Error fetching blog post:', e);
    return { error: 'Failed to fetch blog post.' };
  }
}

export async function createBlogPost(data: CreateBlogPostData): Promise<{ post?: BlogPost, error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('blog');

    const newPost = {
      ...data,
      visibility: data.visibility || 'public',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true,
    };

    const result = await db
      .collection<BlogPost>('content')
      .insertOne(newPost as BlogPost);

    if (result.insertedId) {
      const createdPost = await db
        .collection<BlogPost>('content')
        .findOne({ _id: result.insertedId });

      return { post: createdPost! };
    }

    return { error: 'Failed to create blog post.' };
  } catch (e) {
    console.error('Error creating blog post:', e);
    return { error: 'Failed to create blog post.' };
  }
}

export async function searchBlogPosts(query: string): Promise<{ posts?: BlogPost[], error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('blog');

    const posts = await db
      .collection<BlogPost>('content')
      .find({
        isPublished: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'content.content': { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return { posts };
  } catch (e) {
    console.error('Error searching blog posts:', e);
    return { error: 'Failed to search blog posts.' };
  }
}

export async function updateBlogPost(
  id: string, 
  data: Partial<CreateBlogPostData>, 
  authorId: string,
  userRole: string
): Promise<{ post?: BlogPost, error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('blog');

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return { error: 'Invalid blog post ID.' };
    }

    // Get the existing post
    const existingPost = await db
      .collection<BlogPost>('content')
      .findOne({ _id: objectId });

    if (!existingPost) {
      return { error: 'Blog post not found.' };
    }

    // Check permissions: only author or admin can edit
    if (existingPost.authorId !== authorId && userRole !== 'admin') {
      return { error: 'You can only edit your own posts.' };
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<BlogPost>('content')
      .updateOne(
        { _id: objectId },
        { $set: updateData }
      );

    if (result.modifiedCount === 0) {
      return { error: 'Failed to update blog post.' };
    }

    const updatedPost = await db
      .collection<BlogPost>('content')
      .findOne({ _id: objectId });

    return { post: updatedPost! };
  } catch (e) {
    console.error('Error updating blog post:', e);
    return { error: 'Failed to update blog post.' };
  }
}

export async function deleteBlogPost(
  id: string, 
  authorId: string,
  userRole: string
): Promise<{ success?: boolean, error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('blog');

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return { error: 'Invalid blog post ID.' };
    }

    // Get the existing post
    const existingPost = await db
      .collection<BlogPost>('content')
      .findOne({ _id: objectId });

    if (!existingPost) {
      return { error: 'Blog post not found.' };
    }

    // Check permissions: only author or admin can delete
    if (existingPost.authorId !== authorId && userRole !== 'admin') {
      return { error: 'You can only delete your own posts.' };
    }

    const result = await db
      .collection<BlogPost>('content')
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return { error: 'Failed to delete blog post.' };
    }

    return { success: true };
  } catch (e) {
    console.error('Error deleting blog post:', e);
    return { error: 'Failed to delete blog post.' };
  }
} 