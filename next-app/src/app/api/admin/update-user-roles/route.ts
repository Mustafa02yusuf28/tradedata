import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Check authentication
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

    // Check if user is admin
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('Users');
    const collection = db.collection('Detail');
    
    const user = await collection.findOne({ email: payload.email });
    if (!user || user.role !== 'admin') {
      await client.close();
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Update all users who don't have a role field or have null/undefined role
    const result = await collection.updateMany(
      { $or: [{ role: { $exists: false } }, { role: null }] },
      { $set: { role: "free" } }
    );

    await client.close();

    return NextResponse.json({
      message: 'User roles updated successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error) {
    console.error('Error updating user roles:', error);
    return NextResponse.json(
      { error: 'Failed to update user roles' },
      { status: 500 }
    );
  }
}

// GET method to check current user roles (admin only)
export async function GET() {
  try {
    // Check authentication
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

    // Check if user is admin
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('Users');
    const collection = db.collection('Detail');
    
    const user = await collection.findOne({ email: payload.email });
    if (!user || user.role !== 'admin') {
      await client.close();
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all users with their roles
    const users = await collection.find({}, { 
      projection: { email: 1, name: 1, role: 1, _id: 0 } 
    }).toArray();

    await client.close();

    return NextResponse.json({
      users,
      totalUsers: users.length,
      usersWithRole: users.filter(u => u.role).length,
      usersWithoutRole: users.filter(u => !u.role).length
    });

  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user roles' },
      { status: 500 }
    );
  }
} 