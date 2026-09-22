import { SoilModel, ISoil } from '../../../database/models/Soil';

export class SoilService {
  async getSoilRecordsByFarm(farmId: string) {
    return SoilModel.find({ farmId }).sort({ testDate: -1 });
  }

  async addSoilRecord(farmerId: string, soilData: Partial<ISoil>) {
    return SoilModel.create({
      ...soilData,
      farmerId,
    });
  }
}

export const soilService = new SoilService();
