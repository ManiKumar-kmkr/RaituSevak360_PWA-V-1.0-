"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import GovtFarmerRegistryWorkspace from "@/components/government/GovtFarmerRegistryWorkspace";

export default function GovernmentFarmerRegistryPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const activeRole = (user?.role || selectedRole || "farmer").toLowerCase();

  // Role Isolation: ONLY Government / NGO Representative can access
  // Farmer, Seller, Expert, Student redirect to /dashboard
  useEffect(() => {
    if (activeRole !== "government" && activeRole !== "govt") {
      router.replace("/dashboard");
    }
  }, [activeRole, router]);

  if (activeRole !== "government" && activeRole !== "govt") {
    return null;
  }

  return <GovtFarmerRegistryWorkspace />;
}
