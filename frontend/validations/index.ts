import { z } from 'zod';

export const mobileRegex = /^[6-9]\d{9}$/;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters' })
      .max(70, { message: 'Full name cannot exceed 70 characters' }),
    mobile: z
      .string()
      .trim()
      .regex(mobileRegex, { message: 'Enter a valid 10-digit Indian mobile number' }),
    email: z
      .string()
      .trim()
      .email({ message: 'Enter a valid email address' })
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password is required' }),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the Terms & Conditions and Privacy Policy',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(mobileRegex, { message: 'Enter a valid 10-digit Indian mobile number' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only digits' }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type OTPFormValues = z.infer<typeof otpSchema>;
