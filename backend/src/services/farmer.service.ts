import { FarmerModel, IFarmer } from '../../../database/models/Farmer';
import { FarmModel } from '../../../database/models/Farm';
import { ApiError } from '../utils/errors';

export class FarmerService {
  async getProfile(userId: string) {
    const farmer = await FarmerModel.findOne({ userId }).populate('userId', 'name phoneNumber role');
    if (!farmer) {
      throw ApiError.notFound('Farmer profile not found');
    }
    return farmer;
  }

  async updateProfile(userId: string, updateData: Partial<IFarmer>) {
    const farmer = await FarmerModel.findOneAndUpdate({ userId }, updateData, {
      new: true,
      upsert: true,
    });
    return farmer;
  }

  async getFarms(farmerId: string) {
    return FarmModel.find({ farmerId, isActive: true });
  }

  async addFarm(farmerId: string, farmData: any) {
    return FarmModel.create({
      ...farmData,
      farmerId,
    });
  }
}

export const farmerService = new FarmerService();
