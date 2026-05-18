// src/modules/product/validators/product.validator.js

import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const sizeItemSchema = z.object({
  size: z.string().regex(objectIdRegex, "Invalid size ID"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const specificationsSchema = z.object({
  fit: z.string().optional().nullable(),
  sleeve: z.string().optional().nullable(),
  pattern: z.string().optional().nullable(),
  collar: z.string().optional().nullable(),
});

const seoSchema = z.object({
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
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
  subcategory: z.string().regex(objectIdRegex).optional().nullable(),
  sizes: z.array(sizeItemSchema).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  showReviews: z.boolean().optional().default(true),
  featuredOrder: z.number().int().min(0).optional().default(0),
  sku: z.string().optional().nullable(),
  gtin: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  gender: z.enum(['Men', 'Women', 'Unisex', 'Kids']).optional().default('Unisex'),
  specifications: specificationsSchema.optional().nullable(),
  faqs: z.array(faqItemSchema).optional().nullable(),
  seo: seoSchema.optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();