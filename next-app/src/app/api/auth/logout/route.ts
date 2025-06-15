import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    response.headers.set(
      'Set-Cookie',
      'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    );
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 