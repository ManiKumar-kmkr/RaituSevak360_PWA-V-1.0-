"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Building2,
  ShieldCheck,
  Download,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useSellerStore } from "@/store/seller-store";
import { BackButton } from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

export default function SellerPaymentsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const onboardingData = useSellerStore((state) => state.onboardingData);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const transactions = [
    {
      id: "TXN-9021",
      orderId: "ORD-9481",
      customer: "Sri Venkateswara Farms",
      date: "Today, 11:30 AM",
      amount: "₹5,000",
      status: "Processing",
      type: "Sale",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      id: "TXN-8994",
      orderId: "ORD-9478",
      customer: "K. Narayana Rao",
      date: "03 Oct 2026",
      amount: "₹2,400",
      status: "Settled",
      type: "Payout",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      id: "TXN-8941",
      orderId: "BK-7701",
      customer: "Wardhannapet Rental",
      date: "02 Oct 2026",
      amount: "₹3,100",
      status: "Settled",
      type: "Equipment Rental",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      id: "TXN-8812",
      orderId: "ORD-9411",
      customer: "Bala Krishna Agro",
      date: "28 Sep 2026",
      amount: "₹8,650",
      status: "Settled",
      type: "Sale",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
  ];

  const handleDownloadSlip = (txnId: string) => {
    setDownloadMsg(`Payment receipt for ${txnId} downloaded.`);
    setTimeout(() => setDownloadMsg(null), 3500);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-16">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#174D25]">Payments & Revenue</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Earnings, settlements & transaction history</p>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-[#24833A]">
          <ShieldCheck size={12} /> Auto-Settlement Active
        </span>
      </div>

      {downloadMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-[#174D25] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 size={16} className="text-[#24833A]" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Main Revenue Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#174D25] via-[#24833A] to-[#2E9B45] p-5 text-white shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/80">Total Business Earnings</span>
          <div className="flex items-center gap-1 text-xs text-emerald-200 font-bold bg-white/10 px-2 py-0.5 rounded-full">
            <TrendingUp size={14} /> +18.4% this month
          </div>
        </div>

        <div>
          <span className="text-3xl font-black tracking-tight text-white">₹1,48,500</span>
          <p className="text-xs text-white/80 mt-1">Cumulative sales from marketplace & rentals</p>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/15 pt-3">
          <div>
            <span className="text-[11px] text-white/70">Monthly Revenue</span>
            <p className="text-sm font-bold text-white">₹62,400</p>
          </div>
          <div>
            <span className="text-[11px] text-white/70">Pending Settlement</span>
            <p className="text-sm font-bold text-amber-200">₹14,200</p>
          </div>
        </div>
      </div>

      {/* Linked Bank Account Card */}
      <div className="rounded-3xl border border-[#24833A]/20 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Settlement Bank Account</h2>
              <p className="text-[11px] text-gray-500 font-medium">Daily automated direct credit</p>
            </div>
          </div>
          <Link
            href="/dashboard/seller/onboarding"
            className="text-xs font-bold text-[#24833A] hover:underline"
          >
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F4FBF5] p-3 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-medium">Account Number</span>
            <p className="font-mono font-bold text-gray-800">
              •••• •••• {onboardingData.bankDetails.accountNumber.slice(-4) || "5678"}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-medium">IFSC Code</span>
            <p className="font-mono font-bold text-gray-800">
              {onboardingData.bankDetails.ifscCode || "HDFC0000421"}
            </p>
          </div>
          <div className="col-span-2 border-t border-[#24833A]/10 pt-1.5 mt-0.5 flex justify-between items-center">
            <span className="text-[11px] text-gray-500">UPI VPA:</span>
            <span className="text-[11px] font-mono font-bold text-[#24833A]">
              {onboardingData.bankDetails.upiId || "lakshmiagro@okhdfcbank"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Recent Transactions
          </h2>
          <span className="text-[11px] font-semibold text-[#24833A]">Last 30 Days</span>
        </div>

        <div className="space-y-2.5">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <ArrowUpRight size={18} className="text-[#24833A]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">{txn.customer}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${txn.badgeColor}`}
                    >
                      {txn.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {txn.type} • {txn.id} • {txn.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-right">
                <div>
                  <span className="text-xs font-bold text-gray-900">{txn.amount}</span>
                  <p className="text-[10px] text-gray-400 font-mono">{txn.orderId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSlip(txn.id)}
                  title="Download receipt"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
