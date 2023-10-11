export const base64UrlEncode = (buffer: Buffer) => {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};
