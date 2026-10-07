"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Landmark,
  CheckCircle2,
  Lock,
  MapPin,
  Sparkles,
  Info,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/store/cart-store";
import { PaymentMethodType } from "@/types/marketplace";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

interface PaymentOptionDef {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function PaymentPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const deliveryAddress = useCartStore((state) => state.deliveryAddress);
  const getItemsCount = useCartStore((state) => state.getItemsCount);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const placeOrder = useCartStore((state) => state.placeOrder);

  const totalAmount = getTotalAmount();
  const itemsCount = getItemsCount();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty and not processing, redirect back to cart
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.replace("/dashboard/marketplace/cart");
    }
  }, [items.length, isProcessing, router]);

  const paymentOptions: PaymentOptionDef[] = [
    {
      id: "upi",
      title: "UPI / QR Code",
      subtitle: "Google Pay, PhonePe, Paytm, BHIM UPI (Instant)",
      icon: <QrCode className="h-6 w-6 text-[#24833A]" />,
      badge: "Fastest & Recommended",
    },
    {
      id: "cod",
      title: "Cash on Delivery (COD)",
      subtitle: "Pay cash or UPI upon delivery at your farm gate",
      icon: <Banknote className="h-6 w-6 text-emerald-700" />,
      badge: "Popular with Farmers",
    },
    {
      id: "card",
      title: "Credit / Debit / ATM Card",
      subtitle: "RuPay, Visa, MasterCard (No CVV required in demo mode)",
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
    },
    {
      id: "kcc",
      title: "Kisan Credit Card (KCC) / Agri Pay",
      subtitle: "Government subsidized crop loan credit line settlement",
      icon: <Landmark className="h-6 w-6 text-amber-700" />,
      badge: "Govt Subsidized",
    },
  ];

  const handleProcessOrder = () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const selectedDef = paymentOptions.find((p) => p.id === selectedMethod);
    const methodLabel = selectedDef?.title || "UPI";

    setTimeout(() => {
      const order = placeOrder(selectedMethod, methodLabel);
      router.push(`/dashboard/marketplace/order-confirmation?orderId=${order.id}`);
    }, 600);
  };

  if (items.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/marketplace/cart" label="Back to Shopping Cart" />

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          <Lock size={13} className="text-[#24833A]" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-gray-900">
            Payment Options
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Choose your preferred payment method for {itemsCount} item{itemsCount > 1 ? "s" : ""}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-gray-400">Total Payable</span>
          <p className="text-base sm:text-xl font-extrabold text-[#174D25]">
            ₹{totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Development Safety Disclaimer Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold">Development Mode Notice</span>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            This is a frontend development demo. No real monetary transactions or bank credentials
            will be processed. Selecting an option completes the demo order flow.
          </p>
        </div>
      </div>

      {/* Delivery Summary Review */}
      <div className="rounded-3xl border border-gray-200/90 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
          <MapPin size={15} className="text-[#24833A]" />
          <span>Delivering To Farm Gate:</span>
        </div>
        <p className="mt-1 text-xs text-gray-600 pl-6">
          <span className="font-semibold text-gray-900">{deliveryAddress.fullName}</span> •{" "}
          {deliveryAddress.street}, {deliveryAddress.village}, {deliveryAddress.district} -{" "}
          {deliveryAddress.pincode}
        </p>
      </div>

      {/* Payment Options Selection Cards */}
      <div className="flex flex-col gap-3">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedMethod(opt.id)}
              className={`flex items-center justify-between gap-3.5 rounded-3xl border p-4 sm:p-5 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#24833A] bg-[#F7F9F6] shadow-sm ring-1 ring-[#24833A]"
                  : "border-gray-200/90 bg-white hover:border-gray-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                    isSelected ? "bg-[#E4F0DD] text-[#24833A]" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {opt.title}
                    </span>
                    {opt.badge && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-[#24833A]">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500 font-medium leading-snug">
                    {opt.subtitle}
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? "border-[#24833A] bg-[#24833A] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay CTA Button */}
      <div className="mt-2 rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleProcessOrder}
          isLoading={isProcessing}
          leftIcon={!isProcessing ? <ShieldCheck size={18} /> : undefined}
        >
          {isProcessing
            ? "Confirming Order..."
            : selectedMethod === "cod"
            ? `Confirm Order (Cash on Delivery) • ₹${totalAmount.toLocaleString("en-IN")}`
            : `Pay ₹${totalAmount.toLocaleString("en-IN")} Now`}
        </Button>

        <p className="mt-2 text-center text-[10px] text-gray-400">
          By placing this order, you confirm agricultural delivery to your farm location.
        </p>
      </div>
    </div>
  );
}
