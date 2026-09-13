import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAccessTokenFromCookies, verifyAccessToken } from '@/lib/auth';

// Cheap "who am I" check the frontend calls on load to decide whether to
// show the login form or the signed-in app shell.
export async function GET() {
  const token = await getAccessTokenFromCookies();
  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) {
    return NextResponse.json({ user: null });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, theme: true, reminderChannel: true },
  });
  return NextResponse.json({ user });
}
