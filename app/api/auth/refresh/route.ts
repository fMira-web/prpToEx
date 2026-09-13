import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getRefreshTokenFromCookies,
  hashRefreshToken,
  generateRefreshToken,
  signAccessToken,
  setAuthCookies,
  clearAuthCookies,
} from '@/lib/auth';

// Called by the frontend when a request comes back 401 with an expired
// access token. Rotates the refresh token on every use; if a token that
// was already rotated (or revoked) is presented again, every refresh
// token for that user is revoked, forcing a full re-login on all devices —
// this is the standard "reuse detection" mitigation for a stolen refresh
// token cookie.
export async function POST() {
  const rawToken = await getRefreshTokenFromCookies();
  if (!rawToken) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const tokenHash = hashRefreshToken(rawToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    if (existing && !existing.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { userId: existing.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    await clearAuthCookies();
    return NextResponse.json({ error: 'Сессия истекла, войдите заново' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: existing.userId } });
  if (!user) {
    await clearAuthCookies();
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const { raw: newRaw, hash: newHash, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { tokenHash: newHash, userId: user.id, expiresAt },
  });
  await setAuthCookies(accessToken, newRaw);

  return NextResponse.json({ ok: true });
}
