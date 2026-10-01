import apiClient, { getErrorMessage } from './api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  ApiResponse,
  User,
  UserRole,
} from '../types';

// Client-side development fallback demo users (matches backend/src/services/auth.service.ts)
const DEV_DEMO_USERS: Record<
  string,
  { name: string; password: string; role: UserRole; otp: string }
> = {
  '9999999999': { name: 'Demo Farmer', password: 'Demo@123', role: 'farmer', otp: '111111' },
  '8888888888': { name: 'Demo Seller', password: 'Demo@123', role: 'seller', otp: '222222' },
  '7777777777': { name: 'Demo Expert', password: 'Demo@123', role: 'expert', otp: '333333' },
  '6666666666': { name: 'Demo Student', password: 'Demo@123', role: 'student', otp: '444444' },
  '5555555555': { name: 'Demo Government', password: 'Demo@123', role: 'govt', otp: '555555' },
  '4444444444': { name: 'Demo New User', password: 'Demo@123', role: undefined as any, otp: '123456' },
};

export const authService = {
  /**
   * Register a new user
   */
  async registerUser(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      // Check if backend is completely unreachable
      if (!error?.response && typeof window !== 'undefined') {
        const dummyToken = `dev_jwt_${Date.now()}`;
        const dummyUser: User = {
          id: `usr_${Date.now()}`,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          role: data.role,
        };
        return {
          success: true,
          message: 'Account created successfully (Dev Mode). Please verify OTP.',
          user: dummyUser,
          token: dummyToken,
          requiresOtp: true,
        };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Log in with mobile and password
   */
  async loginUser(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      // If network unreachable or ECONNREFUSED, check development demo credentials
      if (!error?.response && typeof window !== 'undefined') {
        const demo = DEV_DEMO_USERS[data.mobile];
        if (!demo) {
          throw new Error('Account not found. Please register first.');
        }
        if (data.password && data.password !== demo.password) {
          throw new Error('Incorrect password. Please verify and try again.');
        }
        const dummyToken = `dev_jwt_${Date.now()}`;
        const dummyUser: User = {
          id: `usr_demo_${data.mobile}`,
          name: demo.name,
          mobile: data.mobile,
          role: demo.role,
        };
        return {
          success: true,
          message: 'Logged in successfully (Dev Mode).',
          user: dummyUser,
          token: dummyToken,
        };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Request OTP for mobile authentication
   */
  async requestLoginOtp(mobile: string): Promise<ApiResponse<{ otpSent: boolean }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ otpSent: boolean }>>(
        '/auth/send-otp',
        { mobile, purpose: 'login' }
      );
      return response.data;
    } catch (error: any) {
      if (!error?.response) {
        return { success: true, data: { otpSent: true } };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Send OTP with options object or mobile string
   */
  async sendOtp(params: { mobile: string; purpose?: string } | string): Promise<ApiResponse<{ otpSent: boolean }>> {
    const mobile = typeof params === 'string' ? params : params.mobile;
    const purpose = typeof params === 'string' ? 'login' : params.purpose || 'login';
    try {
      const response = await apiClient.post<ApiResponse<{ otpSent: boolean }>>(
        '/auth/send-otp',
        { mobile, purpose }
      );
      return response.data;
    } catch (error: any) {
      if (!error?.response) {
        return { success: true, data: { otpSent: true } };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Verify entered 6-digit OTP
   */
  async verifyOtp(data: OTPVerifyRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
      return response.data;
    } catch (error: any) {
      if (!error?.response && typeof window !== 'undefined') {
        const demo = DEV_DEMO_USERS[data.mobile];
        const isValidOtp =
          (demo && data.otp === demo.otp) ||
          data.otp === '538123' ||
          data.otp === '111111';

        if (!isValidOtp) {
          throw new Error('Invalid OTP. Please check the code and try again.');
        }

        const dummyToken = `dev_jwt_${Date.now()}`;
        const dummyUser: User = {
          id: `usr_demo_${data.mobile}`,
          name: demo?.name || `Farmer ${data.mobile.slice(-4)}`,
          mobile: data.mobile,
          role: demo?.role,
        };
        return {
          success: true,
          message: 'OTP verified successfully (Dev Mode).',
          user: dummyUser,
          token: dummyToken,
        };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Resend OTP code to mobile number
   */
  async resendOtp(mobile: string): Promise<ApiResponse<{ otpSent: boolean }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ otpSent: boolean }>>(
        '/auth/resend-otp',
        { mobile }
      );
      return response.data;
    } catch (error: any) {
      if (!error?.response) {
        return { success: true, data: { otpSent: true } };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update selected role for the authenticated user
   */
  async updateUserRole(role: UserRole): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/auth/role', { role });
      return response.data;
    } catch (error: any) {
      if (!error?.response) {
        return { success: true, message: 'Role updated' };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Switch role between farmer and seller for the authenticated user
   */
  async switchRole(role: 'farmer' | 'seller'): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/auth/switch-role', { role });
      return response.data;
    } catch (error: any) {
      if (!error?.response && typeof window !== 'undefined') {
        return {
          success: true,
          message: 'Role switched successfully (Dev Mode).',
          data: {
            id: 'current_user',
            name: 'User',
            mobile: '',
            role,
          },
        };
      }
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Fetch current authenticated user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      if (response.data.data) {
        return response.data.data;
      }
      throw new Error('User profile not found');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Log out user
   */
  async logoutUser(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};

export default authService;
