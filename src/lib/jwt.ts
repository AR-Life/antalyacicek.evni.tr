import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(import.meta.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-this');

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch (error) {
    return null;
  }
}
