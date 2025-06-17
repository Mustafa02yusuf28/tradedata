import { NextResponse } from 'next/server';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const token = await getTokenFromCookies();
    
    if (!token) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'Not authenticated' 
        },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'Invalid token' 
        },
        { status: 401 }
      );
    }

    // Get user details from database
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('Users');
    const collection = db.collection('Detail');
    
    const user = await collection.findOne({ email: payload.email });
    await client.close();

    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        authenticated: true,
        role: user.role || 'free',
        email: user.email,
        name: user.name
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('User role check error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 