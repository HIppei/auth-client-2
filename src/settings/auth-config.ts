export const authConfig = {
  scope: 'openid profile email',
  responseType: 'code',
  clientId: '12345',
  redirectUri: 'http://localhost:3001/callback',
  serverUrl: 'http://localhost:3000',
  tokenType: 'Bearer',
};
