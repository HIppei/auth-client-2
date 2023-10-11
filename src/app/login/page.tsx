'use client';

import { StorageKey } from '@/constants/storage-key';
import { base64UrlEncode } from '@/lib/util';
import { authConfig } from '@/settings/auth-config';
import { createHash, randomBytes } from 'crypto';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { push } = useRouter();

  useEffect(() => {
    const state = base64UrlEncode(randomBytes(32));
    sessionStorage.setItem(StorageKey.AuthRequestState, state);

    const verifier = base64UrlEncode(randomBytes(32));
    sessionStorage.setItem(StorageKey.AuthRequestPKCEVerifier, verifier);

    const [challenge, challengeMethod] = getPKCEChallenge(verifier);

    const params = new URLSearchParams({
      scope: authConfig.scope,
      response_type: authConfig.responseType,
      client_id: authConfig.clientId,
      redirect_uri: authConfig.redirectUri,
      code_challenge: challenge,
      code_challenge_method: challengeMethod,
      state: state,
    });

    const redirectUrl = `${authConfig.serverUrl}?${params.toString()}`;
    push(redirectUrl);
  }, []);

  return <div>Redirect to Auth server</div>;
}

const getPKCEChallenge = (verifier: string) => {
  const base64Challenge = createHash('sha256').update(verifier).digest();
  const challenge = base64UrlEncode(base64Challenge);
  return [challenge, 'S256'];
};
