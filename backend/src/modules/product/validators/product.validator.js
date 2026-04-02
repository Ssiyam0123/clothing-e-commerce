// src/modules/product/validators/product.validator.js

import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const sizeItemSchema = z.object({
  size: z.string().regex(objectIdRegex, "Invalid size ID"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

// From product.validator.js
export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional().default(0),
  images: z.array(z.string()).optional(),
  category: z.string().regex(objectIdRegex),
  subcategory: z.string().regex(objectIdRegex).optional(),
  sizes: z.array(sizeItemSchema).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  featuredOrder: z.number().int().min(0).optional().default(0),
});

export const updateProductSchema = createProductSchema.partial();