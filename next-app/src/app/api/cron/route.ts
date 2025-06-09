import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest) {
  // 1. Authorize the request
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Execute the Python script
  // We construct the path to be safe.
  const scriptPath = path.join(process.cwd(), 'scripts', 'scraper.py');
  const pythonProcess = spawn('python', [scriptPath]);

  // 3. Log output for debugging in Vercel
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Scraper stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Scraper stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Scraper process exited with code ${code}`);
  });

  // 4. Return a response immediately
  // The script will continue to run in the background on the server.
  return NextResponse.json({
    ok: true,
    message: 'Scraper process started successfully.',
  });
} 