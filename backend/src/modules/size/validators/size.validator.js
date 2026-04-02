import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSizeSchema = z.object({
  name: z.string().min(1, "Size name is required").max(20),
  description: z.string().optional(),
  category: z.string().regex(objectIdRegex, "Invalid category ID"),
});

export const updateSizeSchema = createSizeSchema.partial();