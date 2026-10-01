import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, mobile, email, password, role } = req.body;

      if (!name || !mobile || !password) {
        res.status(400).json({
          success: false,
          message: 'Full name, mobile number, and password are required.',
        });
        return;
      }

      const result = await authService.register({ name, mobile, email, password, role });

      res.status(201).json({
        success: true,
        message: 'Account created successfully. Please verify OTP.',
        user: result.user,
        token: result.token,
        requiresOtp: result.requiresOtp,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      res.status(400).json({ success: false, message: msg });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, password } = req.body;

      if (!mobile) {
        res.status(400).json({
          success: false,
          message: 'Mobile number is required.',
        });
        return;
      }

      const result = await authService.login(mobile, password);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        user: result.user,
        token: result.token,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      const isValidation = msg.includes('valid 10-digit') || msg.includes('required');
      const isNotFound = msg.includes('not found') || msg.includes('register first');
      const status = isValidation ? 400 : isNotFound ? 404 : 401;
      res.status(status).json({ success: false, message: msg });
    }
  },

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, purpose } = req.body;

      if (!mobile) {
        res.status(400).json({
          success: false,
          message: 'Mobile number is required.',
        });
        return;
      }

      const result = await authService.sendOtp(mobile, purpose);

      res.status(200).json({
        success: true,
        message: result.message,
        data: { otpSent: result.otpSent },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP.';
      res.status(500).json({ success: false, message: msg });
    }
  },

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, otp, purpose } = req.body;

      if (!mobile || !otp) {
        res.status(400).json({
          success: false,
          message: 'Mobile number and OTP are required.',
        });
        return;
      }

      const result = await authService.verifyOtp(mobile, otp, purpose);

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully.',
        user: result.user,
        token: result.token,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP. Please check the code and try again.';
      res.status(400).json({ success: false, message: msg });
    }
  },

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { mobile } = req.body;

      if (!mobile) {
        res.status(400).json({
          success: false,
          message: 'Mobile number is required.',
        });
        return;
      }

      const result = await authService.resendOtp(mobile);

      res.status(200).json({
        success: true,
        message: result.message,
        data: { otpSent: result.otpSent },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP.';
      res.status(500).json({ success: false, message: msg });
    }
  },

  async updateRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { role } = req.body;
      const userPayload = req.user;

      if (!userPayload?.id && !userPayload?.mobile) {
        res.status(401).json({
          success: false,
          message: 'Authentication required. Token missing or invalid.',
        });
        return;
      }

      if (!role) {
        res.status(400).json({
          success: false,
          message: 'Role is required.',
        });
        return;
      }

      const identifier = userPayload.id || userPayload.mobile;
      const result = await authService.updateRole(identifier, role);

      res.status(200).json({
        success: true,
        message: 'Role updated successfully.',
        data: result.user,
        token: result.token,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role.';
      res.status(400).json({ success: false, message: msg });
    }
  },

  async switchRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { role } = req.body;
      const userPayload = req.user;

      if (!userPayload?.id && !userPayload?.mobile) {
        res.status(401).json({
          success: false,
          message: 'Authentication required. Token missing or invalid.',
        });
        return;
      }

      if (!role) {
        res.status(400).json({
          success: false,
          message: 'Target role is required.',
        });
        return;
      }

      const identifier = userPayload.id || userPayload.mobile;
      const result = await authService.switchRole(identifier, role);

      res.status(200).json({
        success: true,
        message: 'Role switched successfully.',
        data: result.user,
        token: result.token,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to switch role.';
      res.status(400).json({ success: false, message: msg });
    }
  },

  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userPayload = req.user;

      if (!userPayload?.id && !userPayload?.mobile) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      let user = await authService.findById(userPayload.id);
      if (!user && userPayload.mobile) {
        user = await authService.findByMobile(userPayload.mobile);
      }

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User profile not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch user profile.';
      res.status(500).json({ success: false, message: msg });
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  },
};

export default authController;
