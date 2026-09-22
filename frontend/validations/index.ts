import { z } from 'zod';

export const loginFormSchema = z.object({
  phoneNumber: z.string().min(10, 'దయచేసి 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి'),
});

export const registerFormSchema = z.object({
  fullName: z.string().min(2, 'పేరు తప్పనిసరి'),
  phoneNumber: z.string().min(10, 'చెల్లుబాటు అయ్యే ఫోన్ నంబర్ ఇవ్వండి'),
  role: z.string().default('farmer'),
});

export const cropFormSchema = z.object({
  cropName: z.string().min(1, 'పంట పేరు అవసరం'),
  season: z.enum(['kharif', 'rabi', 'zaid']),
  areaInAcres: z.number().positive('విస్తీర్ణం సున్నా కంటే ఎక్కువ ఉండాలి'),
  sowingDate: z.string().min(1, 'విత్తిన తేదీ అవసరం'),
});

export const bookingFormSchema = z.object({
  startDate: z.string().min(1, 'ప్రారంభ తేదీ తప్పనిసరి'),
  endDate: z.string().min(1, 'ముగింపు తేదీ తప్పనిసరి'),
  totalUnits: z.number().positive(),
});

export const marketplaceProductSchema = z.object({
  name: z.string().min(2, 'ఉత్పత్తి పేరు అవసరం'),
  category: z.enum(['seeds', 'fertilizers', 'pesticides', 'produce', 'tools']),
  pricePerUnit: z.number().positive(),
  unit: z.string().min(1),
  availableQuantity: z.number().positive(),
});
