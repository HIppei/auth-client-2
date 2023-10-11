'use client';

import { StorageKey } from '@/constants/storage-key';
import CognitoSession from '@/sessions/cognito-session';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const exchangeToken = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const sessionState = sessionStorage.getItem(StorageKey.AuthRequestState);

      if (state !== sessionState) {
        console.log('inconsistent state');
        return;
      }

      const verifier = sessionStorage.getItem(StorageKey.AuthRequestPKCEVerifier);
      const res = await fetch('/api/token', {
        method: 'POST',
        body: JSON.stringify({ code: code, verifier: verifier }),
      });

      if (!res.ok) {
        console.log('token exchange error');
        return;
      }

      const result: { userName: string; idToken: string; accessToken: string; refreshToken: string } = await res.json();
      if (result.userName && result.idToken && result.accessToken && result.refreshToken) {
        CognitoSession.store(result);
        push('/');
      }
    };

    exchangeToken();
  }, []);

  return <div>callback</div>;
}
