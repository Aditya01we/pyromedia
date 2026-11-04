import { NextRequest, NextResponse } from 'next/server';

/**
 * API route that proxies contact form submissions to Google Apps Script.
 * The actual Apps Script URL is kept server-side only (not exposed to the client).
 */

const SHEETS_ENDPOINT = process.env.GOOGLE_SHEETS_URL;

if (!SHEETS_ENDPOINT) {
  console.warn('Missing GOOGLE_SHEETS_URL env var — contact form submissions will fail.');
}

export async function POST(request: NextRequest) {
  if (!SHEETS_ENDPOINT) {
    return NextResponse.json(
      { error: 'Server misconfigured: no endpoint' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    // Forward the POST to the Apps Script endpoint.
    // Apps Script doesn't support CORS, but since this is server-to-server,
    // CORS doesn't apply — it just works.
    const response = await fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Return success to the client regardless of what the script sends back.
    // (Apps Script's response is often empty or opaque anyway.)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Submission failed' },
      { status: 500 }
    );
  }
}
