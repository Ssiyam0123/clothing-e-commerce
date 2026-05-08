import { z } from 'zod';

const sslCommerzSchema = z.object({
  storeId: z.string().optional(),
  storePassword: z.string().optional(),
  isLive: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const bkashSchema = z.object({
  appKey: z.string().optional(),
  appSecret: z.string().optional(),
  userName: z.string().optional(),
  password: z.string().optional(),
  baseURL: z.string().url().optional(),
  isLive: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const pathaoSchema = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  storeId: z.string().optional(),
  userName: z.string().optional(),
  password: z.string().optional(),
  baseURL: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

const metaSchema = z.object({
  pixelId: z.string().optional(),
  accessToken: z.string().optional(),
  testEventCode: z.string().optional(),
  isActive: z.boolean().optional(),
});

const context7Schema = z.object({
  apiKey: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateApiKeysSchema = z.object({
  sslCommerz: sslCommerzSchema.optional(),
  bkash: bkashSchema.optional(),
  pathao: pathaoSchema.optional(),
  meta: metaSchema.optional(),
  context7: context7Schema.optional(),
  updatedBy: z.string().optional(),
});