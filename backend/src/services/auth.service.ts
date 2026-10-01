import jwt from 'jsonwebtoken';
import config from '../config/environment';

export interface UserRecord {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  role?: string;
  language?: string;
  isVerified: boolean;
  createdAt: string;
}

interface OtpRecord {
  code: string;
  expiresAt: number;
  purpose?: string;
}

// ============================================================
// DEVELOPMENT IN-MEMORY STORAGE
// ============================================================

const usersStore = new Map<string, UserRecord>();
const otpStore = new Map<string, OtpRecord>();

// ============================================================
// 5 DEVELOPMENT DEMO USERS
// ============================================================
//
// These 5 accounts are automatically available in development:
//
// 1. Demo Farmer     | Mobile: 9999999999 | Password: Demo@123 | OTP: 111111 | Role: farmer
// 2. Demo Seller     | Mobile: 8888888888 | Password: Demo@123 | OTP: 222222 | Role: seller
// 3. Demo Expert     | Mobile: 7777777777 | Password: Demo@123 | OTP: 333333 | Role: expert
// 4. Demo Student    | Mobile: 6666666666 | Password: Demo@123 | OTP: 444444 | Role: student
// 5. Demo Government | Mobile: 5555555555 | Password: Demo@123 | OTP: 555555 | Role: government
//
// ============================================================

export interface DemoUserConfig extends UserRecord {
  otp: string;
}

const DEMO_USERS: DemoUserConfig[] = [
  {
    id: 'usr_demo_farmer',
    name: 'Demo Farmer',
    mobile: '9999999999',
    email: 'farmer@raitusevak360.local',
    password: 'Demo@123',
    role: 'farmer',
    language: 'te',
    isVerified: true,
    otp: '111111',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_seller',
    name: 'Demo Seller',
    mobile: '8888888888',
    email: 'seller@raitusevak360.local',
    password: 'Demo@123',
    role: 'seller',
    language: 'en',
    isVerified: true,
    otp: '222222',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_expert',
    name: 'Demo Expert',
    mobile: '7777777777',
    email: 'expert@raitusevak360.local',
    password: 'Demo@123',
    role: 'expert',
    language: 'hi',
    isVerified: true,
    otp: '333333',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_student',
    name: 'Demo Student',
    mobile: '6666666666',
    email: 'student@raitusevak360.local',
    password: 'Demo@123',
    role: 'student',
    language: 'en',
    isVerified: true,
    otp: '444444',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_government',
    name: 'Demo Government',
    mobile: '5555555555',
    email: 'govt@raitusevak360.local',
    password: 'Demo@123',
    role: 'government',
    language: 'te',
    isVerified: true,
    otp: '555555',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_new_user',
    name: 'Demo New User',
    mobile: '4444444444',
    email: 'newuser@raitusevak360.local',
    password: 'Demo@123',
    role: undefined,
    language: 'en',
    isVerified: true,
    otp: '123456',
    createdAt: new Date().toISOString(),
  },
];

const isDemoAuthEnabled =
  process.env.DEMO_AUTH_ENABLED !== 'false' && process.env.NODE_ENV !== 'production';

// Seed the 5 demo users if development mode / demo auth is enabled
if (isDemoAuthEnabled) {
  for (const demoUser of DEMO_USERS) {
    usersStore.set(demoUser.mobile, { ...demoUser });
  }
}

// ============================================================
// ALLOWED ROLES
// ============================================================

const ALLOWED_ROLES = [
  'farmer',
  'seller',
  'expert',
  'student',
  'government',
  'govt',
];

// Normalize 'govt' -> 'government' for database consistency
function normalizeRole(role: string): string {
  return role === 'govt' ? 'government' : role;
}

// ============================================================
// JWT HELPER
// ============================================================

function generateToken(user: UserRecord): string {
  return jwt.sign(
    {
      id: user.id,
      mobile: user.mobile,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: '7d',
    }
  );
}

// ============================================================
// AUTH SERVICE
// ============================================================

