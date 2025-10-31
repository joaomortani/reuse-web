import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').transform((value) => value.trim().toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
