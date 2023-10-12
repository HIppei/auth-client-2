export const authConfig = {
  scope: 'openid profile email',
  responseType: 'code',
  clientId: '6789',
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3002/callback',
  grantTyype: 'authorization_code',
  tokenType: 'Bearer',
  audience: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
  issuer: `https://cognito-idp.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_USER_POOL_ID}`,
  authServerUrl: 'http://localhost:3000',
  cognitoJWKSUrl: `https://cognito-idp.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_USER_POOL_ID}/.well-known/jwks.json`,
};
