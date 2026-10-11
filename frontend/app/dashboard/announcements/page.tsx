"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import GovtAnnouncementsHub from "@/components/government/GovtAnnouncementsHub";

export default function AnnouncementsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const activeRole = (user?.role || selectedRole || "farmer").toLowerCase();

  // Role Isolation: ONLY Government / NGO Representative can access
  useEffect(() => {
    if (activeRole !== "government" && activeRole !== "govt") {
      router.replace("/dashboard");
    }
  }, [activeRole, router]);

  if (activeRole !== "government" && activeRole !== "govt") {
    return null;
  }

  return <GovtAnnouncementsHub />;
}
