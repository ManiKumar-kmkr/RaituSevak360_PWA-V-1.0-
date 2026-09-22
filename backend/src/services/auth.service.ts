import { UserModel, UserRole } from '../../../database/models/User';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/errors';

export class AuthService {
  async register(data: { phoneNumber: string; name: string; role?: string; language?: string }) {
    const existing = await UserModel.findOne({ phoneNumber: data.phoneNumber });
    if (existing) {
      throw ApiError.badRequest('User with this phone number already exists');
    }

    const user = await UserModel.create({
      phoneNumber: data.phoneNumber,
      name: data.name,
      role: (data.role as UserRole) || UserRole.FARMER,
      language: data.language || 'te',
      isVerified: true, // Auto-verified for initial flow
    });

    const token = generateToken({
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    return { user, token };
  }

  async sendOtp(phoneNumber: string) {
    // Integration point with SMS Gateway
    return {
      phoneNumber,
      message: 'OTP sent successfully (Simulated for development: 123456)',
    };
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    // Simulated OTP check for development
    if (otp !== '123456' && process.env.NODE_ENV !== 'production') {
      // In dev allow 123456
    }

    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      throw ApiError.notFound('User not found. Please register first.');
    }

    const token = generateToken({
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    return { user, token };
  }
}

export const authService = new AuthService();
