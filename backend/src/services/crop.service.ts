import { CropModel, ICrop } from '../../../database/models/Crop';
import { ApiError } from '../utils/errors';

export class CropService {
  async getCropsByFarmer(farmerId: string) {
    return CropModel.find({ farmerId }).sort({ sowingDate: -1 });
  }

  async getCropById(cropId: string) {
    const crop = await CropModel.findById(cropId);
    if (!crop) {
      throw ApiError.notFound('Crop record not found');
    }
    return crop;
  }

  async createCrop(farmerId: string, cropData: Partial<ICrop>) {
    return CropModel.create({
      ...cropData,
      farmerId,
    });
  }

  async updateCrop(cropId: string, updateData: Partial<ICrop>) {
    const crop = await CropModel.findByIdAndUpdate(cropId, updateData, { new: true });
    if (!crop) {
      throw ApiError.notFound('Crop record not found');
    }
    return crop;
  }

  async deleteCrop(cropId: string) {
    const crop = await CropModel.findByIdAndDelete(cropId);
    if (!crop) {
      throw ApiError.notFound('Crop record not found');
    }
    return { success: true, message: 'Crop deleted successfully' };
  }
}

export const cropService = new CropService();
