import clientPromise from '@/lib/mongodb';
import type { Document } from 'mongodb';

export interface NewsItem extends Document {
  _id: string;
  title: string;
  timestamp: string;
}

export async function getNewsFromDb(): Promise<{ news?: NewsItem[], error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('financialjuice');

    const news = await db
      .collection<NewsItem>('news')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return { news };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to connect to the database.' };
  }
} 