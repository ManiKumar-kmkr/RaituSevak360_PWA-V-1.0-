import { connectDatabase, disconnectDatabase } from '../database';
import { UserModel, UserRole } from '../models/User';
import { FarmerModel } from '../models/Farmer';
import { ProductModel } from '../models/Product';

/**
 * Seed initial database records for development and testing.
 */
async function seed() {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDatabase();

    // Clean existing sample data in development
    console.log('[Seed] Cleaning existing mock users & farmers...');
    await UserModel.deleteMany({ phoneNumber: { $in: ['+919876543210', '+919999999999'] } });

    // Seed Sample Farmer User
    const farmerUser = await UserModel.create({
      phoneNumber: '+919876543210',
      name: 'Ramesh Patel',
      role: UserRole.FARMER,
      language: 'te',
      isVerified: true,
    });

    // Seed Sample Farmer Profile
    await FarmerModel.create({
      userId: farmerUser._id,
      village: 'Kothapalli',
      mandal: 'Karimnagar Rural',
      district: 'Karimnagar',
      state: 'Telangana',
      pincode: '505001',
      totalLandAcres: 5.5,
      primaryCrops: ['Paddy', 'Cotton', 'Chilli'],
      preferredLanguage: 'te',
    });

    console.log('[Seed] Database seeded successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  seed();
}
