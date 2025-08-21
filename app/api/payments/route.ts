import { NextRequest, NextResponse } from 'next/server';

const NICEPAY_BASE =
  process.env.NICEPAY_MODE === 'production'
    ? 'https://api.nicepay.co.kr'
    : 'https://sandbox-api.nicepay.co.kr';

const CLIENT_KEY = process.env.NICEPAY_CLIENT_KEY!;
const SECRET_KEY = process.env.NICEPAY_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader =
      'Basic ' + Buffer.from(`${CLIENT_KEY}:${SECRET_KEY}`).toString('base64');

    const res = await fetch(`${NICEPAY_BASE}/v1/payments`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}