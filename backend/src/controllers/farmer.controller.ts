import { Request, Response, NextFunction } from 'express';
import { farmerService } from '../services/farmer.service';
import { sendSuccess } from '../utils/response';
import { createFarmerSchema } from '../validators/farmer.validator';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const profile = await farmerService.getProfile(userId);
    sendSuccess(res, profile, 'Farmer profile fetched');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const validated = createFarmerSchema.partial().parse(req.body);
    const profile = await farmerService.updateProfile(userId, validated as any);
    sendSuccess(res, profile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getFarms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = req.params.farmerId || (req.user?.id as string);
    const farms = await farmerService.getFarms(farmerId);
    sendSuccess(res, farms, 'Farms retrieved');
  } catch (error) {
    next(error);
  }
};
