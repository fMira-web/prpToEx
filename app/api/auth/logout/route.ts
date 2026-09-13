import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRefreshTokenFromCookies, hashRefreshToken, clearAuthCookies } from '@/lib/auth';

export async function POST() {
  const rawToken = await getRefreshTokenFromCookies();
  if (rawToken) {
    const tokenHash = hashRefreshToken(rawToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
