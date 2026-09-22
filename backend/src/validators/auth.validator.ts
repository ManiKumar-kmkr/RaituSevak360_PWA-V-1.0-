import { z } from 'zod';

export const registerSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number').max(15),
  name: z.string().min(2, 'Name is required'),
  role: z.enum(['farmer', 'labour', 'machinery_provider', 'buyer', 'admin']).optional(),
  language: z.string().optional(),
});

export const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z.string().min(10),
  otp: z.string().length(6),
});
