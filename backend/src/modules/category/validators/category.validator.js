import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  image: z.string().optional(), // Allow any string (file path)
});

export const updateCategorySchema = createCategorySchema.partial();