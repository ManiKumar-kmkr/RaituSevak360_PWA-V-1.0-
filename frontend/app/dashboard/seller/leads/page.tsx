"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  Send,
  Phone,
  CheckCircle2,
  XCircle,
  X,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Truck,
  Calendar,
  Layers,
  Info,
} from "lucide-react";
import { useSellerStore } from "@/store/seller-store";
import { BuyLead, LeadFilterCriteria, Quotation } from "@/types/seller";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

const CATEGORIES = ["All", "Grains", "Vegetables", "Fruits", "Organic"];
const CROP_TYPES = ["All", "Rice", "Wheat", "Cotton", "Maize", "Vegetables", "Fruits"];
const DISTRICTS = ["All", "Warangal", "Karimnagar", "Guntur", "Khammam", "Nalgonda"];

export default function BuyLeadsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const buyLeads = useSellerStore((state) => state.buyLeads);
  const quotations = useSellerStore((state) => state.quotations || []);
  const addQuotation = useSellerStore((state) => state.addQuotation);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filterCriteria, setFilterCriteria] = useState<LeadFilterCriteria>({
    cropType: "All",
    minQuantity: 0,
    maxQuantity: 500,
    district: "All",
    datePosted: "all",
    urgency: "all",
  });

  // Selected Lead Details Modal
  const [selectedLead, setSelectedLead] = useState<BuyLead | null>(null);

  // Quotation Modal & Form
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteLead, setQuoteLead] = useState<BuyLead | null>(null);
  const [offeredPrice, setOfferedPrice] = useState<number | "">("");
  const [deliveryOption, setDeliveryOption] = useState<"Farmer Pickup" | "Home Delivery">("Farmer Pickup");
  const [availableFrom, setAvailableFrom] = useState("2026-10-08");
  const [validity, setValidity] = useState("7 Days");
  const [notes, setNotes] = useState("");
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});

  // Quotation Success Screen State
  const [submittedQuote, setSubmittedQuote] = useState<Quotation | null>(null);

  // Contact Farmer Notification State
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);

  // Dynamic Calculation: Quantity × Offered Price
  const calculatedTotal = useMemo(() => {
    if (!quoteLead || offeredPrice === "" || offeredPrice <= 0) return 0;
    return quoteLead.quantity * Number(offeredPrice);
  }, [quoteLead, offeredPrice]);

  // Lead Filtering
  const filteredLeads = useMemo(() => {
    return buyLeads.filter((lead) => {
      // Category Chip Filter
      if (selectedCategory !== "All" && lead.category !== selectedCategory) {
        return false;
      }
      // Search query (crop, location, farmer)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          lead.crop.toLowerCase().includes(q) ||
          lead.farmerName.toLowerCase().includes(q) ||
          lead.farmerLocation.toLowerCase().includes(q) ||
          lead.district.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Detailed Filters
      if (filterCriteria.cropType !== "All" && !lead.crop.toLowerCase().includes(filterCriteria.cropType.toLowerCase())) {
        return false;
      }
      if (filterCriteria.district !== "All" && lead.district.toLowerCase() !== filterCriteria.district.toLowerCase()) {
        return false;
      }
      if (filterCriteria.urgency !== "all" && lead.urgency !== filterCriteria.urgency) {
        return false;
      }
      if (lead.quantity > filterCriteria.maxQuantity) {
        return false;
      }
      return true;
    });
  }, [buyLeads, selectedCategory, searchQuery, filterCriteria]);

  const handleOpenQuotation = (lead: BuyLead) => {
    setQuoteLead(lead);
    setOfferedPrice(lead.expectedPricePerUnit);
    setDeliveryOption(lead.deliveryMode === "Home Delivery" ? "Home Delivery" : "Farmer Pickup");
    setQuoteErrors({});
    setIsQuoteModalOpen(true);
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteLead) return;

    const errors: Record<string, string> = {};
    if (!offeredPrice || Number(offeredPrice) <= 0) {
      errors.price = "Enter a valid offer price";
    }
    if (!availableFrom) {
      errors.availableFrom = "Available from date is required";
    }

    if (Object.keys(errors).length > 0) {
      setQuoteErrors(errors);
      return;
    }

    const newQuote = addQuotation({
      leadId: quoteLead.id,
      farmerName: quoteLead.farmerName,
      crop: quoteLead.crop,
      quantity: quoteLead.quantity,
      unit: quoteLead.unit,
      offeredPrice: Number(offeredPrice),
      totalAmount: calculatedTotal,
      deliveryOption,
      availableFrom,
      validity,
      notes: notes.trim() || undefined,
    });

    setIsQuoteModalOpen(false);
    setSelectedLead(null);
    setSubmittedQuote(newQuote);
  };

  const handleContactFarmer = (lead: BuyLead) => {
    setContactSuccessMsg(`Connected with ${lead.farmerName}: ${lead.farmerPhone}`);
    setTimeout(() => {
      setContactSuccessMsg(null);
    }, 4000);
  };

  const handleResetFilters = () => {
    setFilterCriteria({
      cropType: "All",
      minQuantity: 0,
      maxQuantity: 500,
      district: "All",
      datePosted: "all",
      urgency: "all",
    });
    setIsFilterModalOpen(false);
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#174D25]">Buy Leads</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Direct farm harvest offers & procurement</p>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#24833A]/30 bg-white text-[#24833A] shadow-2xs hover:bg-[#E4F0DD] active:scale-95 transition cursor-pointer"
          aria-label="Filter Leads"
        >
          <Filter size={18} />
          {(filterCriteria.cropType !== "All" || filterCriteria.district !== "All" || filterCriteria.urgency !== "all") && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#24833A]" />
          )}
        </button>
      </div>

      {/* Contact Flash Notification */}
      {contactSuccessMsg && (
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-[#174D25] animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#24833A]" />
            <span className="font-semibold">{contactSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setContactSuccessMsg(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search Input Field */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search crop, location, farmer..."
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 shadow-2xs transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Leads List */}
      <div className="flex flex-col gap-3">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 mb-2">
              <Search size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-700">No Buy Leads Found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              No crop harvest leads matched your active search or filters. Try resetting filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const urgencyBadge =
              lead.urgency === "High"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : lead.urgency === "Medium"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-emerald-50 text-[#174D25] border-emerald-200";

            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/60 hover:shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-gray-500">
                      {lead.farmerName}
                    </span>
                    <h2 className="text-base font-bold text-[#174D25] leading-tight mt-0.5">
                      {lead.crop}
                    </h2>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <MapPin size={12} className="text-[#24833A]" />
                      <span>{lead.farmerLocation}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${urgencyBadge}`}
                    >
                      {lead.urgency} Urgency
                    </span>
                    {(() => {
                      const leadQuotes = quotations.filter((q) => q.leadId === lead.id);
                      const acceptedQuote = leadQuotes.find((q) => q.status === "accepted");
                      const hasSubmittedQuote = leadQuotes.some(
                        (q) => q.status === "submitted" || q.status === "under_review"
                      );
                      const isRejected =
                        leadQuotes.length > 0 &&
                        leadQuotes.every((q) => q.status === "rejected" || q.status === "not_selected");

                      if (acceptedQuote) {
                        return (
                          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-emerald-600" /> Quotation Accepted
                          </span>
                        );
                      }
                      if (hasSubmittedQuote) {
                        return (
                          <span className="rounded-full bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                            <Clock size={10} className="text-blue-600" /> Quotation Sent
                          </span>
                        );
                      }
                      if (isRejected) {
                        return (
                          <span className="rounded-full bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                            <XCircle size={10} className="text-rose-600" /> Quotation Rejected
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F4FBF5] p-3 text-xs">
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">Quantity</span>
                    <p className="font-bold text-[#174D25]">
                      {lead.quantity} {lead.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">Expected Price</span>
                    <p className="font-bold text-[#24833A]">
                      ₹{lead.expectedPricePerUnit.toLocaleString("en-IN")} / {lead.unit.slice(0, -1) || "unit"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Clock size={11} /> Posted {lead.postedTime}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-[#24833A] hover:underline">
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= LEAD DETAILS MODAL ================= */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedLead(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer z-10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Farm Produce Image Banner */}
            <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-4 bg-gray-100">
              <img
                src={selectedLead.fieldImageUrl}
                alt={selectedLead.crop}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                {selectedLead.category}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-bold text-gray-500">
                  Farmer: {selectedLead.farmerName}
                </span>
                <h2 className="text-xl font-black text-[#174D25]">
                  {selectedLead.crop}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <MapPin size={14} className="text-[#24833A]" />
                  <span>{selectedLead.farmerLocation}, {selectedLead.state}</span>
                </div>
              </div>

              {selectedLead.description && (
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedLead.description}
                </p>
              )}

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-gray-500 font-medium">Quantity Available</span>
                  <p className="text-sm font-bold text-[#174D25]">
                    {selectedLead.quantity} {selectedLead.unit}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 font-medium">Expected Price</span>
                  <p className="text-sm font-bold text-[#24833A]">
                    ₹{selectedLead.expectedPricePerUnit.toLocaleString("en-IN")} / {selectedLead.unit.slice(0, -1) || "unit"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 font-medium">Delivery Mode</span>
                  <p className="font-semibold text-gray-800">{selectedLead.deliveryMode}</p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 font-medium">Harvest / Deadline</span>
                  <p className="font-semibold text-gray-800">{selectedLead.deadline}</p>
                </div>
              </div>

              {/* Live Quotation Status Reflection */}
              {(() => {
                const currentLeadQuotes = quotations.filter((q) => q.leadId === selectedLead.id);
                const currentAcceptedQuote = currentLeadQuotes.find((q) => q.status === "accepted");
                const currentPendingQuote = currentLeadQuotes.find(
                  (q) => q.status === "submitted" || q.status === "under_review"
                );
                const currentRejectedQuote = currentLeadQuotes.find((q) => q.status === "rejected");

                if (currentAcceptedQuote) {
                  return (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">Farmer Accepted Your Quotation!</h4>
                        <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                          The farmer has accepted your quotation of ₹
                          {currentAcceptedQuote.offeredPrice.toLocaleString("en-IN")}/
                          {currentAcceptedQuote.unit.slice(0, -1)} (Total: ₹
                          {currentAcceptedQuote.totalAmount.toLocaleString("en-IN")}). Contact the farmer to coordinate
                          harvest pickup and weighing.
                        </p>
                      </div>
                    </div>
                  );
                }

                if (currentPendingQuote) {
                  return (
                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-blue-950">Quotation Sent (Pending Farmer Review)</span>
                      </div>
                      <span className="text-xs font-bold text-blue-700">
                        ₹{currentPendingQuote.offeredPrice.toLocaleString("en-IN")}/
                        {currentPendingQuote.unit.slice(0, -1)}
                      </span>
                    </div>
                  );
                }

                if (currentRejectedQuote) {
                  return (
                    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5">
                      <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-rose-950">Quotation Rejected by Farmer</h4>
                        <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                          The farmer rejected your quotation of ₹
                          {currentRejectedQuote.offeredPrice.toLocaleString("en-IN")}/
                          {currentRejectedQuote.unit.slice(0, -1)}. You may contact the farmer to negotiate or submit an
                          updated quotation.
                        </p>
                      </div>
                    </div>
                  );
                }

                return null;
              })()}

              {/* Action Buttons: Contact Farmer & Send Quotation */}
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleContactFarmer(selectedLead)}
                  leftIcon={<Phone size={14} />}
                  className="flex-1"
                >
                  Contact Farmer
                </Button>
                {(() => {
                  const currentLeadQuotes = quotations.filter((q) => q.leadId === selectedLead.id);
                  const currentAcceptedQuote = currentLeadQuotes.find((q) => q.status === "accepted");

                  if (currentAcceptedQuote) {
                    return (
                      <Button
                        variant="primary"
                        size="md"
                        disabled
                        leftIcon={<CheckCircle2 size={14} />}
                        className="flex-2 bg-emerald-600 hover:bg-emerald-600 cursor-default"
                      >
                        Quotation Accepted
                      </Button>
                    );
                  }

                  return (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenQuotation(selectedLead)}
                      leftIcon={<Send size={14} />}
                      className="flex-2"
                    >
                      Send Quotation
                    </Button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SEND QUOTATION MODAL ================= */}
      {isQuoteModalOpen && quoteLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#24833A]">
                Submit Commercial Offer
              </span>
              <h2 className="text-xl font-bold text-[#174D25]">Send Quotation</h2>
              <p className="text-xs text-gray-500">
                To {quoteLead.farmerName} for {quoteLead.crop} ({quoteLead.quantity} {quoteLead.unit})
              </p>
            </div>

            <form onSubmit={handleSendQuotation} className="flex flex-col gap-4">
              {/* Dynamic Calculation Area */}
              <div className="rounded-xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium">Quantity Demanded</span>
                  <span className="font-bold text-[#174D25]">
                    {quoteLead.quantity} {quoteLead.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium">Farmer Expected Price</span>
                  <span className="text-gray-700 font-semibold">
                    ₹{quoteLead.expectedPricePerUnit.toLocaleString("en-IN")} / {quoteLead.unit.slice(0, -1)}
                  </span>
                </div>
                <div className="border-t border-[#24833A]/10 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#174D25]">Calculated Total Amount</span>
                  <span className="text-base font-black text-[#24833A]">
                    ₹{calculatedTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Offered Price Input */}
              <div>
                <label htmlFor="offeredPrice" className="block text-xs font-bold text-gray-700 mb-1">
                  Your Price / {quoteLead.unit.slice(0, -1)} (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  id="offeredPrice"
                  type="number"
                  min={1}
                  value={offeredPrice}
                  onChange={(e) =>
                    setOfferedPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder={`e.g. ${quoteLead.expectedPricePerUnit}`}
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                    quoteErrors.price ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                  }`}
                />
                {quoteErrors.price && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{quoteErrors.price}</p>
                )}
              </div>

              {/* Delivery Option */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Delivery Option <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("Farmer Pickup")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                      deliveryOption === "Farmer Pickup"
                        ? "border-[#24833A] bg-[#E4F0DD] text-[#174D25]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <MapPin size={14} /> Farmer Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("Home Delivery")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                      deliveryOption === "Home Delivery"
                        ? "border-[#24833A] bg-[#E4F0DD] text-[#174D25]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Truck size={14} /> Store Delivery
                  </button>
                </div>
              </div>

              {/* Available From Date & Validity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="availDate" className="block text-xs font-bold text-gray-700 mb-1">
                    Available From <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="availDate"
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition"
                  />
                </div>
                <div>
                  <label htmlFor="validity" className="block text-xs font-bold text-gray-700 mb-1">
                    Offer Validity
                  </label>
                  <select
                    id="validity"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs sm:text-sm font-medium text-gray-800 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition"
                  >
                    <option value="3 Days">3 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="7 Days">7 Days</option>
                    <option value="14 Days">14 Days</option>
                  </select>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Notes / Payment Terms <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Weighbridge slip payment, immediate bank transfer on pickup..."
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-2"
                >
                  Send Quotation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= QUOTATION SUCCESS MODAL ================= */}
      {submittedQuote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#24833A]/20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A] mb-3">
              <CheckCircle2 size={36} strokeWidth={2.4} />
            </div>

            <h3 className="text-xl font-black text-[#174D25]">
              Quotation Sent Successfully!
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Your quotation has been delivered directly to {submittedQuote.farmerName}.
            </p>

            {/* Quotation Summary Card */}
            <div className="mt-4 rounded-2xl border border-[#24833A]/30 bg-[#F4FBF5] p-3.5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Quotation ID</span>
                <span className="font-mono font-bold text-[#174D25]">{submittedQuote.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Farmer</span>
                <span className="font-semibold text-gray-800">{submittedQuote.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Crop & Quantity</span>
                <span className="font-semibold text-gray-800">
                  {submittedQuote.crop} ({submittedQuote.quantity} {submittedQuote.unit})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Your Offered Price</span>
                <span className="font-bold text-[#24833A]">
                  ₹{submittedQuote.offeredPrice.toLocaleString("en-IN")} / {submittedQuote.unit.slice(0, -1)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#24833A]/10 pt-2 font-bold">
                <span className="text-[#174D25]">Total Proposed Amount</span>
                <span className="text-sm font-black text-[#24833A]">
                  ₹{submittedQuote.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                <span>Expected Response</span>
                <span className="font-medium text-gray-700">{submittedQuote.expectedResponse}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setSubmittedQuote(null)}
              >
                View All Leads
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BUY LEADS FILTER MODAL ================= */}
      {isFilterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[#24833A]" />
                <h3 className="text-base font-bold text-[#174D25]">Filter Buy Leads</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Crop Type */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Crop Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {CROP_TYPES.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setFilterCriteria((prev) => ({ ...prev, cropType: crop }))}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        filterCriteria.cropType === crop
                          ? "bg-[#24833A] text-white font-bold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">Max Quantity</label>
                  <span className="font-bold text-[#24833A]">
                    Up to {filterCriteria.maxQuantity} Quintals
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={500}
                  step={10}
                  value={filterCriteria.maxQuantity}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({ ...prev, maxQuantity: Number(e.target.value) }))
                  }
                  className="w-full accent-[#24833A]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>20 Quintals</span>
                  <span>500 Quintals</span>
                </div>
              </div>

              {/* District / Location */}
              <div>
                <label htmlFor="districtSelect" className="block font-bold text-gray-700 mb-1">
                  Location / District
                </label>
                <select
                  id="districtSelect"
                  value={filterCriteria.district}
                  onChange={(e) => setFilterCriteria((prev) => ({ ...prev, district: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs sm:text-sm font-medium text-gray-800 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Urgency Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["all", "High", "Medium", "Low"] as const).map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setFilterCriteria((prev) => ({ ...prev, urgency: urg }))}
                      className={`rounded-lg py-1.5 text-center text-xs capitalize transition ${
                        filterCriteria.urgency === urg
                          ? "bg-[#24833A] text-white font-bold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw size={14} />}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-2"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
