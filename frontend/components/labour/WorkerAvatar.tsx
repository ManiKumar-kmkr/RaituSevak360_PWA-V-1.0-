"use client";

import React from "react";
import { CheckCircle2, Users } from "lucide-react";

interface WorkerAvatarProps {
  name: string;
  avatarText?: string;
  crewSize?: number;
  verified?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function WorkerAvatar({
  name,
  avatarText,
  crewSize,
  verified = true,
  size = "md",
}: WorkerAvatarProps) {
  const initials =
    avatarText ||
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
  };

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#E4F0DD] to-[#cbe4bf] font-extrabold text-[#174D25] shadow-xs ${sizeClasses[size]}`}
      >
        <span>{initials}</span>
      </div>

      {verified && (
        <span
          className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#24833A] text-white shadow-xs ring-2 ring-white"
          title="Verified Agricultural Worker"
        >
          <CheckCircle2 size={11} strokeWidth={3} />
        </span>
      )}

      {crewSize && crewSize > 1 && (
        <span
          className="absolute -top-1 -right-1 flex items-center gap-0.5 rounded-full bg-[#174D25] px-1.5 py-0.2 text-[9px] font-bold text-white shadow-xs ring-1 ring-white"
          title={`Crew of ${crewSize} workers`}
        >
          <Users size={9} />
          <span>{crewSize}</span>
        </span>
      )}
    </div>
  );
}
