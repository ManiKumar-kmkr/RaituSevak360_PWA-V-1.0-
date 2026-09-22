import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export const getAdvisory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropName, stage, soilType, location } = req.body;
    const advisory = await aiService.getCropAdvisory(cropName, stage, soilType, location);
    sendSuccess(res, advisory, 'AI crop advisory generated');
  } catch (error) {
    next(error);
  }
};

export const detectDisease = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageData, cropType } = req.body;
    const detection = await aiService.detectCropDisease(imageData, cropType);
    sendSuccess(res, detection, 'Disease diagnosis completed');
  } catch (error) {
    next(error);
  }
};

export const chatAssistant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, context } = req.body;
    const response = await aiService.chatWithAssistant(query, context);
    sendSuccess(res, response, 'AI assistant response');
  } catch (error) {
    next(error);
  }
};
