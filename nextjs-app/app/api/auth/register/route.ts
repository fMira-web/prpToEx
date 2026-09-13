import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation';
import { hashPassword, signAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Некорректные данные' }, { status: 400 });
  }
  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Deliberately the same generic message a bad password would get,
    // so this endpoint can't be used to enumerate registered emails.
    return NextResponse.json({ error: 'Не удалось создать аккаунт с этими данными' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true },
  });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const { raw: refreshRaw, hash: refreshHash, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshHash,
      userId: user.id,
      expiresAt,
      userAgent: req.headers.get('user-agent') ?? undefined,
      ip: req.headers.get('x-forwarded-for') ?? undefined,
    },
  });
  await setAuthCookies(accessToken, refreshRaw);

  return NextResponse.json({ user }, { status: 201 });
}
