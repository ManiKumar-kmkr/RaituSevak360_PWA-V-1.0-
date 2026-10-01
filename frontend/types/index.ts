export type UserRole = 'farmer' | 'seller' | 'expert' | 'student' | 'govt' | 'government';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role?: UserRole;
  language?: string;
  createdAt?: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  englishLabel: string;
}

export interface RoleOption {
  id: UserRole;
  title: string;
  nativeTitle: string;
  description: string;
  destinationRoute: string;
}

export interface LoginRequest {
  mobile: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: UserRole;
  termsAccepted: boolean;
}

export interface OTPRequest {
  mobile: string;
  purpose?: 'login' | 'register' | 'verify';
}

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
  purpose?: 'login' | 'register' | 'verify';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  requiresOtp?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
