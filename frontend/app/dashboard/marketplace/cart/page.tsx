"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  MapPin,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/store/cart-store";
import ProductThumbnail from "@/components/marketplace/ProductThumbnail";
import { DeliveryAddress } from "@/types/marketplace";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

export default function CartPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const deliveryAddress = useCartStore((state) => state.deliveryAddress);
  const setDeliveryAddress = useCartStore((state) => state.setDeliveryAddress);

  const getItemsTotal = useCartStore((state) => state.getItemsTotal);
  const getDeliveryCharge = useCartStore((state) => state.getDeliveryCharge);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);

  const itemsTotal = getItemsTotal();
  const deliveryCharge = getDeliveryCharge();
  const totalAmount = getTotalAmount();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<DeliveryAddress>({ ...deliveryAddress });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryAddress(addressForm);
    setIsAddressModalOpen(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/marketplace" label="Back to Marketplace" />

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Title Banner */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A]">
            <ShoppingBag size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {items.length === 0
                ? "Your cart is empty"
                : `${items.length} unique item${items.length > 1 ? "s" : ""} ready for checkout`}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-[#24833A]">
            Total: ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200/90 bg-white p-10 text-center shadow-2xs">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E4F0DD] text-[#24833A]">
            <ShoppingBag size={38} strokeWidth={2} />
          </div>
          <div className="max-w-xs">
            <h2 className="text-base font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-xs text-gray-500">
              Explore certified seeds, fertilizers, farm tools and machinery in our marketplace.
            </p>
          </div>
          <Link
            href="/dashboard/marketplace"
            className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-[#24833A] px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition active:scale-95 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Delivery Address Card */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <MapPin size={16} className="text-[#24833A]" />
                <span>Delivery Address (Farm Location)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddressForm({ ...deliveryAddress });
                  setIsAddressModalOpen(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
              >
                <Edit2 size={12} />
                <span>Change</span>
              </button>
            </div>

            <div className="mt-2.5 rounded-2xl bg-gray-50/80 p-3 text-xs text-gray-700">
              <p className="font-bold text-gray-900">
                {deliveryAddress.fullName} • <span className="font-normal text-gray-600">+91 {deliveryAddress.phone}</span>
              </p>
              <p className="mt-1 text-gray-600">
                {deliveryAddress.street}, {deliveryAddress.village}, {deliveryAddress.mandal},{" "}
                {deliveryAddress.district}, {deliveryAddress.state} - {deliveryAddress.pincode}
              </p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-3xl border border-gray-200/90 bg-white p-4 shadow-2xs"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Compact Image */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                      <ProductThumbnail product={item.product} size="sm" />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-[#24833A]">
                          {item.product.badge}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          {item.product.category}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard/marketplace/${item.product.id}`}
                        className="mt-1 text-xs sm:text-sm font-bold text-gray-900 hover:text-[#24833A] transition-colors"
                      >
                        {item.product.name}
                      </Link>

                      <span className="text-[11px] text-gray-500">
                        ₹{item.product.price.toLocaleString("en-IN")} / {item.product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity Picker */}
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white active:scale-95 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white active:scale-95 disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-xs sm:text-sm font-extrabold text-[#174D25]">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition active:scale-95 cursor-pointer"
                      title="Remove product"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Card */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Order Summary
            </h2>

            <div className="mt-3 flex flex-col gap-2.5 text-xs text-gray-700">
              <div className="flex items-center justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900">
                  ₹{itemsTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span>Farm Delivery Charges</span>
                  {deliveryCharge === 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.2 text-[10px] font-bold text-[#24833A]">
                      Free Over ₹1,000
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-900">
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm sm:text-base font-extrabold">
                <span className="text-gray-900">Total Amount Payable</span>
                <span className="text-[#174D25]">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Proceed to Payment CTA */}
            <div className="mt-5">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push("/dashboard/marketplace/payment")}
                rightIcon={<ArrowRight size={16} />}
              >
                Proceed to Payment • ₹{totalAmount.toLocaleString("en-IN")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isAddressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsAddressModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">
                Update Farm Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Farmer / Recipient Full Name
                </label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number (10 digits)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Farm Gate / Survey No. / Street
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    value={addressForm.village}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, village: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mandal / Tehsil
                  </label>
                  <input
                    type="text"
                    value={addressForm.mandal}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, mandal: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, district: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, pincode: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
