import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; phoneNumber: string; role: string } | null;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
