import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Введите корректный email'),
  password: z.string().min(8, 'Пароль должен быть не короче 8 символов').max(72),
  name: z.string().trim().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ---- Block 2: progress + exercise-attempt history ----

export const progressPutSchema = z.object({
  // Bulk replace-set, used once after login (merge local/offline progress
  // into the server) and by Backup/Restore.
  completedDays: z.array(z.number().int().min(1).max(180)).max(180),
});

export const progressPostSchema = z.object({
  // Single-day toggle — what the ordinary "click a checkbox" flow sends.
  dayNumber: z.number().int().min(1).max(180),
  completed: z.boolean(),
});

export const exerciseAttemptSchema = z.object({
  dayNumber: z.number().int().min(1).max(180),
  skill: z.enum(['LISTENING', 'READING', 'WRITING', 'SPEAKING']),
  scorePercent: z.number().min(0).max(100).optional(),
  bandEstimate: z.number().min(1).max(9).optional(),
  answers: z.any().optional(),
  aiFeedback: z.string().max(20000).optional(),
});

export type ProgressPutInput = z.infer<typeof progressPutSchema>;
export type ProgressPostInput = z.infer<typeof progressPostSchema>;
export type ExerciseAttemptInput = z.infer<typeof exerciseAttemptSchema>;
