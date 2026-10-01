"use client";

import React, { useState } from "react";
import { Store, Search, Filter, ShoppingBag, Plus, Tag } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";

export default function MarketplacePage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);

  const [activeTab, setActiveTab] = useState<"all" | "seeds" | "fertilizer" | "machinery">("all");

  const sampleItems = [
    {
      id: "prod_1",
      title: "BPH Resistant Paddy Seeds (BPT 5204)",
      seller: "Sri Krishna Agri Inputs",
      price: "₹1,250 / 25kg bag",
      badge: "Certified",
      category: "seeds",
    },
    {
      id: "prod_2",
      title: "Organic Vermicompost Soil Conditioner",
      seller: "Green Earth Farm Solutions",
      price: "₹450 / 50kg bag",
      badge: "Organic",
      category: "fertilizer",
    },
    {
      id: "prod_3",
      title: "Mahindra 575 DI Tractor (Day Rental)",
      seller: "Ramesh Equipment Hub",
      price: "₹1,800 / day",
      badge: "Verified",
      category: "machinery",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Store size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.marketplace")}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Direct Trade
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Buy and sell certified seeds, fertilizers, machinery & produce
            </p>
          </div>
        </div>

        {activeRole === "seller" && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
          >
            <Plus size={16} />
            <span>Add Product Listing</span>
          </button>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search seeds, fertilizers, tractors..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-hidden shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "seeds", "fertilizer", "machinery"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize whitespace-nowrap transition active:scale-95 ${
                activeTab === tab
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {sampleItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[#24833A]">
                  {item.badge}
                </span>
                <span className="text-gray-400 uppercase">{item.category}</span>
              </div>
              <h2 className="mt-2 text-xs font-bold text-gray-900 leading-snug">
                {item.title}
              </h2>
              <p className="mt-1 text-[11px] text-gray-500">{item.seller}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#174D25]">
                {item.price}
              </span>
              <button
                type="button"
                className="rounded-lg bg-[#E4F0DD] px-2.5 py-1 text-[11px] font-bold text-[#174D25] hover:bg-[#d6e9cd] transition"
              >
                Inquire
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
