import { ProductModel, IProduct } from '../../../database/models/Product';
import { OrderModel } from '../../../database/models/Order';

export class MarketplaceService {
  async getProducts(category?: string, district?: string) {
    const query: any = { isActive: true };
    if (category) query.category = category;
    if (district) query['location.district'] = district;
    return ProductModel.find(query).sort({ createdAt: -1 });
  }

  async createProduct(sellerId: string, productData: Partial<IProduct>) {
    return ProductModel.create({
      ...productData,
      sellerId,
    });
  }

  async createOrder(buyerId: string, orderData: any) {
    return OrderModel.create({
      ...orderData,
      buyerId,
    });
  }
}

export const marketplaceService = new MarketplaceService();
