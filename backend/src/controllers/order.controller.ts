import { Request, Response, NextFunction } from 'express';
import { marketplaceService } from '../services/marketplace.service';
import { sendSuccess } from '../utils/response';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user?.id as string;
    const order = await marketplaceService.createOrder(buyerId, req.body);
    sendSuccess(res, order, 'Order created successfully', 201);
  } catch (error) {
    next(error);
  }
};
