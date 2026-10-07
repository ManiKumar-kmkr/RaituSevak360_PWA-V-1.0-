"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Truck,
  Calendar,
  Building2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Info,
  Scale,
  X,
  ShieldCheck,
  Tag,
  FileText,
} from "lucide-react";
import { useSellerStore } from "@/store/seller-store";
import { useTranslation } from "@/hooks/useTranslation";
import { Quotation, QuotationStatus } from "@/types/seller";
import { BackButton } from "@/components/ui/BackButton";

export default function ReceivedQuotationsPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const quotations = useSellerStore((state) => state.quotations || []);
  const buyLeads = useSellerStore((state) => state.buyLeads || []);
  const acceptQuotation = useSellerStore((state) => state.acceptQuotation);
  const rejectQuotation = useSellerStore((state) => state.rejectQuotation);

  // Active filter tab: all | pending | accepted | history
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "accepted" | "history">("all");

  // Selected Quotation for detail modal
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  // Rejection Confirmation Modal State
  const [rejectConfirmQuote, setRejectConfirmQuote] = useState<Quotation | null>(null);

  // Multi-quote comparison view state (leadId)
  const [comparingLeadId, setComparingLeadId] = useState<string | null>(null);

  // Success Notification Banner
  const [acceptedSuccessQuote, setAcceptedSuccessQuote] = useState<Quotation | null>(null);

  // Filter quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter((quote) => {
      if (activeTab === "pending") {
        return quote.status === "submitted" || quote.status === "under_review";
      }
      if (activeTab === "accepted") {
        return quote.status === "accepted";
      }
      if (activeTab === "history") {
        return quote.status === "rejected" || quote.status === "not_selected" || quote.status === "declined";
      }
      return true;
    });
  }, [quotations, activeTab]);

  // Group quotations by leadId to detect multiple competing offers
  const quotationsByLead = useMemo(() => {
    const map = new Map<string, Quotation[]>();
    for (const q of quotations) {
      const list = map.get(q.leadId) || [];
      list.push(q);
      map.set(q.leadId, list);
    }
    return map;
  }, [quotations]);

  // Leads with multiple quotations
  const leadsWithMultipleQuotes = useMemo(() => {
    const result: { leadId: string; quotes: Quotation[] }[] = [];
    quotationsByLead.forEach((quotes, leadId) => {
      if (quotes.length > 1) {
        result.push({ leadId, quotes });
      }
    });
    return result;
  }, [quotationsByLead]);

  // Keep selectedQuotation updated if state changes
  const activeSelectedQuote = useMemo(() => {
    if (!selectedQuotation) return null;
    return quotations.find((q) => q.id === selectedQuotation.id) || selectedQuotation;
  }, [quotations, selectedQuotation]);

  // Handle Accept
  const handleAccept = (quote: Quotation) => {
    acceptQuotation(quote.id);
    setAcceptedSuccessQuote(quote);
    if (activeSelectedQuote && activeSelectedQuote.id === quote.id) {
      setSelectedQuotation({ ...quote, status: "accepted" });
    }
    // Dismiss banner after 6 seconds
    setTimeout(() => {
      setAcceptedSuccessQuote(null);
    }, 6000);
  };

  // Handle Reject Confirmation
  const handleConfirmReject = () => {
    if (!rejectConfirmQuote) return;
    rejectQuotation(rejectConfirmQuote.id);
    if (activeSelectedQuote && activeSelectedQuote.id === rejectConfirmQuote.id) {
      setSelectedQuotation({ ...rejectConfirmQuote, status: "rejected" });
    }
    setRejectConfirmQuote(null);
  };

  // Get status badge styling and text
  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case "accepted":
        return {
          label: t("seller.quotations.statusAccepted") || "Accepted",
          className: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: <CheckCircle2 size={13} className="text-emerald-600" />,
        };
      case "rejected":
        return {
          label: t("seller.quotations.statusRejected") || "Rejected",
          className: "bg-rose-50 text-rose-800 border-rose-200",
          icon: <XCircle size={13} className="text-rose-600" />,
        };
      case "not_selected":
        return {
          label: t("seller.quotations.statusNotSelected") || "Not Selected",
          className: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <Clock size={13} className="text-gray-500" />,
        };
      case "submitted":
      case "under_review":
      default:
        return {
          label: t("seller.quotations.statusPending") || "Pending Review",
          className: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <Clock size={13} className="text-amber-600" />,
        };
    }
  };

  // Find related buy lead
  const getRelatedLead = (leadId: string) => {
    return buyLeads.find((l) => l.id === leadId);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("seller.quotations.back") || t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Page Title */}
      <div className="rounded-3xl bg-gradient-to-r from-[#174D25] to-[#24833A] p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-100 backdrop-blur-xs">
              <Sparkles size={13} /> Farmer Harvest Mandi
            </span>
            <h1 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">
              {t("seller.quotations.title") || "Received Quotations"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t("seller.quotations.subtitle") ||
                "Review and accept competitive bids from verified agricultural buyers"}
            </p>
          </div>
        </div>

        {/* Quick stats ribbon */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-center text-white">
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">Total Bids</span>
            <p className="text-base font-black">{quotations.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-amber-200">Pending Review</span>
            <p className="text-base font-black">
              {quotations.filter((q) => q.status === "submitted" || q.status === "under_review").length}
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">Accepted Deals</span>
            <p className="text-base font-black">
              {quotations.filter((q) => q.status === "accepted").length}
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {acceptedSuccessQuote && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                {t("seller.quotations.acceptedSuccessTitle") || "Quotation Accepted!"}
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                {t("seller.quotations.acceptedSuccessDesc") ||
                  `You have accepted the offer from ${acceptedSuccessQuote.sellerName || "the buyer"} for ${acceptedSuccessQuote.crop} at ₹${acceptedSuccessQuote.offeredPrice.toLocaleString("en-IN")}/${acceptedSuccessQuote.unit.slice(0, -1)}. Other competing offers for this demand have been closed.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAcceptedSuccessQuote(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Competing Offers Notice Banner (if any demand has multiple quotes) */}
      {leadsWithMultipleQuotes.length > 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Scale size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-950">
                {t("seller.quotations.compareNotice") || "Comparing Buyer Offers"}
              </h4>
              <p className="text-[11px] text-blue-800 leading-tight">
                {t("seller.quotations.competingOffers") ||
                  "Multiple offers received for your crop demand. Compare unit prices and terms before accepting."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setComparingLeadId(leadsWithMultipleQuotes[0].leadId)}
            className="shrink-0 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-95 transition cursor-pointer shadow-xs"
          >
            Compare Now
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.quotations.filterAll") || "All Quotations"} ({quotations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.quotations.filterPending") || "Pending Review"} (
          {quotations.filter((q) => q.status === "submitted" || q.status === "under_review").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("accepted")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeTab === "accepted"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.quotations.filterAccepted") || "Accepted"} (
          {quotations.filter((q) => q.status === "accepted").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeTab === "history"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.quotations.filterHistory") || "History / Inactive"} (
          {
            quotations.filter(
              (q) => q.status === "rejected" || q.status === "not_selected" || q.status === "declined"
            ).length
          }
          )
        </button>
      </div>

      {/* Quotations List */}
      <div className="flex flex-col gap-3">
        {filteredQuotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#24833A] mb-2">
              <FileText size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              {t("seller.quotations.noQuotationsTitle") || "No Quotations in this Category"}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
              {t("seller.quotations.noQuotationsDesc") ||
                "When verified buyers and mandi traders bid on your crop leads, their offers will appear here for comparison and acceptance."}
            </p>
            {activeTab !== "all" && (
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="mt-4 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition"
              >
                View All Quotations
              </button>
            )}
          </div>
        ) : (
          filteredQuotations.map((quote) => {
            const badge = getStatusBadge(quote.status);
            const isPending = quote.status === "submitted" || quote.status === "under_review";
            const competingQuotes = quotationsByLead.get(quote.leadId) || [];
            const hasMultipleQuotes = competingQuotes.length > 1;

            return (
              <div
                key={quote.id}
                className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs"
              >
                {/* Header: Quotation ID, Seller name & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-gray-500">
                        {quote.id}
                      </span>
                      {hasMultipleQuotes && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                          {competingQuotes.length} Offers for this Crop
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                      <Building2 size={16} className="text-[#24833A] shrink-0" />
                      <span>{quote.sellerName || "Sri Balaji Agro Agencies"}</span>
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                      <span className="inline-flex items-center gap-1 text-[#174D25] font-bold">
                        <Tag size={12} className="text-[#24833A]" />
                        {quote.crop}
                      </span>
                      {quote.sellerLocation && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" />
                          {quote.sellerLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                {/* Pricing & Commercial Offer Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-[#F4FBF5] p-3 text-xs">
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {t("seller.quotations.quantity") || "Quantity"}
                    </span>
                    <p className="font-bold text-[#174D25]">
                      {quote.quantity} {quote.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {t("seller.quotations.offeredPrice") || "Offered Price"}
                    </span>
                    <p className="font-black text-[#24833A] text-sm">
                      ₹{quote.offeredPrice.toLocaleString("en-IN")} / {quote.unit.slice(0, -1) || "unit"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {t("seller.quotations.totalValue") || "Estimated Total"}
                    </span>
                    <p className="font-black text-gray-900 text-sm">
                      ₹{quote.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {t("seller.quotations.deliveryMode") || "Delivery Mode"}
                    </span>
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      <Truck size={12} className="text-[#24833A]" />
                      {quote.deliveryOption}
                    </p>
                  </div>
                </div>

                {/* Offer terms & notes */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      Validity: <strong className="text-gray-700">{quote.validity}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      Pickup: <strong className="text-gray-700">{quote.availableFrom}</strong>
                    </span>
                  </div>

                  {hasMultipleQuotes && isPending && (
                    <button
                      type="button"
                      onClick={() => setComparingLeadId(quote.leadId)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Scale size={12} /> Compare {competingQuotes.length} Offers
                    </button>
                  )}
                </div>

                {/* Seller Notes preview if present */}
                {quote.notes && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 text-xs text-gray-600 italic">
                    &ldquo;{quote.notes}&rdquo;
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedQuotation(quote)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
                  >
                    <span>{t("seller.quotations.viewDetails") || "View Details & Terms"}</span>
                    <ChevronRight size={14} />
                  </button>

                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectConfirmQuote(quote)}
                          className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-300 active:scale-95 transition cursor-pointer"
                        >
                          {t("seller.quotations.rejectButton") || "Reject"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccept(quote)}
                          className="rounded-xl bg-[#24833A] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} />
                          {t("seller.quotations.acceptButton") || "Accept Quotation"}
                        </button>
                      </>
                    ) : quote.status === "accepted" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={14} /> Accepted Offer
                      </span>
                    ) : quote.status === "not_selected" ? (
                      <span className="text-xs text-gray-500 font-medium italic">
                        Closed (Other offer accepted)
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 font-semibold">
                        Quotation Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= QUOTATION DETAIL MODAL ================= */}
      {activeSelectedQuote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedQuotation(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition z-10 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div className="mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                {activeSelectedQuote.id}
              </span>
              <h2 className="text-xl font-black text-[#174D25]">
                Quotation Details
              </h2>
              <p className="text-xs text-gray-500">
                Submitted by {activeSelectedQuote.sellerName || "Verified Buyer"} for {activeSelectedQuote.crop}
              </p>
            </div>

            {/* Status indicator */}
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-gray-50 p-3">
              <span className="text-xs font-semibold text-gray-600">Current Status</span>
              {(() => {
                const b = getStatusBadge(activeSelectedQuote.status);
                return (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${b.className}`}
                  >
                    {b.icon}
                    {b.label}
                  </span>
                );
              })()}
            </div>

            {/* Seller Information Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                  {t("seller.quotations.buyer") || "Buyer / Trader Information"}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck size={12} /> Verified Trader
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-2">
                {activeSelectedQuote.sellerName || "Sri Balaji Agro Agencies"}
              </h3>
              <div className="mt-2 flex flex-col gap-1.5 text-xs text-gray-600">
                {activeSelectedQuote.sellerLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#24833A] shrink-0" />
                    <span>{activeSelectedQuote.sellerLocation}</span>
                  </div>
                )}
                {activeSelectedQuote.sellerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#24833A] shrink-0" />
                    <a
                      href={`tel:${activeSelectedQuote.sellerPhone}`}
                      className="font-semibold text-[#24833A] hover:underline"
                    >
                      {activeSelectedQuote.sellerPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Commercial Pricing Breakdown */}
            <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-4 mb-4">
              <h4 className="text-xs font-bold uppercase text-[#174D25] tracking-wider mb-2">
                Commercial Pricing & Quantity
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Demanded Crop:</span>
                  <p className="font-bold text-[#174D25] text-sm mt-0.5">{activeSelectedQuote.crop}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Quantity:</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {activeSelectedQuote.quantity} {activeSelectedQuote.unit}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Offered Unit Price:</span>
                  <p className="font-black text-[#24833A] text-base mt-0.5">
                    ₹{activeSelectedQuote.offeredPrice.toLocaleString("en-IN")} / {activeSelectedQuote.unit.slice(0, -1)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Estimated Total Payout:</span>
                  <p className="font-black text-gray-900 text-base mt-0.5">
                    ₹{activeSelectedQuote.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Logistics & Terms */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                Procurement Terms & Logistics
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Delivery Option:</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                    <Truck size={14} className="text-[#24833A]" />
                    {activeSelectedQuote.deliveryOption}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Availability Date:</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                    <Calendar size={14} className="text-[#24833A]" />
                    {activeSelectedQuote.availableFrom}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Offer Validity:</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{activeSelectedQuote.validity}</p>
                </div>
                <div>
                  <span className="text-gray-500">Submitted Date:</span>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {new Date(activeSelectedQuote.sentAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {activeSelectedQuote.notes && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <span className="text-xs font-semibold text-gray-500">Buyer Notes:</span>
                  <p className="text-xs text-gray-700 mt-1 bg-gray-50 rounded-xl p-2.5 italic">
                    &ldquo;{activeSelectedQuote.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Related Demand / Lead Information */}
            {(() => {
              const relLead = getRelatedLead(activeSelectedQuote.leadId);
              if (!relLead) return null;
              return (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 mb-4 text-xs">
                  <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                    {t("seller.quotations.demandInfo") || "Associated Crop Demand"}
                  </span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold text-gray-900">{relLead.crop} ({relLead.id})</span>
                    <span className="text-gray-600">Expected: ₹{relLead.expectedPricePerUnit}/unit</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Location: {relLead.farmerLocation}, {relLead.district} • Urgency: {relLead.urgency}
                  </p>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {activeSelectedQuote.status === "submitted" || activeSelectedQuote.status === "under_review" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectConfirmQuote(activeSelectedQuote);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-300 bg-white py-3 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-50 active:scale-95 transition cursor-pointer"
                  >
                    <XCircle size={15} />
                    {t("seller.quotations.rejectButton") || "Reject Quotation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAccept(activeSelectedQuote)}
                    className="flex flex-2 items-center justify-center gap-2 rounded-2xl bg-[#24833A] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 transition cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    {t("seller.quotations.acceptButton") || "Accept Quotation"}
                  </button>
                </>
              ) : activeSelectedQuote.status === "accepted" ? (
                <div className="w-full rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Quotation Accepted — Harvest Agreement Active
                  </span>
                </div>
              ) : activeSelectedQuote.status === "not_selected" ? (
                <div className="w-full rounded-2xl bg-gray-100 border border-gray-200 p-3 text-center">
                  <span className="text-xs font-semibold text-gray-600">
                    {t("seller.quotations.otherOffersDisabledNotice") ||
                      "Another quotation was accepted for this crop demand. This offer is closed."}
                  </span>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-rose-50 border border-rose-200 p-3 text-center">
                  <span className="text-xs font-bold text-rose-700">
                    Quotation Rejected — Archived in History
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= REJECT CONFIRMATION MODAL ================= */}
      {rejectConfirmQuote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-gray-900">
              {t("seller.quotations.rejectConfirmTitle") || "Reject this Quotation?"}
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {t("seller.quotations.rejectConfirmDesc") ||
                `Are you sure you want to reject the offer of ₹${rejectConfirmQuote.offeredPrice.toLocaleString("en-IN")}/${rejectConfirmQuote.unit.slice(0, -1)} from ${rejectConfirmQuote.sellerName || "this buyer"}? It will remain visible in your history as rejected.`}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRejectConfirmQuote(null)}
                className="flex-1 rounded-2xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
              >
                {t("seller.quotations.cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 active:scale-95 transition cursor-pointer shadow-xs"
              >
                {t("seller.quotations.confirmReject") || "Reject Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MULTIPLE QUOTATIONS COMPARISON MODAL ================= */}
      {comparingLeadId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setComparingLeadId(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition z-10 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                <Scale size={12} /> Direct Offer Comparison
              </span>
              <h2 className="text-xl font-black text-[#174D25] mt-1">
                Compare Buyer Quotations
              </h2>
              <p className="text-xs text-gray-500">
                Compare competing buyer offers for this crop demand and choose the best terms for your harvest.
              </p>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(quotationsByLead.get(comparingLeadId) || []).map((quote) => {
                const isAccepted = quote.status === "accepted";
                const isPending = quote.status === "submitted" || quote.status === "under_review";
                const isNotSelected = quote.status === "not_selected";
                const isRejected = quote.status === "rejected";

                return (
                  <div
                    key={quote.id}
                    className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
                      isAccepted
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-[#24833A]/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className="text-[10px] font-mono font-bold text-gray-500">
                          {quote.id}
                        </span>
                        {(() => {
                          const b = getStatusBadge(quote.status);
                          return (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[10px] font-bold ${b.className}`}
                            >
                              {b.label}
                            </span>
                          );
                        })()}
                      </div>

                      <h4 className="text-sm font-bold text-gray-900">
                        {quote.sellerName || "Trader / Buyer"}
                      </h4>
                      <p className="text-[11px] text-gray-500 mb-3">{quote.sellerLocation}</p>

                      <div className="rounded-xl bg-[#F4FBF5] p-3 text-xs flex flex-col gap-1.5 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Offered Price:</span>
                          <span className="font-black text-[#24833A] text-sm">
                            ₹{quote.offeredPrice.toLocaleString("en-IN")}/{quote.unit.slice(0, -1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Total Value:</span>
                          <span className="font-bold text-gray-900">
                            ₹{quote.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Delivery:</span>
                          <span className="font-semibold text-gray-800">{quote.deliveryOption}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Availability:</span>
                          <span className="font-semibold text-gray-800">{quote.availableFrom}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Validity:</span>
                          <span className="font-semibold text-gray-800">{quote.validity}</span>
                        </div>
                      </div>

                      {quote.notes && (
                        <p className="text-[11px] text-gray-600 italic bg-gray-50 rounded-lg p-2 mb-3">
                          &ldquo;{quote.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectConfirmQuote(quote);
                            }}
                            className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleAccept(quote);
                              setComparingLeadId(null);
                            }}
                            className="flex-2 rounded-xl bg-[#24833A] py-2 text-xs font-bold text-white hover:bg-[#1e6e30] cursor-pointer shadow-xs"
                          >
                            Choose This Offer
                          </button>
                        </>
                      ) : isAccepted ? (
                        <span className="w-full text-center text-xs font-bold text-emerald-700 bg-emerald-100/70 py-1.5 rounded-xl">
                          ✓ Chosen & Accepted
                        </span>
                      ) : isNotSelected ? (
                        <span className="w-full text-center text-xs text-gray-400 font-medium py-1.5">
                          Not Selected
                        </span>
                      ) : (
                        <span className="w-full text-center text-xs text-rose-600 font-medium py-1.5">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
