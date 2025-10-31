import { ItemCondition } from '@prisma/client';
import { z } from 'zod';

const finiteNumber = (message: string) =>
  z.coerce.number({ invalid_type_error: message }).refine((value) => Number.isFinite(value), message);

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  condition: z.nativeEnum(ItemCondition, {
    required_error: 'Condition is required',
    invalid_type_error: 'Condition must be a valid item condition',
  }),
  images: z
    .array(z.string().min(1, 'Image URL must be a non-empty string'), {
      invalid_type_error: 'Images must be an array of image URLs',
    })
    .optional(),
  lat: finiteNumber('Latitude must be a valid number'),
  lng: finiteNumber('Longitude must be a valid number'),
});

export type CreateItemDTO = z.infer<typeof createItemSchema>;
