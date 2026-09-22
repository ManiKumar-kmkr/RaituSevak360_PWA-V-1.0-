import { Request, Response, NextFunction } from 'express';
import { cropService } from '../services/crop.service';
import { sendSuccess } from '../utils/response';
import { createCropSchema } from '../validators/crop.validator';

export const getFarmerCrops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = (req.query.farmerId as string) || (req.user?.id as string);
    const crops = await cropService.getCropsByFarmer(farmerId);
    sendSuccess(res, crops, 'Crops retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCropById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crop = await cropService.getCropById(req.params.id);
    sendSuccess(res, crop, 'Crop details retrieved');
  } catch (error) {
    next(error);
  }
};

export const createCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = req.user?.id as string;
    const validated = createCropSchema.parse(req.body);
    const crop = await cropService.createCrop(farmerId, validated as any);
    sendSuccess(res, crop, 'Crop created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await cropService.updateCrop(req.params.id, req.body);
    sendSuccess(res, updated, 'Crop updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cropService.deleteCrop(req.params.id);
    sendSuccess(res, result, 'Crop deleted');
  } catch (error) {
    next(error);
  }
};
