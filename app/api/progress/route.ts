import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth';
import { progressPostSchema, progressPutSchema } from '@/lib/validation';

// Cross-device progress sync (Block 2). Replaces the localStorage-only
// "completed days" set from RoadmapContext when a user is signed in — see
// RoadmapContext.tsx's pull-then-merge-then-push effect for how the client
// reconciles this with whatever it already had locally (union, never a
// silent overwrite in either direction).

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const rows = await prisma.dayProgress.findMany({
    where: { userId, completed: true },
    select: { dayNumber: true },
  });
  return NextResponse.json({ completedDays: rows.map((r) => r.dayNumber) });
}

// Bulk replace-set — used once right after login to push a merged
// (local ∪ server) set back up, and by Backup/Restore.
export async function PUT(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = progressPutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  const wanted = new Set(parsed.data.completedDays);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const existing = await tx.dayProgress.findMany({ where: { userId } });
    const byDay = new Map(existing.map((r) => [r.dayNumber, r]));
    for (const day of wanted) {
      const row = byDay.get(day);
      if (!row) {
        await tx.dayProgress.create({ data: { userId, dayNumber: day, completed: true, completedAt: now } });
      } else if (!row.completed) {
        await tx.dayProgress.update({ where: { id: row.id }, data: { completed: true, completedAt: now } });
      }
    }
    for (const row of existing) {
      if (row.completed && !wanted.has(row.dayNumber)) {
        await tx.dayProgress.update({ where: { id: row.id }, data: { completed: false, completedAt: null } });
      }
    }
  });

  return NextResponse.json({ ok: true });
}

// Single-day toggle — what the ordinary checkbox click sends.
export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = progressPostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  const { dayNumber, completed } = parsed.data;
  const row = await prisma.dayProgress.upsert({
    where: { userId_dayNumber: { userId, dayNumber } },
    create: { userId, dayNumber, completed, completedAt: completed ? new Date() : null },
    update: { completed, completedAt: completed ? new Date() : null },
  });
  return NextResponse.json({ dayProgress: row });
}

// "Reset progress" — clears every day for this account.
export async function DELETE() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  await prisma.dayProgress.updateMany({ where: { userId }, data: { completed: false, completedAt: null } });
  return NextResponse.json({ ok: true });
}
