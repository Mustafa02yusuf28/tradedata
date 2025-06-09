import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// This line tells Next.js to treat this route as a fully dynamic route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('financialjuice');

    const news = await db
      .collection('news')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ news });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch news feed.' }, { status: 500 });
  }
} 