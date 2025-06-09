import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// This line tells Next.js to treat this route as a fully dynamic route
export const dynamic = 'force-dynamic';

// Ensure the MongoDB URI is set in your environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local or your Vercel project settings.');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('financialjuice'); // Your database name

    const news = await db
      .collection('news') // Your collection name
      .find({})
      .sort({ timestamp: -1 }) // Sort by timestamp, newest first
      .limit(50) // Get the top 50 latest headlines
      .toArray();

    return NextResponse.json({ news });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch news feed.' }, { status: 500 });
  }
} 