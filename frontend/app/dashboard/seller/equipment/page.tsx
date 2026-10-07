"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  MapPin,
  Tractor,
  Calendar as CalendarIcon,
  ShieldCheck,
  ChevronRight,
  X,
  CreditCard,
  Phone,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Plus,
  Edit2,
  Power,
  Fuel,
  Gauge,
  AlertTriangle,
  Layers,
  Wrench,
  Camera,
  Tag,
  User,
} from "lucide-react";
import { useSellerStore } from "@/store/seller-store";
import { useTranslation } from "@/hooks/useTranslation";
import {
  EquipmentCategory,
  EquipmentDuration,
  SellerEquipment,
  SellerEquipmentBooking,
  EquipmentBookingStatus,
} from "@/types/seller";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  "Tractors",
  "Harvesters",
  "Harvesters / Implements",
  "Drone",
  "Other",
];

const PRESET_IMAGES: { label: string; url: string; category: EquipmentCategory }[] = [
  {
    label: "Tractor (47-55 HP)",
    url: "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=600&q=80",
    category: "Tractors",
  },
  {
    label: "Combine Harvester",
    url: "https://images.unsplash.com/photo-1543883072-a193cb9d4692?auto=format&fit=crop&w=600&q=80",
    category: "Harvesters",
  },
  {
    label: "Agriculture Drone Sprayer",
    url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80",
    category: "Drone",
  },
  {
    label: "Rotavator / Cultivator",
    url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80",
    category: "Harvesters / Implements",
  },
];

