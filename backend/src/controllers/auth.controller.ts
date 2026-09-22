import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, verifyOtpSchema } from '../validators/auth.validator';
import { sendSuccess } from '../utils/response';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.register(validated as any);
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    const result = await authService.sendOtp(phoneNumber);
    sendSuccess(res, result, 'OTP sent');
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, otp } = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(phoneNumber, otp);
    sendSuccess(res, result, 'Authentication successful');
  } catch (error) {
    next(error);
  }
};
