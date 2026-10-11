"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trees,
  CheckCircle2,
  Droplets,
  Layers,
  MapPin,
  ShieldCheck,
  Plus,
  AlertCircle,
  Clock,
} from "lucide-react";
import { LandPlot, SoilType } from "@/types/land";
import { useCartStore } from "@/store/cart-store";

interface ListLandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (land: LandPlot) => void;
  existingListing?: LandPlot | null;
}

const CROPS_OPTIONS = [
  "Paddy",
  "Cotton",
  "Chilli",
  "Maize",
  "Groundnut",
  "Sugarcane",
  "Vegetables",
  "Pulses",
  "Millets",
  "Turmeric",
];

const SOIL_OPTIONS: { id: SoilType; label: string }[] = [
  { id: "black_cotton", label: "Black Cotton Soil (Regur)" },
  { id: "red_loam", label: "Red Sandy Loam Soil" },
  { id: "alluvial", label: "Alluvial Basin Soil" },
  { id: "sandy_loam", label: "Sandy Loam Soil" },
  { id: "clay", label: "Heavy Clay Soil" },
];

export default function ListLandModal({
  isOpen,
  onClose,
  onSuccess,
  existingListing,
}: ListLandModalProps) {
  const addMyLandListing = useCartStore((state) => state.addMyLandListing);
  const updateMyLandListing = useCartStore((state) => state.updateMyLandListing);
  const deliveryAddress = useCartStore((state) => state.deliveryAddress);

  const [title, setTitle] = useState("");
  const [acreage, setAcreage] = useState<number>(4.5);
  const [soilType, setSoilType] = useState<SoilType>("black_cotton");
  const [irrigation, setIrrigation] = useState("");
  const [waterAvailability, setWaterAvailability] = useState("Dedicated Borewell with 3-phase pump");
  const [suitableCrops, setSuitableCrops] = useState<string[]>(["Paddy", "Cotton"]);
  const [pricePerAcrePerYear, setPricePerAcrePerYear] = useState<number>(30000);
  const [rentalPeriod, setRentalPeriod] = useState("1 Year renewable lease");
  const [availability, setAvailability] = useState<"available" | "reserved" | "leased">("available");
  const [roadAccess, setRoadAccess] = useState("Direct Tractor Road with All-Weather Bund Track");
  const [fenced, setFenced] = useState(true);
  const [location, setLocation] = useState("");
  const [mandal, setMandal] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingListing) {
      setTitle(existingListing.title || "");
      setAcreage(existingListing.acreage || 4.5);
      setSoilType(existingListing.soilType || "black_cotton");
      setIrrigation(existingListing.irrigation || "");
      setWaterAvailability(existingListing.waterSource || "Dedicated Borewell with 3-phase pump");
      setSuitableCrops(existingListing.suitableCrops || ["Paddy", "Cotton"]);
      setPricePerAcrePerYear(existingListing.pricePerAcrePerYear || 30000);
      setRentalPeriod(existingListing.leaseTerms || "1 Year renewable lease");
      setAvailability(existingListing.availability || "available");
      setRoadAccess(existingListing.roadAccess || "Direct Tractor Road");
      setFenced(existingListing.fenced ?? true);
      setLocation(existingListing.location || "");
      setMandal(existingListing.mandal || "");
      setDistrict(existingListing.district || "");
      setDescription(existingListing.leaseTerms || "");
      setOwnerName(existingListing.ownerName || "");
      setOwnerPhone(existingListing.ownerPhone || "");
    } else {
      setTitle("Prime Irrigated Agricultural Farmland");
      setAcreage(4.5);
      setSoilType("black_cotton");
      setIrrigation("Dedicated Borewell + Canal Rights");
      setWaterAvailability("Dedicated Borewell with 3-phase pump");
      setSuitableCrops(["Paddy", "Cotton", "Chilli"]);
      setPricePerAcrePerYear(30000);
      setRentalPeriod("1 to 2 Years renewable lease • 20% advance security deposit");
      setAvailability("available");
      setRoadAccess("Direct Tractor Road Access with All-Weather Bund Track");
      setFenced(true);
      setLocation(
        deliveryAddress
          ? `${deliveryAddress.village}, ${deliveryAddress.mandal}`
          : "Madikonda, Kazipet"
      );
      setMandal(deliveryAddress?.mandal || "Kazipet");
      setDistrict(deliveryAddress?.district || "Warangal");
      setDescription("Highly fertile plot with continuous water rights, suitable for high-yield paddy and commercial crops.");
      setOwnerName(deliveryAddress?.fullName || "Ramesh Kumar Reddy");
      setOwnerPhone(deliveryAddress?.phone || "+91 98765 43210");
    }
    setErrors({});
  }, [existingListing, deliveryAddress, isOpen]);

  if (!isOpen) return null;

  const toggleCrop = (crop: string) => {
    setSuitableCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const getSoilTypeName = (type: SoilType) => {
    const found = SOIL_OPTIONS.find((s) => s.id === type);
    return found ? found.label : "Fertile Agricultural Soil";
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Land title is required";
    }

    if (!location.trim()) {
      newErrors.location = "Location / Village is required";
    }

    if (acreage <= 0 || isNaN(acreage)) {
      newErrors.acreage = "Acreage must be greater than 0";
    }

    if (!soilType) {
      newErrors.soilType = "Please select a valid soil type";
    }

    if (pricePerAcrePerYear <= 0 || isNaN(pricePerAcrePerYear)) {
      newErrors.pricePerAcrePerYear = "Annual rental price must be greater than ₹0";
    }

    if (!rentalPeriod.trim()) {
      newErrors.rentalPeriod = "Rental period / lease terms are required";
    }

    if (!availability) {
      newErrors.availability = "Availability status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const landId = existingListing?.id || `lnd-user-${Date.now()}`;

    const plotData: LandPlot = {
      id: landId,
      title: title.trim(),
      location: location.trim(),
      mandal: mandal.trim() || "Kazipet",
      district: district.trim() || "Warangal",
      state: "Telangana",
      acreage: Number(acreage),
      soilType,
      soilTypeName: getSoilTypeName(soilType),
      irrigation: irrigation.trim() || "Borewell with 3-phase power",
      suitableCrops: suitableCrops.length > 0 ? suitableCrops : ["Paddy", "Vegetables"],
      pricePerAcrePerYear: Number(pricePerAcrePerYear),
      pricePerSeason: Math.round(Number(pricePerAcrePerYear) / 2),
      roadAccess: roadAccess.trim() || "All-Weather Tractor Bund Road",
      leaseTerms: rentalPeriod.trim(),
      waterSource: waterAvailability.trim() || "Continuous Electric Borewell",
      fenced,
      verifiedOwner: existingListing?.verifiedOwner ?? false,
      verificationStatus: existingListing?.verificationStatus ?? "pending_verification",
      isActive: existingListing?.isActive !== undefined ? existingListing.isActive : true,
      ownerName: ownerName.trim() || "Ramesh Kumar Reddy",
      ownerPhone: ownerPhone.trim() || "+91 98765 43210",
      availability,
      isMyListing: true,
      featured: true,
    };

    if (existingListing) {
      updateMyLandListing(plotData);
    } else {
      addMyLandListing(plotData);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(plotData);
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-land-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#174D25]">
              <Trees size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="list-land-title"
                  className="text-base font-bold text-gray-900"
                >
                  {existingListing ? "Edit Farmland Listing" : "List Farmland for Lease"}
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  Landlord Mode
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Offer your agricultural plot for lease to verified local tenant farmers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
          {/* Status Notice */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Listing Status: Pending Verification</span>
                <p className="text-[11px] text-amber-800/90 mt-0.5">
                  Your listing will be visible in development mode. Government/revenue survey records will be verified upon formal tenant lease agreement.
                </p>
              </div>
            </div>
          </div>

          {/* Land Name / Title */}
          <div>
            <label htmlFor="land-title-input" className="block text-xs font-bold text-gray-700 mb-1">
              Farmland Title / Name *
            </label>
            <input
              id="land-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="e.g. Prime Irrigated Black Cotton Land"
              className={`h-10 w-full rounded-xl border bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:outline-none ${
                errors.title ? "border-rose-500" : "border-gray-200 focus:border-[#24833A]"
              }`}
            />
            {errors.title && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                <AlertCircle size={12} />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Location & Mandal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="land-loc-input" className="block text-xs font-bold text-gray-700 mb-1">
                Village Location *
              </label>
              <input
                id="land-loc-input"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
                }}
                placeholder="e.g. Madikonda"
                className={`h-10 w-full rounded-xl border bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:outline-none ${
                  errors.location ? "border-rose-500" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.location && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                  <AlertCircle size={12} />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="land-mandal-input" className="block text-xs font-bold text-gray-700 mb-1">
                Mandal & District
              </label>
              <input
                id="land-mandal-input"
                type="text"
                value={`${mandal}, ${district}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  setMandal(parts[0]?.trim() || "");
                  if (parts[1]) setDistrict(parts[1]?.trim() || "");
                }}
                placeholder="Kazipet, Warangal"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              />
            </div>
          </div>

          {/* Acreage & Soil Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="land-acre-input" className="block text-xs font-bold text-gray-700 mb-1">
                Total Acreage (Acres) *
              </label>
              <input
                id="land-acre-input"
                type="number"
                step="0.5"
                min="0.5"
                max="500"
                value={acreage}
                onChange={(e) => {
                  setAcreage(Number(e.target.value));
                  if (errors.acreage) setErrors((prev) => ({ ...prev, acreage: "" }));
                }}
                className={`h-10 w-full rounded-xl border bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:outline-none font-bold ${
                  errors.acreage ? "border-rose-500" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.acreage && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                  <AlertCircle size={12} />
                  <span>{errors.acreage}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="land-soil-input" className="block text-xs font-bold text-gray-700 mb-1">
                Soil Classification *
              </label>
              <select
                id="land-soil-input"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              >
                {SOIL_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Irrigation Source & Water Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="land-irrig-input" className="block text-xs font-bold text-gray-700 mb-1">
                Irrigation Source
              </label>
              <input
                id="land-irrig-input"
                type="text"
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                placeholder="e.g. Borewell + Canal Rights"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="land-water-input" className="block text-xs font-bold text-gray-700 mb-1">
                Water Availability
              </label>
              <input
                id="land-water-input"
                type="text"
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
                placeholder="e.g. Year-round 3-phase pump"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              />
            </div>
          </div>

          {/* Suitable Crops Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Suitable Recommended Crops
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CROPS_OPTIONS.map((crop) => {
                const selected = suitableCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => toggleCrop(crop)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer active:scale-95 ${
                      selected
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {crop}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rental Price & Rental Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="land-price-input" className="block text-xs font-bold text-gray-700 mb-1">
                Annual Rental Price (₹/acre/year) *
              </label>
              <input
                id="land-price-input"
                type="number"
                step="500"
                min="5000"
                max="200000"
                value={pricePerAcrePerYear}
                onChange={(e) => {
                  setPricePerAcrePerYear(Number(e.target.value));
                  if (errors.pricePerAcrePerYear) setErrors((prev) => ({ ...prev, pricePerAcrePerYear: "" }));
                }}
                className={`h-10 w-full rounded-xl border bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:outline-none font-bold text-[#174D25] ${
                  errors.pricePerAcrePerYear ? "border-rose-500" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.pricePerAcrePerYear && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                  <AlertCircle size={12} />
                  <span>{errors.pricePerAcrePerYear}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="land-period-input" className="block text-xs font-bold text-gray-700 mb-1">
                Rental Period / Lease Terms *
              </label>
              <input
                id="land-period-input"
                type="text"
                value={rentalPeriod}
                onChange={(e) => {
                  setRentalPeriod(e.target.value);
                  if (errors.rentalPeriod) setErrors((prev) => ({ ...prev, rentalPeriod: "" }));
                }}
                placeholder="e.g. 1 Year renewable lease"
                className={`h-10 w-full rounded-xl border bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:outline-none ${
                  errors.rentalPeriod ? "border-rose-500" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.rentalPeriod && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                  <AlertCircle size={12} />
                  <span>{errors.rentalPeriod}</span>
                </p>
              )}
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Plot Lease Availability *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAvailability("available")}
                className={`rounded-xl p-2 text-center text-xs font-bold border transition cursor-pointer ${
                  availability === "available"
                    ? "bg-emerald-50 border-[#24833A] text-[#174D25] shadow-2xs"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                ● Available
              </button>

              <button
                type="button"
                onClick={() => setAvailability("reserved")}
                className={`rounded-xl p-2 text-center text-xs font-bold border transition cursor-pointer ${
                  availability === "reserved"
                    ? "bg-amber-50 border-amber-400 text-amber-900 shadow-2xs"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                ◐ Reserved
              </button>

              <button
                type="button"
                onClick={() => setAvailability("leased")}
                className={`rounded-xl p-2 text-center text-xs font-bold border transition cursor-pointer ${
                  availability === "leased"
                    ? "bg-gray-200 border-gray-400 text-gray-800 shadow-2xs"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                ○ Leased Out
              </button>
            </div>
          </div>

          {/* Road Access & Description */}
          <div>
            <label htmlFor="land-road-input" className="block text-xs font-bold text-gray-700 mb-1">
              Road Access & Machinery Capability
            </label>
            <input
              id="land-road-input"
              type="text"
              value={roadAccess}
              onChange={(e) => setRoadAccess(e.target.value)}
              placeholder="e.g. Direct Tractor Road with Bund Track"
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
            />
          </div>

          {/* Owner Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="land-owner-input" className="block text-xs font-bold text-gray-700 mb-1">
                Landowner Name
              </label>
              <input
                id="land-owner-input"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="land-phone-input" className="block text-xs font-bold text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                id="land-phone-input"
                type="tel"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer disabled:bg-gray-300"
            >
              <CheckCircle2 size={15} />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : existingListing
                  ? "Update Listing"
                  : "Submit & List Land"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
