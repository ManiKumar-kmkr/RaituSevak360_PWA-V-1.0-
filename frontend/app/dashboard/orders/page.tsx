"use client";

import React from "react";
import { Package, Clock, CheckCircle2, Truck, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function OrdersPage() {
  const { t } = useTranslation();

  const orders = [
    {
      id: "ORD-9481",
      customer: "Sri Venkateswara Farms",
      items: "BPT 5204 Paddy Seeds (4 bags)",
      amount: "₹5,000",
      status: "Ready for Dispatch",
      date: "Today, 11:30 AM",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "ORD-9478",
      customer: "K. Narayana Rao",
      items: "Organic Neem Cake Fertilizer (100kg)",
      amount: "₹2,400",
      status: "Delivered",
      date: "Yesterday",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "ORD-9462",
      customer: "Bala Krishna Agro",
      items: "Sprayer Nozzle Kit (2 sets)",
      amount: "₹1,150",
      status: "In Transit",
      date: "28 Sep 2026",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Package size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.orders")} Management
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Seller Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Track customer orders, shipments and incoming revenue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Orders</span>
            <p className="text-sm font-extrabold text-[#174D25]">3 Active</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-[#24833A] border border-gray-100">
                <Truck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    {ord.id}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${ord.badgeColor}`}
                  >
                    {ord.status}
                  </span>
                </div>
                <h2 className="mt-1 text-xs font-medium text-gray-800">
                  {ord.customer}
                </h2>
                <p className="text-[11px] text-gray-500">{ord.items}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <span className="text-sm font-extrabold text-[#174D25]">
                {ord.amount}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {ord.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
