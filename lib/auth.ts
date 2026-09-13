// Core auth primitives: password hashing, JWT access tokens, and opaque
// rotated refresh tokens, all delivered as httpOnly cookies (never
// exposed to client-side JS — this is what makes it safe against XSS
// stealing the token, unlike storing a JWT in localStorage).
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes — short-lived on purpose
const REFRESH_TOKEN_TTL_DAYS = 30;

const ACCESS_COOKIE_NAME = 'ielts_access';
const REFRESH_COOKIE_NAME = 'ielts_refresh';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
if (!ACCESS_SECRET) {
  // Fail loudly at boot rather than silently signing tokens with `undefined`.
  throw new Error('JWT_ACCESS_SECRET is not set — see .env.example');
}

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
}

// ---- passwords ----

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ---- access tokens (JWT, short-lived, verified on every request) ----

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET!, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET!) as AccessTokenPayload;
  } catch {
    return null; // expired or tampered — treat exactly like "not logged in"
  }
}

// ---- refresh tokens (opaque random string; only its hash ever touches the DB) ----

export function generateRefreshToken(): { raw: string; hash: string; expiresAt: Date } {
  const raw = randomBytes(48).toString('base64url');
  const hash = hashRefreshToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { raw, hash, expiresAt };
}

export function hashRefreshToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

// ---- cookies ----

const isProd = process.env.NODE_ENV === 'production';

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  store.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    // Scoped to /api/auth so the long-lived refresh token is never sent
    // on ordinary page/API requests — only to login/refresh/logout.
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.set(ACCESS_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  store.set(REFRESH_COOKIE_NAME, '', { path: '/api/auth', maxAge: 0 });
}

export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE_NAME)?.value;
}

export async function getRefreshTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE_NAME)?.value;
}

// ---- convenience for protected route handlers (block 2 will use this) ----

export async function requireUserId(): Promise<string | null> {
  const token = await getAccessTokenFromCookies();
  const payload = token ? verifyAccessToken(token) : null;
  return payload?.sub ?? null;
}
