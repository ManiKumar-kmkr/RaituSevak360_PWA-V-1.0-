import { MachineryModel, IMachinery } from '../../../database/models/Machinery';

export class MachineryService {
  async getAvailableMachinery(type?: string, district?: string) {
    const query: any = { isAvailable: true };
    if (type) query.machineryType = type;
    if (district) query['location.district'] = district;
    return MachineryModel.find(query);
  }

  async registerMachinery(data: Partial<IMachinery>) {
    return MachineryModel.create(data);
  }
}

export const machineryService = new MachineryService();
