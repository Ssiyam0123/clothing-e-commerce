import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSubcategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  category: z.string().regex(objectIdRegex, "Invalid category ID"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const updateSubcategorySchema = createSubcategorySchema.partial();