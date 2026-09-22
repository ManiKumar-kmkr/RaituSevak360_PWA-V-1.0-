import { Request, Response, NextFunction } from 'express';
import { soilService } from '../services/soil.service';
import { sendSuccess } from '../utils/response';

export const getSoilReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId;
    const reports = await soilService.getSoilRecordsByFarm(farmId);
    sendSuccess(res, reports, 'Soil reports retrieved');
  } catch (error) {
    next(error);
  }
};

export const addSoilReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = req.user?.id as string;
    const report = await soilService.addSoilRecord(farmerId, req.body);
    sendSuccess(res, report, 'Soil report added', 201);
  } catch (error) {
    next(error);
  }
};