export const authService = {
  // ==========================================================
  // REGISTER
  // ==========================================================

  async register(data: {
    name: string;
    mobile: string;
    email?: string;
    password?: string;
    role?: string;
  }): Promise<{
    user: UserRecord;
    token: string;
    requiresOtp: boolean;
  }> {
    const name = data.name?.trim();
    const mobile = data.mobile?.trim();
    const email = data.email?.trim() || undefined;
    const password = data.password;

    // Validation
    if (!name) {
      throw new Error('Full name is required.');
    }

    if (!mobile) {
      throw new Error('Mobile number is required.');
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      throw new Error('Enter a valid 10-digit mobile number.');
    }

    if (!password) {
      throw new Error('Password is required.');
    }

    if (password.length < 6) {
      throw new Error('Password must contain at least 6 characters.');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address.');
    }

    // Role validation (optional on registration, selected on first-time role selection)
    let role: string | undefined = undefined;
    if (data.role) {
      if (!ALLOWED_ROLES.includes(data.role)) {
        throw new Error('Invalid user role.');
      }
      role = normalizeRole(data.role);
    }

    // Check existing verified user
    const existing = usersStore.get(mobile);
    if (existing && existing.isVerified) {
      throw new Error(
        'A user with this mobile number is already registered. Please login.'
      );
    }

    // Create user
    const userId = `usr_${Date.now()}`;
    const newUser: UserRecord = {
      id: userId,
      name,
      mobile,
      email,
      password,
      role,
      language: 'en',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    usersStore.set(mobile, newUser);

    // Generate 6-digit registration OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(mobile, {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: 'register',
    });

    console.log(
      `[AUTH SERVICE] Registration OTP generated for ${mobile}: ${otpCode}`
    );

    const token = generateToken(newUser);

    return {
      user: newUser,
      token,
      requiresOtp: true,
    };
  },

  // ==========================================================
  // LOGIN
  // ==========================================================

  async login(
    mobile: string,
    password?: string
  ): Promise<{
    user: UserRecord;
    token: string;
  }> {
    const cleanMobile = mobile?.trim();

    if (!cleanMobile) {
      throw new Error('Mobile number is required.');
    }

    if (!/^[0-9]{10}$/.test(cleanMobile)) {
      throw new Error('Enter a valid 10-digit mobile number.');
    }

    if (!password) {
      throw new Error('Password is required.');
    }

    const user = usersStore.get(cleanMobile);

    if (!user) {
      throw new Error('Account not found. Please register first.');
    }

    if (!user.password || user.password !== password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    if (!user.isVerified) {
      throw new Error('Your account is not verified. Please verify OTP first.');
    }

    const token = generateToken(user);

    console.log(`[AUTH SERVICE] Login successful: ${cleanMobile} (${user.role})`);

    return {
      user,
      token,
    };
  },

  // ==========================================================
  // SEND OTP
  // ==========================================================

  async sendOtp(
    mobile: string,
    purpose: string = 'login'
  ): Promise<{
    otpSent: boolean;
    message: string;
  }> {
    const cleanMobile = mobile?.trim();

    if (!cleanMobile) {
      throw new Error('Mobile number is required.');
    }

    if (!/^[0-9]{10}$/.test(cleanMobile)) {
      throw new Error('Enter a valid 10-digit mobile number.');
    }

    // Check if this is one of our 5 development demo users
    const demoUser = DEMO_USERS.find((u) => u.mobile === cleanMobile);
    const code = demoUser && isDemoAuthEnabled
      ? demoUser.otp
      : Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(cleanMobile, {
      code,
      expiresAt,
      purpose,
    });

    console.log(
      `[AUTH SERVICE] OTP for ${cleanMobile} [Purpose: ${purpose}]: ${code}`
    );

    return {
      otpSent: true,
      message: `OTP sent successfully to +91 ${cleanMobile}`,
    };
  },

  // ==========================================================
  // VERIFY OTP
  // ==========================================================

  async verifyOtp(
    mobile: string,
    otp: string,
    _purpose?: string
  ): Promise<{
    user: UserRecord;
    token: string;
  }> {
    const cleanMobile = mobile?.trim();
    const cleanOtp = otp?.trim();

    if (!cleanMobile) {
      throw new Error('Mobile number is required.');
    }

    if (!cleanOtp) {
      throw new Error('OTP is required.');
    }

    if (!/^[0-9]{6}$/.test(cleanOtp)) {
      throw new Error('OTP must contain 6 digits.');
    }

    // 1. Check fixed demo user OTP (Farmer 111111, Seller 222222, Expert 333333, Student 444444, Govt 555555)
    let isMatch = false;
    if (isDemoAuthEnabled) {
      const demoUser = DEMO_USERS.find((u) => u.mobile === cleanMobile);
      if (demoUser && cleanOtp === demoUser.otp) {
        isMatch = true;
      }
      // Also allow Figma preview OTP 538123 during dev
      if (cleanOtp === '538123') {
        isMatch = true;
      }
    }

    // 2. Check generated OTP in otpStore
    const record = otpStore.get(cleanMobile);
    if (!isMatch && record && record.code === cleanOtp) {
      if (Date.now() > record.expiresAt) {
        otpStore.delete(cleanMobile);
        throw new Error('OTP has expired. Please request a new code.');
      }
      isMatch = true;
    }

    if (!isMatch) {
      throw new Error('Invalid OTP. Please check the code and try again.');
    }

    // Clear OTP after successful use
    otpStore.delete(cleanMobile);

    // Retrieve or initialize user
    let user = usersStore.get(cleanMobile);

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: `User ${cleanMobile.slice(-4)}`,
        mobile: cleanMobile,
        role: undefined,
        language: 'en',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      usersStore.set(cleanMobile, user);
    } else {
      user.isVerified = true;
    }

    const token = generateToken(user);

    return {
      user,
      token,
    };
  },

  // ==========================================================
  // RESEND OTP
  // ==========================================================

  async resendOtp(
    mobile: string
  ): Promise<{
    otpSent: boolean;
    message: string;
  }> {
    return this.sendOtp(mobile, 'resend');
  },

  // ==========================================================
  // UPDATE ROLE
  // ==========================================================

  async updateRole(
    userIdOrMobile: string,
    rawRole: string
  ): Promise<{ user: UserRecord; token: string }> {
    if (!ALLOWED_ROLES.includes(rawRole)) {
      throw new Error(
        'Invalid role. Allowed roles are farmer, seller, expert, student, government.'
      );
    }

    const role = normalizeRole(rawRole);

    let user = await this.findById(userIdOrMobile);
    if (!user) {
      user = await this.findByMobile(userIdOrMobile);
    }

    if (!user) {
      throw new Error('User not found. Please log in again.');
    }

    if (user.role) {
      throw new Error('Role has already been set for this account. Use role switch if eligible.');
    }

    user.role = role;
    usersStore.set(user.mobile, user);

    console.log(`[AUTH SERVICE] Role updated for ${user.mobile}: ${role}`);

    const token = generateToken(user);
    return { user, token };
  },

  // ==========================================================
  // SWITCH ROLE (FARMER <-> SELLER ONLY)
  // ==========================================================

  async switchRole(
    userIdOrMobile: string,
    rawTargetRole: string
  ): Promise<{ user: UserRecord; token: string }> {
    if (!rawTargetRole) {
      throw new Error('Target role is required.');
    }

    const targetRole = normalizeRole(rawTargetRole);
    if (!ALLOWED_ROLES.includes(targetRole)) {
      throw new Error('Invalid target role.');
    }

    let user = await this.findById(userIdOrMobile);
    if (!user) {
      user = await this.findByMobile(userIdOrMobile);
    }

    if (!user) {
      throw new Error('User not found. Please log in again.');
    }

    const currentRole = user.role;
    if (!currentRole) {
      throw new Error('Initial role has not been set yet. Please select your role first.');
    }

    const isAllowedSwitch =
      (currentRole === 'farmer' && targetRole === 'seller') ||
      (currentRole === 'seller' && targetRole === 'farmer');

    if (!isAllowedSwitch) {
      throw new Error(
        'Role switching is only available between Farmer and Seller/Vendor.'
      );
    }

    user.role = targetRole;
    usersStore.set(user.mobile, user);

    console.log(
      `[AUTH SERVICE] Role switched successfully for ${user.mobile}: ${currentRole} -> ${targetRole}`
    );

    const token = generateToken(user);
    return { user, token };
  },

  // ==========================================================
  // FIND USER BY MOBILE
  // ==========================================================

  async findByMobile(mobile: string): Promise<UserRecord | null> {
    const cleanMobile = mobile?.trim();
    if (!cleanMobile) return null;
    return usersStore.get(cleanMobile) || null;
  },

  // ==========================================================
  // FIND USER BY ID
  // ==========================================================

  async findById(id: string): Promise<UserRecord | null> {
    if (!id) return null;
    for (const user of usersStore.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  },
};

export default authService;