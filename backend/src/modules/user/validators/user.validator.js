import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, "Street is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  zip: z.string().min(1, "Zip code is required").optional(),
  country: z.string().min(1, "Country is required").optional(),
  isDefault: z.boolean().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  addresses: z.array(addressSchema).optional(),
});

export const updateUserSchema = createUserSchema.partial();