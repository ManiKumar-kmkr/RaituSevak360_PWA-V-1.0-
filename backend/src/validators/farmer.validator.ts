import { z } from 'zod';

export const createFarmerSchema = z.object({
  village: z.string().min(1, 'Village is required'),
  mandal: z.string().min(1, 'Mandal is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  totalLandAcres: z.number().nonnegative(),
  primaryCrops: z.array(z.string()).optional(),
  preferredLanguage: z.string().optional(),
});

export const updateFarmerSchema = createFarmerSchema.partial();
