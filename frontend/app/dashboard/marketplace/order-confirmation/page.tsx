"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Store,
  MapPin,
  Calendar,
  Check,
  Clock,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/store/cart-store";
import { MarketplaceOrder } from "@/types/marketplace";
import { Button } from "@/components/ui/Button";

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const orders = useCartStore((state) => state.orders);
  const getOrderById = useCartStore((state) => state.getOrderById);

  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) {
        setOrder(found);
        return;
      }
    }
    // Fallback to most recent order if no query or ID not found
    if (orders.length > 0) {
      setOrder(orders[0]);
    }
  }, [orderId, getOrderById, orders]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Success Hero Card */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 text-center shadow-2xs">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] shadow-xs animate-in zoom-in-75 duration-300">
          <CheckCircle2 size={40} className="sm:h-12 sm:w-12" strokeWidth={2.4} />
        </div>

        <span className="mt-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#24833A]">
          Order Confirmed
        </span>

        <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
          Thank you for choosing RaituSevak360. Your certified agricultural inputs are being
          prepared by the verified supplier for direct farm gate delivery.
        </p>

        {order && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-2 border border-gray-200/80">
            <span className="text-xs text-gray-500 font-medium">Order Reference:</span>
            <span className="text-xs font-mono font-extrabold text-gray-900">
              {order.id}
            </span>
          </div>
        )}
      </div>

      {order && (
        <div className="flex flex-col gap-4">
          {/* Delivery & Timeline Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                <Calendar size={15} className="text-[#24833A]" />
                <span>Estimated Farm Delivery</span>
              </div>
              <p className="text-sm font-extrabold text-[#174D25]">
                {order.estimatedDeliveryDate}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Standard dispatch within 48 hours
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                <ShieldCheck size={15} className="text-[#24833A]" />
                <span>Payment Method</span>
              </div>
              <p className="text-sm font-extrabold text-gray-900">
                {order.paymentMethodLabel}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Status: {order.paymentMethod === "cod" ? "Pay upon Delivery" : "Paid"}
              </p>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
              <MapPin size={15} className="text-[#24833A]" />
              <span>Delivering To Farm Gate</span>
            </div>
            <p className="text-xs font-bold text-gray-800">
              {order.address.fullName} • +91 {order.address.phone}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {order.address.street}, {order.address.village}, {order.address.mandal},{" "}
              {order.address.district}, {order.address.state} - {order.address.pincode}
            </p>
          </div>

          {/* Order Summary & Products Breakdown */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Items Ordered ({order.items.length})
            </h2>

            <div className="mt-3 flex flex-col divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{item.product.name}</span>
                    <span className="text-[11px] text-gray-500 ml-2">
                      (Qty: {item.quantity})
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{order.itemsTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-gray-800">
                  {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm sm:text-base font-extrabold text-[#174D25]">
                <span>Total Amount Paid</span>
                <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={() => setIsTrackModalOpen(true)}
          leftIcon={<Truck size={17} />}
          className="w-full"
        >
          Track Order
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/dashboard/marketplace")}
          leftIcon={<Store size={17} />}
          className="w-full"
        >
          Continue Shopping
        </Button>
      </div>

      {/* Track Order Timeline Modal */}
      {isTrackModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsTrackModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Track Farm Shipment</h3>
                <span className="text-[11px] font-mono text-[#24833A]">
                  {order?.id || "RS360-ORD"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTrackModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tracking Status Steps */}
            <div className="mt-5 flex flex-col gap-4">
              {[
                {
                  title: "Order Placed",
                  desc: "Your order details have been received.",
                  status: "completed",
                  time: "Today, Just now",
                },
                {
                  title: "Supplier Verification & Packing",
                  desc: "Certified seeds & inputs packed with batch numbers.",
                  status: "completed",
                  time: "Today",
                },
                {
                  title: "Dispatched & In Transit",
                  desc: "Rural logistics partner heading towards your mandal.",
                  status: "active",
                  time: "In progress",
                },
                {
                  title: "Out for Farm Delivery",
                  desc: "Local agent delivering directly to your farm gate.",
                  status: "pending",
                  time: order?.estimatedDeliveryDate || "Expected in 2 days",
                },
              ].map((step, sIdx) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";

                return (
                  <div key={sIdx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted
                            ? "bg-[#24833A] text-white"
                            : isActive
                            ? "border-2 border-[#24833A] bg-emerald-50 text-[#24833A] ring-4 ring-emerald-100"
                            : "border border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? <Check size={14} /> : sIdx + 1}
                      </div>
                      {sIdx < 3 && (
                        <div
                          className={`w-0.5 h-8 my-1 ${
                            isCompleted ? "bg-[#24833A]" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isActive
                              ? "text-[#174D25]"
                              : isCompleted
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] text-gray-400">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsTrackModalOpen(false)}
              >
                Close Tracking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
