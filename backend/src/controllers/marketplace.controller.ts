import { Request, Response, NextFunction } from 'express';
import { marketplaceService } from '../services/marketplace.service';
import { sendSuccess } from '../utils/response';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, district } = req.query as { category?: string; district?: string };
    const products = await marketplaceService.getProducts(category, district);
    sendSuccess(res, products, 'Products retrieved');
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id as string;
    const product = await marketplaceService.createProduct(sellerId, req.body);
    sendSuccess(res, product, 'Product listed', 201);
  } catch (error) {
    next(error);
  }
};