export default function SellerEquipmentPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const equipmentList = useSellerStore((state) => state.equipment || []);
  const bookings = useSellerStore((state) => state.bookings || []);
  const addEquipment = useSellerStore((state) => state.addEquipment);
  const updateEquipment = useSellerStore((state) => state.updateEquipment);
  const toggleEquipmentStatus = useSellerStore((state) => state.toggleEquipmentStatus);
  const updateBookingStatus = useSellerStore((state) => state.updateBookingStatus);

  // Tab mode: "fleet" (My Equipment Fleet) vs "bookings" (Incoming Bookings)
  const [viewMode, setViewMode] = useState<"fleet" | "bookings">("fleet");

  // Fleet Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Bookings Filter
  const [bookingFilter, setBookingFilter] = useState<"all" | EquipmentBookingStatus>("all");

  // Add / Edit Equipment Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SellerEquipment | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<EquipmentCategory>("Tractors");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formPricePerHour, setFormPricePerHour] = useState<number | "">("");
  const [formSecurityDeposit, setFormSecurityDeposit] = useState<number | "">("");
  const [formImageUrl, setFormImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formHp, setFormHp] = useState("");
  const [formFuel, setFormFuel] = useState("Diesel");
  const [formModel, setFormModel] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Booking Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<SellerEquipmentBooking | null>(null);

  // Filtered Equipment List
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [equipmentList, selectedCategory, searchQuery]);

  // Filtered Bookings List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingFilter !== "all" && b.status !== bookingFilter) {
        return false;
      }
      return true;
    });
  }, [bookings, bookingFilter]);

  // Stats
  const activeFleetCount = useMemo(() => {
    return equipmentList.filter(
      (e) => (e.status ?? (e.isAvailable ? "active" : "inactive")) === "active"
    ).length;
  }, [equipmentList]);

  const activeBookingsCount = useMemo(() => {
    return bookings.filter(
      (b) => b.status === "Pending" || b.status === "Confirmed" || b.status === "Active"
    ).length;
  }, [bookings]);

  // Open Form for Adding New Equipment
  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Tractors");
    setFormDescription("");
    setFormLocation("Warangal Agriculture Market Yard");
    setFormPricePerHour(700);
    setFormSecurityDeposit(2000);
    setFormImageUrl(PRESET_IMAGES[0].url);
    setFormHp("50 HP");
    setFormFuel("Diesel");
    setFormModel("2025 Model");
    setFormCapacity("Heavy Duty Implements");
    setFormStatus("active");
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form for Editing Existing Equipment
  const handleOpenEditForm = (item: SellerEquipment) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description || "");
    setFormLocation(item.location);
    setFormPricePerHour(item.pricePerHour);
    setFormSecurityDeposit(item.securityDeposit);
    setFormImageUrl(item.imageUrl || PRESET_IMAGES[0].url);
    setFormHp(item.specifications?.hp || "");
    setFormFuel(item.specifications?.fuel || "Diesel");
    setFormModel(item.specifications?.model || "");
    setFormCapacity(item.specifications?.capacity || "");
    setFormStatus((item.status ?? (item.isAvailable ? "active" : "inactive")) as "active" | "inactive");
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Save Form (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formName.trim()) errors.name = "Equipment name is required";
    if (!formLocation.trim()) errors.location = "Location is required";
    if (!formPricePerHour || Number(formPricePerHour) <= 0) errors.price = "Enter a valid rental rate";
    if (formSecurityDeposit === "" || Number(formSecurityDeposit) < 0) errors.deposit = "Enter a valid deposit amount";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const specifications: Record<string, string> = {};
    if (formHp.trim()) specifications.hp = formHp.trim();
    if (formFuel.trim()) specifications.fuel = formFuel.trim();
    if (formModel.trim()) specifications.model = formModel.trim();
    if (formCapacity.trim()) specifications.capacity = formCapacity.trim();

    if (editingItem) {
      // Edit existing
      updateEquipment(editingItem.id, {
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim() || undefined,
        location: formLocation.trim(),
        pricePerHour: Number(formPricePerHour),
        securityDeposit: Number(formSecurityDeposit),
        imageUrl: formImageUrl,
        status: formStatus,
        isAvailable: formStatus === "active",
        specifications,
      });
    } else {
      // Add new
      addEquipment({
        name: formName.trim(),
        category: formCategory,
        ownerName: "Sri Lakshmi Venkateswara Agro Fleet",
        verified: true,
        location: formLocation.trim(),
        pricePerHour: Number(formPricePerHour),
        securityDeposit: Number(formSecurityDeposit),
        rating: 5.0,
        reviewCount: 0,
        imageUrl: formImageUrl,
        description: formDescription.trim() || undefined,
        status: formStatus,
        isAvailable: formStatus === "active",
        specifications,
        availabilityCalendar: [
          {
            date: new Date().toISOString().split("T")[0],
            availableDurations: ["2 Hours", "4 Hours", "Half Day", "Full Day"],
          },
        ],
        reviews: [],
      });
    }

    setIsFormModalOpen(false);
    setEditingItem(null);
  };

  // Helper for booking status styling
  const getBookingStatusBadge = (status: EquipmentBookingStatus) => {
    switch (status) {
      case "Pending":
        return {
          label: t("seller.fleet.statusPending") || "Pending",
          className: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <Clock size={12} className="text-amber-600" />,
        };
      case "Confirmed":
        return {
          label: t("seller.fleet.statusConfirmed") || "Confirmed",
          className: "bg-blue-50 text-blue-800 border-blue-200",
          icon: <CheckCircle2 size={12} className="text-blue-600" />,
        };
      case "Active":
        return {
          label: t("seller.fleet.statusActive") || "In Progress",
          className: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: <Sparkles size={12} className="text-emerald-600" />,
        };
      case "Completed":
        return {
          label: t("seller.fleet.statusCompleted") || "Completed",
          className: "bg-purple-50 text-purple-800 border-purple-200",
          icon: <Check size={12} className="text-purple-600" />,
        };
      case "Cancelled":
      default:
        return {
          label: t("seller.fleet.statusCancelled") || "Cancelled",
          className: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <XCircle size={12} className="text-gray-500" />,
        };
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("seller.fleet.back") || t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Page Title & Stats Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#174D25] to-[#24833A] p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-100 backdrop-blur-xs">
              <Tractor size={13} /> Fleet Owner Command Hub
            </span>
            <h1 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">
              {t("seller.fleet.title") || "Equipment Fleet Management"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t("seller.fleet.subtitle") ||
                "Manage tractors, harvesters & drones rental listings and incoming farmer bookings"}
            </p>
          </div>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/15 pt-3 text-center text-white">
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">{t("seller.fleet.totalFleet") || "Total Fleet"}</span>
            <p className="text-base font-black">{equipmentList.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">{t("seller.fleet.activeFleet") || "Active"}</span>
            <p className="text-base font-black">{activeFleetCount}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-amber-200">{t("seller.fleet.incomingBookings") || "Bookings"}</span>
            <p className="text-base font-black">{activeBookingsCount}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2">
            <span className="text-[10px] text-emerald-200">Completed</span>
            <p className="text-base font-black">{bookings.filter((b) => b.status === "Completed").length}</p>
          </div>
        </div>
      </div>

      {/* Main Tab Toggle: My Equipment Fleet vs Incoming Bookings */}
      <div className="grid grid-cols-2 rounded-2xl bg-gray-100 p-1 text-xs font-bold shadow-inner">
        <button
          type="button"
          onClick={() => setViewMode("fleet")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 transition cursor-pointer ${
            viewMode === "fleet" ? "bg-white text-[#174D25] shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Tractor size={15} />
          <span>{t("seller.fleet.tabFleet") || "My Equipment Fleet"}</span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-[#174D25]">
            {equipmentList.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("bookings")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 transition cursor-pointer ${
            viewMode === "bookings" ? "bg-white text-[#174D25] shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarIcon size={15} />
          <span>{t("seller.fleet.tabBookings") || "Incoming Bookings"}</span>
          {activeBookingsCount > 0 && (
            <span className="rounded-full bg-amber-200 px-1.5 py-0.2 text-[10px] font-bold text-amber-900">
              {activeBookingsCount}
            </span>
          )}
        </button>
      </div>

      {/* ================= VIEW 1: MY EQUIPMENT FLEET ================= */}
      {viewMode === "fleet" && (
        <>
          {/* Controls: Search & Add Equipment Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment by name or location..."
                className="w-full rounded-2xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 shadow-2xs transition"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddForm}
              leftIcon={<Plus size={16} />}
              className="shrink-0"
            >
              {t("seller.fleet.addEquipment") || "Add Equipment"}
            </Button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              All Categories ({equipmentList.length})
            </button>
            {EQUIPMENT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = equipmentList.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? "bg-[#24833A] text-white shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Equipment Cards Grid */}
          <div className="flex flex-col gap-3">
            {filteredEquipment.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#24833A] mb-2">
                  <Tractor size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-800">
                  {t("seller.fleet.noFleetTitle") || "No Equipment Listed Yet"}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                  {t("seller.fleet.noFleetDesc") ||
                    "Add tractors, harvesters, or drone sprayers to your fleet to start receiving rental bookings from local farmers."}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddForm}
                  leftIcon={<Plus size={14} />}
                  className="mt-4"
                >
                  {t("seller.fleet.addEquipment") || "Add Equipment"}
                </Button>
              </div>
            ) : (
              filteredEquipment.map((item) => {
                const isActive = (item.status ?? (item.isAvailable ? "active" : "inactive")) === "active";

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 rounded-3xl border p-4 sm:p-5 shadow-2xs transition ${
                      isActive
                        ? "border-gray-200 bg-white hover:border-[#24833A]/50 hover:shadow-xs"
                        : "border-gray-200 bg-gray-50/60 opacity-90"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Thumbnail Image */}
                      <div className="relative h-28 w-full sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl || PRESET_IMAGES[0].url}
                          alt={item.name}
                          className={`h-full w-full object-cover transition ${!isActive ? "grayscale" : ""}`}
                        />
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                          {item.category}
                        </span>
                      </div>

                      {/* Equipment Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-gray-400">
                              {item.id}
                            </span>
                            <h3 className="text-base font-bold text-gray-900 leading-tight mt-0.5">
                              {item.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                              <MapPin size={12} className="text-[#24833A] shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>

                          {/* Active / Inactive Status Badge */}
                          <span
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                            />
                            {isActive
                              ? t("seller.fleet.active") || "Active"
                              : t("seller.fleet.inactive") || "Inactive"}
                          </span>
                        </div>

                        {/* Rental Commercials */}
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-2xl bg-[#F4FBF5] p-2.5 text-xs">
                          <div>
                            <span className="text-[10px] text-gray-500 font-medium">Rental Rate</span>
                            <p className="font-black text-[#24833A] text-sm">
                              ₹{item.pricePerHour.toLocaleString("en-IN")} / {item.rateUnit || "Hour"}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-medium">Security Deposit</span>
                            <p className="font-bold text-gray-900">
                              ₹{item.securityDeposit.toLocaleString("en-IN")}
                            </p>
                          </div>
                          {item.specifications?.hp && (
                            <div>
                              <span className="text-[10px] text-gray-500 font-medium">Power / Specs</span>
                              <p className="font-semibold text-gray-700 truncate">
                                {item.specifications.hp}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Specifications Chips */}
                    {item.specifications && Object.keys(item.specifications).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.specifications.model && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                            <Gauge size={10} /> {item.specifications.model}
                          </span>
                        )}
                        {item.specifications.fuel && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                            <Fuel size={10} /> {item.specifications.fuel}
                          </span>
                        )}
                        {item.specifications.capacity && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                            <Layers size={10} /> {item.specifications.capacity}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                      <div className="text-[11px] text-gray-500">
                        {isActive ? (
                          <span className="text-emerald-700 font-semibold">● Visible in Farmer Marketplace</span>
                        ) : (
                          <span className="text-gray-400 italic">Hidden from Farmer Marketplace</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Activate / Deactivate Toggle */}
                        <Button
                          variant={isActive ? "outline" : "primary"}
                          size="sm"
                          onClick={() => toggleEquipmentStatus(item.id)}
                          leftIcon={<Power size={13} />}
                        >
                          {isActive
                            ? t("seller.fleet.deactivate") || "Deactivate"
                            : t("seller.fleet.activate") || "Activate"}
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditForm(item)}
                          leftIcon={<Edit2 size={13} />}
                        >
                          {t("seller.fleet.editEquipment") || "Edit"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ================= VIEW 2: INCOMING BOOKINGS ================= */}
      {viewMode === "bookings" && (
        <>
          {/* Booking Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(["all", "Pending", "Confirmed", "Active", "Completed", "Cancelled"] as const).map(
              (st) => {
                const isSelected = bookingFilter === st;
                const count =
                  st === "all"
                    ? bookings.length
                    : bookings.filter((b) => b.status === st).length;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBookingFilter(st)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                      isSelected
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {st === "all" ? "All Bookings" : st} ({count})
                  </button>
                );
              }
            )}
          </div>

          {/* Bookings List */}
          <div className="flex flex-col gap-3">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                  <CalendarIcon size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-800">
                  {t("seller.fleet.noBookingsTitle") || "No Incoming Bookings"}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                  {t("seller.fleet.noBookingsDesc") ||
                    "When farmers book your equipment, the rental requests will appear here for confirmation and dispatch."}
                </p>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const badge = getBookingStatusBadge(booking.status);

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs"
                  >
                    {/* Header: ID, Equipment name & status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-gray-400">
                          {booking.id}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 leading-tight mt-0.5">
                          {booking.equipmentName}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                          <span className="inline-flex items-center gap-1 text-[#174D25] font-bold">
                            <User size={12} className="text-[#24833A]" />
                            {booking.customerName || "Farmer Customer"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            {booking.location}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>

                    {/* Booking Schedule & Financials */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-[#F4FBF5] p-3 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Date & Time</span>
                        <p className="font-bold text-gray-900">{booking.bookingDate}</p>
                        <p className="text-[10px] text-gray-500">{booking.startTime}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Duration</span>
                        <p className="font-bold text-[#174D25]">{booking.duration}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Rental Payout</span>
                        <p className="font-black text-[#24833A] text-sm">
                          ₹{booking.rentalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Payment Status</span>
                        <p className="font-semibold text-gray-800 flex items-center gap-1">
                          <CreditCard size={12} className="text-[#24833A]" />
                          {booking.paymentStatus} ({booking.paymentMethod})
                        </p>
                      </div>
                    </div>

                    {/* Customer Contact & Lifecycle Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs">
                      {booking.contactPhone ? (
                        <a
                          href={`tel:${booking.contactPhone}`}
                          className="inline-flex items-center gap-1.5 font-bold text-[#24833A] hover:underline"
                        >
                          <Phone size={13} />
                          <span>{booking.contactPhone}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">No phone provided</span>
                      )}

                      <div className="flex items-center gap-2">
                        {/* Pending Lifecycle: Confirm or Cancel */}
                        {booking.status === "Pending" && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                              className="text-rose-700 hover:bg-rose-50"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                              leftIcon={<CheckCircle2 size={13} />}
                            >
                              {t("seller.fleet.confirmBooking") || "Confirm Booking"}
                            </Button>
                          </>
                        )}

                        {/* Confirmed Lifecycle: Mark Active (Dispatch) or Cancel */}
                        {booking.status === "Confirmed" && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                              className="text-rose-700 hover:bg-rose-50"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, "Active")}
                              leftIcon={<Tractor size={13} />}
                            >
                              {t("seller.fleet.markActive") || "Start Service / Dispatch"}
                            </Button>
                          </>
                        )}

                        {/* Active Lifecycle: Mark Completed */}
                        {booking.status === "Active" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, "Completed")}
                            leftIcon={<Check size={13} />}
                          >
                            {t("seller.fleet.markCompleted") || "Mark Completed"}
                          </Button>
                        )}

                        {/* Completed or Cancelled */}
                        {booking.status === "Completed" && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                            <Check size={13} /> Service Completed
                          </span>
                        )}

                        {booking.status === "Cancelled" && (
                          <span className="text-xs text-gray-500 italic">Booking Cancelled</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ================= ADD / EDIT EQUIPMENT MODAL ================= */}
      {isFormModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsFormModalOpen(false);
                setEditingItem(null);
              }}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition z-10 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#24833A]">
                {editingItem ? "Edit Fleet Listing" : "Add Equipment to Fleet"}
              </span>
              <h2 className="text-xl font-black text-[#174D25]">
                {editingItem ? editingItem.name : "New Machinery Listing"}
              </h2>
              <p className="text-xs text-gray-500">
                Provide specifications and rental rates for local farmers in your district.
              </p>
            </div>

            <form onSubmit={handleSaveForm} className="flex flex-col gap-4">
              {/* Equipment Name */}
              <div>
                <label className="text-xs font-bold text-gray-700">
                  {t("seller.fleet.equipmentName") || "Equipment Name"} *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Mahindra 575 DI Tractor (47 HP)"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20"
                />
                {formErrors.name && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.name}</p>}
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">
                    {t("seller.fleet.category") || "Category"} *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EquipmentCategory)}
                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  >
                    {EQUIPMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">
                    {t("seller.fleet.status") || "Fleet Status"}
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "active" | "inactive")}
                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="active">Active (Available for Rent)</option>
                    <option value="inactive">Inactive (Maintenance / Busy)</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-gray-700">
                  {t("seller.fleet.location") || "Base Location / Mandi"} *
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Warangal Bypass Road, Warangal"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20"
                />
                {formErrors.location && (
                  <p className="text-[10px] text-red-500 mt-0.5">{formErrors.location}</p>
                )}
              </div>

              {/* Pricing: Rate Per Hour & Security Deposit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">
                    {t("seller.fleet.rentalRate") || "Rental Rate (₹/Hour)"} *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formPricePerHour}
                    onChange={(e) =>
                      setFormPricePerHour(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="e.g. 650"
                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20"
                  />
                  {formErrors.price && (
                    <p className="text-[10px] text-red-500 mt-0.5">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">
                    {t("seller.fleet.depositAmount") || "Security Deposit (₹)"} *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formSecurityDeposit}
                    onChange={(e) =>
                      setFormSecurityDeposit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="e.g. 2000"
                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20"
                  />
                  {formErrors.deposit && (
                    <p className="text-[10px] text-red-500 mt-0.5">{formErrors.deposit}</p>
                  )}
                </div>
              </div>

              {/* Specifications: HP, Fuel, Model, Capacity */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5">
                <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                  Technical Specifications
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-600">Engine / Power</label>
                    <input
                      type="text"
                      value={formHp}
                      onChange={(e) => setFormHp(e.target.value)}
                      placeholder="e.g. 47 HP"
                      className="mt-0.5 w-full rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-600">Fuel / Power Type</label>
                    <input
                      type="text"
                      value={formFuel}
                      onChange={(e) => setFormFuel(e.target.value)}
                      placeholder="e.g. Diesel / Battery"
                      className="mt-0.5 w-full rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-600">Model / Make</label>
                    <input
                      type="text"
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      placeholder="e.g. 2025 XP Plus"
                      className="mt-0.5 w-full rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-600">Capacity / Attachment</label>
                    <input
                      type="text"
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(e.target.value)}
                      placeholder="e.g. 1500 kg lift / 40L"
                      className="mt-0.5 w-full rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Preset Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700">Equipment Photo Preset</label>
                <div className="mt-1.5 grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = formImageUrl === preset.url;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setFormImageUrl(preset.url);
                          setFormCategory(preset.category);
                        }}
                        className={`relative h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                          isSelected ? "border-[#24833A] scale-98 shadow-xs" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="h-full w-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#24833A]/30 flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-700">
                  {t("seller.fleet.description") || "Description & Terms"}
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Well-maintained tractor with trained driver. Available for immediate farm ploughing."
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setIsFormModalOpen(false);
                    setEditingItem(null);
                  }}
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
                  {editingItem ? "Save Changes" : "Publish to Fleet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
