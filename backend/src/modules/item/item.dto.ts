import { z } from 'zod';

export const itemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title must be at most 120 characters long'),
  description: z.string().min(1, 'Description is required'),
  lat: z.number({ invalid_type_error: 'Latitude must be a number' }),
  lng: z.number({ invalid_type_error: 'Longitude must be a number' }),
});

export type ItemDTO = z.infer<typeof itemSchema>;
