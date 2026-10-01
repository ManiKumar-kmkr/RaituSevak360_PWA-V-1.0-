import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "RaituSevak360",
  description: "AI-powered smart agriculture platform",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
