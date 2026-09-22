import { LabourModel, ILabour } from '../../../database/models/Labour';

export class LabourService {
  async getAvailableLabour(district?: string, skill?: string) {
    const query: any = { availabilityStatus: 'available' };
    if (district) query['location.district'] = district;
    if (skill) query.skills = skill;
    return LabourModel.find(query);
  }

  async registerLabour(data: Partial<ILabour>) {
    return LabourModel.create(data);
  }
}

export const labourService = new LabourService();
