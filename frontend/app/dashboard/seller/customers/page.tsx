"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Users,
  Phone,
  MapPin,
  ShoppingBag,
  Tractor,
  Calendar,
  Clock,
  ChevronRight,
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useSellerStore } from "@/store/seller-store";
import { useTranslation } from "@/hooks/useTranslation";
import { SellerOrder, SellerEquipmentBooking } from "@/types/seller";
import { BackButton } from "@/components/ui/BackButton";

export interface DerivedCustomer {
  id: string;
  name: string;
  phone?: string;
  location?: string;
  district?: string;
  orders: SellerOrder[];
  bookings: SellerEquipmentBooking[];
  totalOrdersCount: number;
  totalBookingsCount: number;
  totalSpend: number;
  latestActivityDate: string;
}

export default function SellerCustomersPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const orders = useSellerStore((state) => state.orders || []);
  const bookings = useSellerStore((state) => state.bookings || []);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "orders" | "bookings">("all");

  // Selected customer for detail modal
  const [selectedCustomer, setSelectedCustomer] = useState<DerivedCustomer | null>(null);

  // Derive unique customers from Seller orders and bookings
  const derivedCustomers = useMemo(() => {
    const customerMap = new Map<string, DerivedCustomer>();

    // 1. Process Seller Product Orders
    for (const order of orders) {
      const name = (order.deliveryAddress?.fullName || order.customer || "Farmer Customer").trim();
      const rawPhone = order.deliveryAddress?.phone || order.customerPhone || "";
      const cleanPhone = rawPhone.replace(/[\s\-\+\(\)]/g, "").slice(-10);

      // Stable customer identity: prioritize normalized 10-digit phone, fallback to name
      const key = cleanPhone ? `phone_${cleanPhone}` : `name_${name.toLowerCase()}`;

      const locationParts = [
        order.deliveryAddress?.village,
        order.deliveryAddress?.mandal,
        order.deliveryAddress?.district,
      ].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(", ") : order.deliveryAddress?.street || "Telangana";
      const district = order.deliveryAddress?.district || "Warangal";

      const orderAmount =
        order.totalAmountNum ||
        parseInt((order.amount || "").replace(/[^0-9]/g, ""), 10) ||
        0;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name,
          phone: rawPhone || undefined,
          location,
          district,
          orders: [order],
          bookings: [],
          totalOrdersCount: 1,
          totalBookingsCount: 0,
          totalSpend: orderAmount,
          latestActivityDate: order.date || "Recent",
        });
      } else {
        const existing = customerMap.get(key)!;
        existing.orders.push(order);
        existing.totalOrdersCount += 1;
        existing.totalSpend += orderAmount;
        if (!existing.phone && rawPhone) existing.phone = rawPhone;
        if (location && location !== "Telangana") existing.location = location;
      }
    }

    // 2. Process Seller Equipment Bookings
    for (const booking of bookings) {
      const name = (booking.customerName || "Farmer Renter").trim();
      const rawPhone = booking.contactPhone || "";
      const cleanPhone = rawPhone.replace(/[\s\-\+\(\)]/g, "").slice(-10);

      const key = cleanPhone ? `phone_${cleanPhone}` : `name_${name.toLowerCase()}`;
      const location = booking.location || "Telangana";

      const bookingAmount =
        booking.totalAmount ||
        (booking.rentalAmount || 0) + (booking.depositFee || 0) ||
        0;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name,
          phone: rawPhone || undefined,
          location,
          district: "Warangal",
          orders: [],
          bookings: [booking],
          totalOrdersCount: 0,
          totalBookingsCount: 1,
          totalSpend: bookingAmount,
          latestActivityDate: booking.bookingDate || "Recent",
        });
      } else {
        const existing = customerMap.get(key)!;
        existing.bookings.push(booking);
        existing.totalBookingsCount += 1;
        existing.totalSpend += bookingAmount;
        if (!existing.phone && rawPhone) existing.phone = rawPhone;
        if (location && location !== "Telangana") existing.location = location;
      }
    }

    // Convert map to array and sort by total spend (highest value customers first)
    return Array.from(customerMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders, bookings]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return derivedCustomers.filter((cust) => {
      // Type filter
      if (activeFilter === "orders" && cust.totalOrdersCount === 0) return false;
      if (activeFilter === "bookings" && cust.totalBookingsCount === 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cust.name.toLowerCase().includes(q);
        const matchesPhone = (cust.phone || "").toLowerCase().includes(q);
        const matchesLocation = (cust.location || "").toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [derivedCustomers, activeFilter, searchQuery]);

  // Summary Metrics
  const totalSpendSum = useMemo(() => {
    return derivedCustomers.reduce((acc, c) => acc + c.totalSpend, 0);
  }, [derivedCustomers]);

  const activeProductBuyers = useMemo(() => {
    return derivedCustomers.filter((c) => c.totalOrdersCount > 0).length;
  }, [derivedCustomers]);

  const activeEquipmentRenters = useMemo(() => {
    return derivedCustomers.filter((c) => c.totalBookingsCount > 0).length;
  }, [derivedCustomers]);

  // Get active selected customer updated if state changes
  const activeSelectedCustomer = useMemo(() => {
    if (!selectedCustomer) return null;
    return derivedCustomers.find((c) => c.id === selectedCustomer.id) || selectedCustomer;
  }, [derivedCustomers, selectedCustomer]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("seller.customerMgmt.back") || t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Page Title & Stats Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#174D25] to-[#24833A] p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-100 backdrop-blur-xs">
              <Users size={13} /> Seller CRM & Buyer Directory
            </span>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t("seller.customerMgmt.title") || "Customer Management"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t("seller.customerMgmt.subtitle") ||
                "Farmer buyer directory, order history & equipment rental records"}
            </p>
          </div>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/15 pt-3 text-center text-white">
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">
              {t("seller.customerMgmt.totalCustomers") || "Total"}
            </span>
            <p className="text-base font-bold">{derivedCustomers.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">
              {t("seller.customerMgmt.activeBuyers") || "Buyers"}
            </span>
            <p className="text-base font-bold">{activeProductBuyers}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-amber-200">
              {t("seller.customerMgmt.fleetRenters") || "Renters"}
            </span>
            <p className="text-base font-bold">{activeEquipmentRenters}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">
              {t("seller.customerMgmt.totalSpend") || "Revenue"}
            </span>
            <p className="text-base font-bold">₹{(totalSpendSum / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            t("seller.customerMgmt.searchPlaceholder") ||
            "Search by farmer name, mobile number, or village..."
          }
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 shadow-2xs transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeFilter === "all"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.customerMgmt.filterAll") || "All Customers"} ({derivedCustomers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("orders")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeFilter === "orders"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.customerMgmt.filterOrders") || "Product Buyers"} ({activeProductBuyers})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("bookings")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
            activeFilter === "bookings"
              ? "bg-[#24833A] text-white shadow-2xs"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {t("seller.customerMgmt.filterBookings") || "Machinery Renters"} ({activeEquipmentRenters})
        </button>
      </div>

      {/* Customer Cards List */}
      <div className="flex flex-col gap-3">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A] mb-2">
              <Users size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              {searchQuery
                ? t("seller.customerMgmt.noSearchMatch") || "No matching customers found"
                : t("seller.customerMgmt.noCustomersTitle") || "No Customers Yet"}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
              {searchQuery
                ? "Try searching with a different name, village name, or 10-digit mobile number."
                : t("seller.customerMgmt.noCustomersDesc") ||
                  "Customers will automatically appear here once incoming orders or equipment bookings are placed."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const initials = cust.name
              .split(" ")
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={cust.id}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs"
              >
                {/* Header: Customer Name, Avatar & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#174D25] to-[#24833A] text-sm font-bold text-white shadow-xs">
                      {initials || "FC"}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {cust.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                        {cust.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-[#24833A]" />
                            <span>{cust.location}</span>
                          </span>
                        )}
                        {cust.phone && (
                          <span className="inline-flex items-center gap-1 font-mono text-gray-600">
                            <Phone size={11} className="text-gray-400" />
                            {cust.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#174D25] border border-emerald-200">
                    ₹{cust.totalSpend.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Activity & Order Summary Grid */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F4FBF5] p-3 text-xs text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium">Product Orders</span>
                    <p className="font-black text-gray-900 text-sm mt-0.5">
                      {cust.totalOrdersCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium">Fleet Bookings</span>
                    <p className="font-black text-[#174D25] text-sm mt-0.5">
                      {cust.totalBookingsCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium">Total Spend</span>
                    <p className="font-black text-[#24833A] text-sm mt-0.5">
                      ₹{cust.totalSpend.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={11} /> Activity: {cust.latestActivityDate}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Call Farmer / Customer Button */}
                    {cust.phone && (
                      <a
                        href={`tel:${cust.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
                      >
                        <Phone size={13} className="text-[#24833A]" />
                        <span>Call</span>
                      </a>
                    )}

                    {/* View Profile & Full History Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 transition cursor-pointer"
                    >
                      <span>{t("seller.customerMgmt.viewProfile") || "View Profile"}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= CUSTOMER DETAIL MODAL ================= */}
      {activeSelectedCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition z-10 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Customer Profile Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#174D25] to-[#24833A] text-lg font-black text-white shadow-xs">
                {activeSelectedCustomer.name
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "FC"}
              </div>
              <div className="flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                  <ShieldCheck size={11} /> Verified Agricultural Buyer
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  {activeSelectedCustomer.name}
                </h2>
                <div className="mt-1 flex flex-col gap-1 text-xs text-gray-600">
                  {activeSelectedCustomer.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#24833A] shrink-0" />
                      <span>{activeSelectedCustomer.location}</span>
                    </div>
                  )}
                  {activeSelectedCustomer.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-[#24833A] shrink-0" />
                      <a
                        href={`tel:${activeSelectedCustomer.phone}`}
                        className="font-bold text-[#24833A] hover:underline"
                      >
                        {activeSelectedCustomer.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lifetime Commercials Card */}
            <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#174D25]">
                {t("seller.customerMgmt.orderSummary") || "Order & Spend Summary"}
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Total Purchase:</span>
                  <p className="font-black text-[#24833A] text-base mt-0.5">
                    ₹{activeSelectedCustomer.totalSpend.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Product Orders:</span>
                  <p className="font-black text-gray-900 text-base mt-0.5">
                    {activeSelectedCustomer.totalOrdersCount}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Fleet Bookings:</span>
                  <p className="font-black text-gray-900 text-base mt-0.5">
                    {activeSelectedCustomer.totalBookingsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Button */}
            {activeSelectedCustomer.phone && (
              <a
                href={`tel:${activeSelectedCustomer.phone}`}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#24833A] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 transition cursor-pointer"
              >
                <Phone size={15} />
                <span>Call {activeSelectedCustomer.name}</span>
              </a>
            )}

            {/* SECTION 1: PRODUCT PURCHASE HISTORY */}
            {activeSelectedCustomer.orders.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-[#24833A]" />
                    <span>
                      {t("seller.customerMgmt.orderHistory") || "Product Purchase History"} (
                      {activeSelectedCustomer.orders.length})
                    </span>
                  </h3>
                </div>

                <div className="flex flex-col gap-2">
                  {activeSelectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-gray-200 bg-white p-3 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-500">{ord.id}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                          {ord.status}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 mt-1">{ord.items}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-1.5">
                        <span>Ordered: {ord.date}</span>
                        <span className="font-black text-[#24833A] text-xs">
                          {ord.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: EQUIPMENT RENTAL HISTORY */}
            {activeSelectedCustomer.bookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Tractor size={14} className="text-[#24833A]" />
                    <span>
                      {t("seller.customerMgmt.bookingHistory") || "Machinery Rental History"} (
                      {activeSelectedCustomer.bookings.length})
                    </span>
                  </h3>
                </div>

                <div className="flex flex-col gap-2">
                  {activeSelectedCustomer.bookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="rounded-2xl border border-gray-200 bg-white p-3 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-500">{bk.id}</span>
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-800 border border-purple-200">
                          {bk.status}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 mt-1">{bk.equipmentName}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                        <span>Date: {bk.bookingDate}</span>
                        <span>Duration: {bk.duration}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-1.5">
                        <span>Payment: {bk.paymentStatus}</span>
                        <span className="font-black text-[#24833A] text-xs">
                          ₹{bk.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
