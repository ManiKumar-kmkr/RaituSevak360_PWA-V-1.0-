import { Request, Response, NextFunction } from 'express';
import { machineryService } from '../services/machinery.service';
import { sendSuccess } from '../utils/response';

export const getMachinery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, district } = req.query as { type?: string; district?: string };
    const list = await machineryService.getAvailableMachinery(type, district);
    sendSuccess(res, list, 'Available machinery retrieved');
  } catch (error) {
    next(error);
  }
};

export const registerMachinery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.id as string;
    const record = await machineryService.registerMachinery({ ...req.body, ownerId: ownerId as any });
    sendSuccess(res, record, 'Machinery listed successfully', 201);
  } catch (error) {
    next(error);
  }
};
