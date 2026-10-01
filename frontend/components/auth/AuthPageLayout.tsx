"use client";

import React, { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
}

export default function AuthPageLayout({
  children,
  className = "",
  backgroundColor = "bg-[#F4F8EE]",
}: AuthPageLayoutProps) {
  return (
    <main
      className={`min-h-screen ${backgroundColor} px-4 py-6 sm:px-6 transition-colors duration-200 flex flex-col justify-between`}
    >
      <div
        className={`mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-between ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
