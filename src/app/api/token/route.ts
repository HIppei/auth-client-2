import { verifyIdToken } from '@/lib/util';
import { authConfig } from '@/settings/auth-config';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const authorization = `Basic ${authConfig.clientId}:${authConfig.clientSecret}`;

    const body = { code: reqBody.code, grant_type: authConfig.grantTyype, code_verifier: reqBody.verifier };
    const res = await fetch(`${authConfig.authServerUrl}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: authorization },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok) return NextResponse.json({ error: result }, { status: res.status });

    const userName = await verifyIdToken(result.id_token);

    if (!userName) throw new Error('invalid_token');

    return NextResponse.json(
      {
        userName: userName,
        idToken: result.id_token,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
