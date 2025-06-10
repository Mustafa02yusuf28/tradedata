import { NextResponse } from 'next/server';
import { getNewsFromDb } from '@/lib/news';

// This line tells Next.js to treat this route as a fully dynamic route
export const dynamic = 'force-dynamic';

export async function GET() {
  const { news, error } = await getNewsFromDb();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ news });
} 