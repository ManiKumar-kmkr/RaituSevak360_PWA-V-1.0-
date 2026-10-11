"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import MobileBottomNav from "./MobileBottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setHasHydrated(true);
      });
      return () => {
        unsub();
      };
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    // Route Protection: Unauthenticated user -> redirect to /login
    if (!token && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Unassigned role -> redirect to /role-selection
    if (!user?.role && !selectedRole) {
      router.replace("/role-selection");
      return;
    }
  }, [hasHydrated, token, isAuthenticated, user, selectedRole, router]);

  // Loading indicator with explicit visible brand elements
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F8EE] p-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Sprout size={32} strokeWidth={2.4} />
          </div>
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
          <span className="text-xs font-bold text-[#174D25] tracking-wide">
            RaituSevak360
          </span>
        </div>
      </div>
    );
  }

  // If redirecting unauthenticated or unassigned user
  if (!token && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F8EE] p-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Sprout size={32} strokeWidth={2.4} />
          </div>
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
          <span className="text-xs font-semibold text-[#174D25]">
            Redirecting to Login...
          </span>
        </div>
      </div>
    );
  }

  if (!user?.role && !selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F8EE] p-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Sprout size={32} strokeWidth={2.4} />
          </div>
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
          <span className="text-xs font-semibold text-[#174D25]">
            Redirecting to Role Selection...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8EE] flex flex-col text-slate-900 antialiased overflow-x-hidden">
      {/* Top Application Header */}
      <AppHeader />

      {/* Main Workspace: Desktop Sidebar + Content */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <AppSidebar />

        <main className="flex-1 w-full max-w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8 pb-28 md:pb-12 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation (Role-Specific) */}
      <MobileBottomNav />
    </div>
  );
}
