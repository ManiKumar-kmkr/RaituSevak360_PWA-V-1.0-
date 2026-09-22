import { z } from 'zod';

export const createCropSchema = z.object({
  farmId: z.string().min(1, 'Farm ID is required'),
  cropName: z.string().min(1, 'Crop name is required'),
  variety: z.string().optional(),
  season: z.enum(['kharif', 'rabi', 'zaid']),
  sowingDate: z.string().or(z.date()),
  expectedHarvestDate: z.string().or(z.date()).optional(),
  areaInAcres: z.number().positive(),
  currentStage: z.enum(['sowing', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'completed']).optional(),
  healthStatus: z.enum(['healthy', 'at_risk', 'diseased']).optional(),
  notes: z.string().optional(),
});

export const updateCropSchema = createCropSchema.partial();
