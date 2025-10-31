import { z } from 'zod';

const finiteNumber = (message: string) =>
  z.coerce.number({ invalid_type_error: message }).refine((value) => Number.isFinite(value), message);

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  lat: finiteNumber('Latitude must be a valid number'),
  lng: finiteNumber('Longitude must be a valid number'),
});

export type CreateItemDTO = z.infer<typeof createItemSchema>;
