import React from 'react';
import {
  Home,
  UsersRound,
  Store,
  Bell,
  UserRound,
  Package,
  Bot,
  GraduationCap,
  BookOpen,
  FileText,
  Landmark,
  FileSpreadsheet,
  CreditCard,
  LucideIcon,
} from 'lucide-react';
import { UserRole } from '../types/index';

export interface NavItem {
  id: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
}

/**
 * Centralized Role-Based Navigation Configuration
 * 
 * Specifications:
 * 1. FARMER: Home, Labour, Marketplace, Notifications, Profile (FROZEN)
 * 2. SELLER: Home, Orders, Products, Payments, Profile (Figma direction)
 * 3. EXPERT: Home, Advisory, Consultations, Notifications, Profile
 * 4. STUDENT: Home, Learning, Resources, Notifications, Profile
 * 5. GOVERNMENT: Home, Schemes, Reports, Notifications, Profile
 */

export const navigationConfig: Record<string, NavItem[]> = {
  farmer: [
    { id: 'home', labelKey: 'nav.home', href: '/dashboard', icon: Home, exact: true },
    { id: 'labour', labelKey: 'nav.labour', href: '/dashboard/labour', icon: UsersRound },
    { id: 'marketplace', labelKey: 'nav.marketplace', href: '/dashboard/marketplace', icon: Store },
    { id: 'notifications', labelKey: 'nav.notifications', href: '/dashboard/notifications', icon: Bell },
    { id: 'profile', labelKey: 'nav.profile', href: '/dashboard/profile', icon: UserRound },
  ],
  seller: [
    { id: 'home', labelKey: 'nav.home', href: '/dashboard', icon: Home, exact: true },
    { id: 'orders', labelKey: 'nav.orders', href: '/dashboard/orders', icon: Package },
    { id: 'products', labelKey: 'nav.products', href: '/dashboard/seller/products', icon: Store },
    { id: 'payments', labelKey: 'nav.payments', href: '/dashboard/seller/payments', icon: CreditCard },
    { id: 'profile', labelKey: 'nav.profile', href: '/dashboard/profile', icon: UserRound },
  ],
  expert: [
    { id: 'home', labelKey: 'nav.home', href: '/dashboard', icon: Home, exact: true },
    { id: 'advisory', labelKey: 'nav.advisory', href: '/dashboard/ai-advisor', icon: Bot },
    { id: 'consultations', labelKey: 'nav.consultations', href: '/dashboard/consultations', icon: GraduationCap },
    { id: 'notifications', labelKey: 'nav.notifications', href: '/dashboard/notifications', icon: Bell },
    { id: 'profile', labelKey: 'nav.profile', href: '/dashboard/profile', icon: UserRound },
  ],
  student: [
    { id: 'home', labelKey: 'nav.home', href: '/dashboard', icon: Home, exact: true },
    { id: 'learning', labelKey: 'nav.learning', href: '/dashboard/learning', icon: BookOpen },
    { id: 'resources', labelKey: 'nav.resources', href: '/dashboard/resources', icon: FileText },
    { id: 'notifications', labelKey: 'nav.notifications', href: '/dashboard/notifications', icon: Bell },
    { id: 'profile', labelKey: 'nav.profile', href: '/dashboard/profile', icon: UserRound },
  ],
  government: [
    { id: 'home', labelKey: 'nav.home', href: '/dashboard', icon: Home, exact: true },
    { id: 'schemes', labelKey: 'nav.schemes', href: '/dashboard/schemes', icon: Landmark },
    { id: 'reports', labelKey: 'nav.reports', href: '/dashboard/reports', icon: FileSpreadsheet },
    { id: 'notifications', labelKey: 'nav.notifications', href: '/dashboard/notifications', icon: Bell },
    { id: 'profile', labelKey: 'nav.profile', href: '/dashboard/profile', icon: UserRound },
  ],
  govt: [
    { id: 'home', labelKey: 'nav.home', href: '/dashboard', icon: Home, exact: true },
    { id: 'schemes', labelKey: 'nav.schemes', href: '/dashboard/schemes', icon: Landmark },
    { id: 'reports', labelKey: 'nav.reports', href: '/dashboard/reports', icon: FileSpreadsheet },
    { id: 'notifications', labelKey: 'nav.notifications', href: '/dashboard/notifications', icon: Bell },
    { id: 'profile', labelKey: 'nav.profile', href: '/dashboard/profile', icon: UserRound },
  ],
};

/**
 * Helper to get role navigation items with fallback to farmer
 */
export function getNavigationForRole(role?: UserRole | string | null): NavItem[] {
  if (!role) return navigationConfig.farmer;
  const normalized = role.toLowerCase();
  return navigationConfig[normalized] || navigationConfig.farmer;
}
