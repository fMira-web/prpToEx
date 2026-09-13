import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth';
import { exerciseAttemptSchema } from '@/lib/validation';

// Per-answer history/analytics (Block 2, backlog item 1's "история и
// аналитика попыток" — not just "day done", the actual score). One row per
// submitted exercise attempt; RoadmapContext's recordExerciseAttempt() is
// the only caller, invoked from each exercise component's own submit/finish
// handler with whatever it already knows (score for the two auto-graded
// skills, raw answers/reflection for the self-assessed ones).

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = exerciseAttemptSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  const { dayNumber, skill, scorePercent, bandEstimate, answers, aiFeedback } = parsed.data;
  const attempt = await prisma.exerciseAttempt.create({
    data: {
      userId,
      dayNumber,
      skill,
      submittedAt: new Date(),
      scorePercent,
      bandEstimate,
      answers,
      aiFeedback,
    },
  });
  return NextResponse.json({ attempt }, { status: 201 });
}

// Optional history read — not wired into any UI yet (that's a future
// "your progress over time" dashboard), but useful to have now that the
// data is actually being recorded.
export async function GET(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const dayNumberParam = searchParams.get('dayNumber');
  const skillParam = searchParams.get('skill');
  const attempts = await prisma.exerciseAttempt.findMany({
    where: {
      userId,
      ...(dayNumberParam ? { dayNumber: parseInt(dayNumberParam, 10) } : {}),
      ...(skillParam ? { skill: skillParam as any } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ attempts });
}
