import { Request, Response, NextFunction } from 'express';
import { labourService } from '../services/labour.service';
import { sendSuccess } from '../utils/response';

export const getLabour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { district, skill } = req.query as { district?: string; skill?: string };
    const list = await labourService.getAvailableLabour(district, skill);
    sendSuccess(res, list, 'Available labour retrieved');
  } catch (error) {
    next(error);
  }
};

export const registerLabour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await labourService.registerLabour(req.body);
    sendSuccess(res, record, 'Labour registered', 201);
  } catch (error) {
    next(error);
  }
};
