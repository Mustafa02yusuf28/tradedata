export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('Users');
    const collection = db.collection('Detail');

    // Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      await client.close();
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    await collection.insertOne(user);
    await client.close();

    // Create token
    const token = await createToken({ email, name });
    const response = NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
    response.headers.set(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
    );
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 