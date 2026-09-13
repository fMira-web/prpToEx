import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, signAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Введите email и пароль' }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Always run bcrypt.compare, even when the user doesn't exist, against a
  // fixed dummy hash — otherwise "unknown email" responds measurably
  // faster than "wrong password" and becomes a timing side-channel that
  // leaks which emails are registered.
  const dummyHash = '$2a$12$C6UzMDM.H6dfI/f/IKcEeOFHKQ4nEAcHt.5V.qF5Hn9UdX4M0RIiq';
  const passwordOk = await verifyPassword(password, user?.passwordHash ?? dummyHash);

  if (!user || !passwordOk) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
  }

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

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
