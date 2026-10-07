"use client";

import React, { useState } from "react";
import {
  Trees,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  Trash2,
  Sparkles,
  Eye,
  Edit,
  Clock,
  Power,
  Droplets,
} from "lucide-react";
import { LandPlot } from "@/types/land";
import { useCartStore } from "@/store/cart-store";
import ListLandModal from "./ListLandModal";
import LandThumbnail from "./LandThumbnail";

interface LandProviderViewProps {
  onSwitchToRent: () => void;
}

export default function LandProviderView({
  onSwitchToRent,
}: LandProviderViewProps) {
  const myLandListings = useCartStore((state) => state.myLandListings || []);
  const removeMyLandListing = useCartStore((state) => state.removeMyLandListing);
  const toggleMyLandListingActive = useCartStore((state) => state.toggleMyLandListingActive);
  const updateMyLandListingAvailability = useCartStore((state) => state.updateMyLandListingAvailability);
  const updateMyLandListing = useCartStore((state) => state.updateMyLandListing);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<LandPlot | null>(null);

  const handleOpenEdit = (land: LandPlot) => {
    setEditingLand(land);
    setIsListModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsListModalOpen(false);
    setEditingLand(null);
  };

  const handleToggleDemoVerified = (land: LandPlot) => {
    const isVerified = land.verificationStatus === "verified" || land.verifiedOwner;
    const newStatus = isVerified ? "pending_verification" : "verified";
    updateMyLandListing({
      ...land,
      verificationStatus: newStatus,
      verifiedOwner: newStatus === "verified",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#174D25] shadow-xs">
            <Trees size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Landlord & Lease Management
              </h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                Provider Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              List and manage your agricultural land plots for verified local tenant farmers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingLand(null);
            setIsListModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4.5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>List Land for Lease</span>
        </button>
      </div>

      {myLandListings.length === 0 ? (
        /* Empty / Onboarding State */
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="text-center py-6 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A] mb-3">
              <Trees size={32} />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No Farmland Listed for Lease Yet
            </h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
              Earn regular rental income by leasing your surplus agricultural acreage to verified local farmers with clear seasonal or annual contracts.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingLand(null);
                setIsListModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Your First Land Listing</span>
            </button>
          </div>

          {/* Three Key Benefits */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-5">
            <div className="rounded-2xl bg-[#F7F9F6] p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1">
                <ShieldCheck size={16} />
                <span>Verified Tenants</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Receive proposals only from verified farmers with demonstrated farming background.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F9F6] p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1">
                <CheckCircle2 size={16} />
                <span>Standard Lease Terms</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Define your annual rent, advance security deposit, and approved crop categories upfront.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F9F6] p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1">
                <Calendar size={16} />
                <span>Immediate Discovery</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your land listing appears live in the Land for Rent marketplace for all local farmers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Listings Grid */
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
            <span>Your Farmland Listings ({myLandListings.length})</span>
            <button
              type="button"
              onClick={onSwitchToRent}
              className="inline-flex items-center gap-1 text-[#24833A] hover:underline cursor-pointer"
            >
              <Eye size={13} />
              <span>View in Rental Catalog</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {myLandListings.map((land) => {
              const isActive = land.isActive !== false;
              const isVerified = land.verificationStatus === "verified" || land.verifiedOwner;

              return (
                <div
                  key={land.id}
                  className={`overflow-hidden rounded-3xl border bg-white shadow-2xs transition flex flex-col justify-between ${
                    isActive ? "border-gray-200 hover:border-[#24833A]/40" : "border-gray-200 opacity-80 bg-gray-50/50"
                  }`}
                >
                  <div className="p-3 pb-0">
                    <LandThumbnail
                      soilType={land.soilType}
                      title={land.title}
                      className="h-32 w-full"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      {/* Title & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <MapPin size={13} className="text-[#24833A]" />
                            <span>{land.location}, {land.district}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">
                            {land.title}
                          </h3>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] flex-shrink-0">
                          Your Listing
                        </span>
                      </div>

                      {/* Status Badges: Verification & Active/Inactive */}
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                            <ShieldCheck size={11} />
                            <span>Verified Plot</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.2 text-[9px] font-bold text-amber-800 border border-amber-200">
                            <Clock size={11} />
                            <span>Pending Verification</span>
                          </span>
                        )}

                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-bold text-[#24833A]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#24833A]" />
                            <span>Active in Catalog</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.2 text-[9px] font-bold text-gray-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>Deactivated (Hidden)</span>
                          </span>
                        )}
                      </div>

                      {/* Specs Summary Row */}
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs border border-gray-100">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">
                            Acreage
                          </span>
                          <span className="font-extrabold text-gray-900">
                            {land.acreage} Acres
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">
                            Soil
                          </span>
                          <span className="font-bold text-gray-800">
                            {land.soilTypeName.split(" ")[0]}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">
                            Annual Rent
                          </span>
                          <span className="font-extrabold text-[#174D25]">
                            ₹{land.pricePerAcrePerYear.toLocaleString("en-IN")}/ac
                          </span>
                        </div>
                      </div>

                      {/* Irrigation */}
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-600 truncate">
                        <Droplets size={12} className="text-[#24833A] flex-shrink-0" />
                        <span className="truncate">{land.irrigation}</span>
                      </div>
                    </div>

                    {/* Footer Actions: Availability selector, Edit, Deactivate, Remove */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="text-[10px] font-medium text-gray-400">
                          Availability:
                        </span>

                        <div className="flex items-center gap-1">
                          {(["available", "reserved", "leased"] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateMyLandListingAvailability(land.id, status)}
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold capitalize transition cursor-pointer ${
                                land.availability === status
                                  ? "bg-[#24833A] text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          {/* Deactivate / Reactivate Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleMyLandListingActive(land.id)}
                            className={`inline-flex items-center gap-1 text-xs font-bold cursor-pointer ${
                              isActive
                                ? "text-amber-700 hover:text-amber-800"
                                : "text-emerald-700 hover:text-emerald-800"
                            }`}
                          >
                            <Power size={12} />
                            <span>{isActive ? "Deactivate" : "Reactivate"}</span>
                          </button>

                          {/* Edit Action */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(land)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 cursor-pointer"
                          >
                            <Edit size={12} />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDemoVerified(land)}
                            className="text-[10px] text-gray-400 hover:text-gray-700 underline cursor-pointer"
                          >
                            {isVerified ? "Set Pending" : "Set Verified"}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeMyLandListing(land.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer p-1"
                            title="Remove Listing"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List / Edit Land Modal */}
      <ListLandModal
        isOpen={isListModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
        existingListing={editingLand}
      />
    </div>
  );
}
