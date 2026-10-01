import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedLanguage: string;
  selectedRole?: UserRole;
  pendingMobile: string;
  pendingPurpose: 'login' | 'register' | 'verify';

  // Actions
  setLanguage: (code: string) => void;
  setRole: (role: UserRole) => void;
  setPendingMobile: (mobile: string, purpose?: 'login' | 'register' | 'verify') => void;
  setAuth: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedLanguage: 'en',
      selectedRole: undefined,
      pendingMobile: '',
      pendingPurpose: 'login',

      setLanguage: (code: string) => set({ selectedLanguage: code }),
      setRole: (role: UserRole) => set((state) => ({
        selectedRole: role,
        user: state.user ? { ...state.user, role } : null,
      })),
      setPendingMobile: (mobile: string, purpose: 'login' | 'register' | 'verify' = 'login') =>
        set({ pendingMobile: mobile, pendingPurpose: purpose }),
      setAuth: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          selectedRole: user.role,
        }),
      updateUser: (partial: Partial<User>) =>
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...partial } : null;
          return {
            user: updatedUser,
            selectedRole: updatedUser?.role ?? state.selectedRole,
          };
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          pendingMobile: '',
          selectedRole: undefined,
        }),
    }),
    {
      name: 'raitusevak-auth-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        selectedLanguage: state.selectedLanguage,
        selectedRole: state.selectedRole,
        pendingMobile: state.pendingMobile,
      }),
    }
  )
);
