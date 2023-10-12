import { authConfig } from '@/settings/auth-config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export const base64UrlEncode = (buffer: Buffer) => {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const verifyIdToken = async (idToken: string) => {
  try {
    const jwks = createRemoteJWKSet(new URL(authConfig.cognitoJWKSUrl));

    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: authConfig.issuer,
      audience: authConfig.audience,
    });
    const userName = payload['cognito:username'] as string;
    if (!userName) throw new Error('invlaid_token');

    const now = Math.ceil(Date.now() / 1000);
    // If issued time and current time differenciate by before and after 300 seconds.
    if (!payload.iat || Math.abs(now - payload.iat) > 300) {
      console.log('Invalid iat', now, payload.iat);
      throw new Error('invalid_iat');
    }
    if (!payload.exp || now > payload.exp) {
      console.log('Invalid exp', now, payload.exp);
      throw new Error('invalid_exp');
    }

    return userName;
  } catch (err) {
    console.log(err);
    return null;
  }
};
