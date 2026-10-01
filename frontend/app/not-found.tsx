import React from "react";
import Link from "next/link";
import { Sprout, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F8EE] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#24833A]/20 bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
          <Sprout size={32} strokeWidth={2.4} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#24833A]">
          404 • Page Not Found
        </p>
        <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#174D25]">
          Looking for Agricultural Services?
        </h1>
        <p className="mt-2 text-xs font-medium text-gray-500 leading-relaxed">
          The requested page is unavailable or under active development. You can return safely to your central farming hub.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#24833A] px-5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </main>
  );
}
