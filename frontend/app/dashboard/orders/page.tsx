"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Eye,
  X,
  Check,
  ArrowRight,
  Store,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useSellerStore } from "@/store/seller-store";
import { MarketplaceOrder } from "@/types/marketplace";
import { SellerOrder, SellerFulfillmentStatus } from "@/types/seller";
import { INITIAL_SELLER_ORDERS } from "@/services/seller";
import { UserRole } from "@/types";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);

  const orders = useCartStore((state) => state.orders);

  // Seller store orders (reactively subscribed to seller store dispatches)
  const storeSellerOrders = useSellerStore((state) => state.orders);
  const updateSellerOrderStatus = useSellerStore((state) => state.updateOrderStatus);
  const sellerOrders: SellerOrder[] =
    storeSellerOrders && storeSellerOrders.length > 0
      ? storeSellerOrders
      : INITIAL_SELLER_ORDERS;

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<MarketplaceOrder | null>(null);
  const [selectedSellerOrder, setSelectedSellerOrder] = useState<SellerOrder | null>(null);

  // Tab for users who might switch roles
  const [activeTab, setActiveTab] = useState<"farmer" | "seller">(
    activeRole === "seller" ? "seller" : "farmer"
  );

  const getStatusBadge = (status: MarketplaceOrder["status"]) => {
    switch (status) {
      case "placed":
        return {
          label: "Order Placed",
          color: "bg-emerald-50 text-[#174D25] border-emerald-200",
          icon: <Clock size={12} />,
        };
      case "packed":
        return {
          label: "Packed",
          color: "bg-blue-50 text-blue-800 border-blue-200",
          icon: <Package size={12} />,
        };
      case "shipped":
        return {
          label: "In Transit",
          color: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <Truck size={12} />,
        };
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: <CheckCircle2 size={12} />,
        };
      default:
        return {
          label: "Confirmed",
          color: "bg-emerald-50 text-[#174D25] border-emerald-200",
          icon: <Check size={12} />,
        };
    }
  };

  const fulfillmentSteps: {
    status: SellerFulfillmentStatus;
    label: string;
    description: string;
  }[] = [
    {
      status: "Ready for Dispatch",
      label: "Ready for Dispatch",
      description: "Order placed by farmer. Verified and awaiting packaging.",
    },
    {
      status: "Packed",
      label: "Packed",
      description: "Inputs quality checked, tagged with batch code, and securely packed.",
    },
    {
      status: "Dispatched",
      label: "Dispatched",
      description: "Handed over to rural logistics / agri-carrier in transit to farm.",
    },
    {
      status: "Delivered",
      label: "Delivered",
      description: "Consignment safely delivered to the farmer's designated address.",
    },
  ];

  const getStepIndex = (status: SellerFulfillmentStatus): number => {
    switch (status) {
      case "Ready for Dispatch":
        return 0;
      case "Packed":
        return 1;
      case "Dispatched":
      case "In Transit":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const getSellerBadge = (status: SellerFulfillmentStatus) => {
    switch (status) {
      case "Ready for Dispatch":
        return {
          label: "Ready for Dispatch",
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "Packed":
        return {
          label: "Packed",
          color: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "Dispatched":
      case "In Transit":
        return {
          label: status === "In Transit" ? "In Transit" : "Dispatched",
          color: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "Delivered":
        return {
          label: "Delivered",
          color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "Cancelled":
        return {
          label: "Cancelled",
          color: "bg-rose-50 text-rose-800 border-rose-200",
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  const handleUpdateSellerStatus = (orderId: string, nextStatus: SellerFulfillmentStatus) => {
    updateSellerOrderStatus(orderId, nextStatus);
    setSelectedSellerOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      const b = getSellerBadge(nextStatus);
      return {
        ...prev,
        status: nextStatus,
        badgeColor: b.color,
      };
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          id="orders-back-link"
          href={activeRole === "seller" || activeTab === "seller" ? "/dashboard" : "/dashboard/profile"}
          label={
            activeRole === "seller" || activeTab === "seller"
              ? t("common.backToDashboard") || "Back to Dashboard"
              : "Back to Profile"
          }
        />

        <Link
          href="/dashboard/marketplace"
          className="text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
        >
          Marketplace Store →
        </Link>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <ShoppingBag size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {activeTab === "farmer" ? "My Orders" : "Orders Management"}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                {activeTab === "farmer" ? "Purchases" : "Seller Hub"}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {activeTab === "farmer"
                ? "Track purchased seeds, fertilizers & doorstep delivery"
                : "Manage outgoing customer orders, dispatches & revenue"}
            </p>
          </div>
        </div>

        {/* Total Orders Metric Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Orders</span>
            <p className="text-sm font-extrabold text-[#174D25]">
              {activeTab === "farmer" ? orders.length : sellerOrders.length}
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher Tabs (If Dual Role Farmer/Seller) */}
      {(activeRole === "seller" || activeRole === "farmer") && (
        <div className="flex items-center gap-2 rounded-xl bg-gray-100/80 p-1.5 w-full sm:w-fit overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("farmer")}
            className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap text-center ${
              activeTab === "farmer"
                ? "bg-white text-[#174D25] shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            My Farm Purchases ({orders.length})
          </button>

          {activeRole === "seller" && (
            <button
              type="button"
              onClick={() => setActiveTab("seller")}
              className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap text-center ${
                activeTab === "seller"
                  ? "bg-white text-[#174D25] shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Seller Dispatches ({sellerOrders.length})
            </button>
          )}
        </div>
      )}

      {/* TAB 1: FARMER MY ORDERS */}
      {activeTab === "farmer" && (
        <>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
                <ShoppingBag size={32} />
              </div>
              <div className="max-w-xs">
                <h2 className="text-base font-bold text-gray-900">No orders yet</h2>
                <p className="mt-1 text-xs text-gray-500">
                  You haven&apos;t placed any orders in the marketplace yet. Explore certified
                  seeds and organic fertilizers.
                </p>
              </div>
              <Link
                href="/dashboard/marketplace"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition active:scale-95 cursor-pointer"
              >
                <span>Start Shopping</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {orders.map((ord) => {
                const statusMeta = getStatusBadge(ord.status);
                const orderDate = new Date(ord.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={ord.id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/40"
                  >
                    {/* Header Row: ID, Date & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-extrabold text-gray-900">
                          {ord.id}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-2">{orderDate}</span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta.color}`}
                      >
                        {statusMeta.icon}
                        <span>{statusMeta.label}</span>
                      </span>
                    </div>

                    {/* Products Row */}
                    <div className="mt-3 flex flex-col gap-1.5">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-800 line-clamp-1">
                            {item.product.name}
                          </span>
                          <span className="text-gray-500 shrink-0 ml-2">
                            Qty: {item.quantity} • ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Row: Total, Address & Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">
                          Total Amount Paid
                        </span>
                        <p className="text-base font-extrabold text-[#174D25]">
                          ₹{ord.totalAmount.toLocaleString("en-IN")}
                          <span className="text-[11px] font-normal text-gray-500 ml-2">
                            ({ord.paymentMethodLabel})
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedOrder(ord)}
                          leftIcon={<Eye size={13} />}
                        >
                          View Order
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setTrackingOrder(ord)}
                          leftIcon={<Truck size={13} />}
                        >
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: SELLER ORDERS MANAGEMENT */}
      {activeTab === "seller" && (
        <div className="flex flex-col gap-3">
          {sellerOrders.map((ord) => {
            const badge = getSellerBadge(ord.status);
            return (
              <div
                key={ord.id}
                onClick={() => setSelectedSellerOrder(ord)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40 hover:shadow-xs cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-[#24833A] border border-gray-100 group-hover:bg-[#E4F0DD] transition">
                    <Truck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{ord.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <h2 className="mt-1 text-xs font-medium text-gray-800">{ord.customer}</h2>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{ord.items}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <span className="text-sm font-extrabold text-[#174D25]">{ord.amount}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-medium">{ord.date}</span>
                    <span className="inline-flex items-center text-[11px] font-bold text-[#24833A] group-hover:underline">
                      View <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedOrder(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Order Details</h3>
                <span className="font-mono text-xs font-bold text-[#24833A]">
                  {selectedOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 text-xs text-gray-700">
              {/* Delivery Destination */}
              <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                <span className="font-bold text-gray-900 block mb-1">
                  Delivery Destination
                </span>
                <p className="font-medium text-gray-800">
                  {selectedOrder.address.fullName} • +91 {selectedOrder.address.phone}
                </p>
                <p className="text-gray-500 mt-0.5">
                  {selectedOrder.address.street}, {selectedOrder.address.village},{" "}
                  {selectedOrder.address.district} - {selectedOrder.address.pincode}
                </p>
              </div>

              {/* Items Ordered List */}
              <div>
                <span className="font-bold text-gray-900 block mb-2">
                  Items Ordered ({selectedOrder.items.length})
                </span>
                <div className="flex flex-col divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{item.product.name}</p>
                        <p className="text-[11px] text-gray-500">
                          ₹{item.product.price} × {item.quantity} {item.product.unit}
                        </p>
                      </div>
                      <span className="font-extrabold text-[#174D25]">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Totals */}
              <div className="rounded-xl border border-gray-100 p-3.5 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-semibold">{selectedOrder.paymentMethodLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Delivery:</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedOrder.estimatedDeliveryDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Items Subtotal:</span>
                  <span className="font-semibold">
                    ₹{selectedOrder.itemsTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Charges:</span>
                  <span className="font-semibold">
                    {selectedOrder.deliveryCharge === 0 ? "FREE" : `₹${selectedOrder.deliveryCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm text-[#174D25]">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const ord = selectedOrder;
                  setSelectedOrder(null);
                  setTrackingOrder(ord);
                }}
              >
                Track Shipment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Track Order Modal */}
      {trackingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setTrackingOrder(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Track Farm Shipment</h3>
                <span className="text-[11px] font-mono text-[#24833A]">
                  {trackingOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tracking Status Timeline */}
            <div className="mt-5 flex flex-col gap-4">
              {[
                {
                  title: "Order Placed",
                  desc: "Order confirmed and transmitted to agricultural supplier.",
                  status: "completed",
                  time: "Order Confirmed",
                },
                {
                  title: "Supplier Verification & Packing",
                  desc: "Certified seeds & inputs packed with batch numbers.",
                  status: "completed",
                  time: "Packed",
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
                  time: trackingOrder.estimatedDeliveryDate,
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
                onClick={() => setTrackingOrder(null)}
              >
                Close Tracking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Order Details & Fulfillment Modal */}
      {selectedSellerOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedSellerOrder(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">Seller Dispatch Order</h3>
                  {(() => {
                    const badge = getSellerBadge(selectedSellerOrder.status);
                    return (
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${badge.color}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
                <span className="font-mono text-xs font-bold text-[#24833A]">
                  {selectedSellerOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSellerOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 text-xs text-gray-700">
              {/* Buyer / Farmer Info */}
              <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                <span className="font-bold text-gray-900 block mb-1">
                  Buyer / Farmer Information
                </span>
                <p className="font-medium text-gray-800">
                  {selectedSellerOrder.customer}
                  {selectedSellerOrder.customerPhone ? ` • +91 ${selectedSellerOrder.customerPhone}` : ""}
                </p>
                {selectedSellerOrder.date && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Order Date: {selectedSellerOrder.date}
                  </p>
                )}
              </div>

              {/* Delivery Address */}
              {selectedSellerOrder.deliveryAddress && (
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-1">
                    Delivery Destination
                  </span>
                  <p className="font-medium text-gray-800">
                    {selectedSellerOrder.deliveryAddress.fullName} • +91 {selectedSellerOrder.deliveryAddress.phone}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {selectedSellerOrder.deliveryAddress.street}, {selectedSellerOrder.deliveryAddress.village},{" "}
                    {selectedSellerOrder.deliveryAddress.mandal}
                  </p>
                  <p className="text-gray-600">
                    {selectedSellerOrder.deliveryAddress.district}, {selectedSellerOrder.deliveryAddress.state} -{" "}
                    {selectedSellerOrder.deliveryAddress.pincode}
                  </p>
                </div>
              )}

              {/* Fulfillment Progress Timeline */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-3">
                  Fulfillment Lifecycle
                </span>
                <div className="flex flex-col gap-2.5">
                  {fulfillmentSteps.map((step, idx) => {
                    const stepOrder = getStepIndex(step.status);
                    const currentOrder = getStepIndex(selectedSellerOrder.status);
                    const isCompleted = currentOrder > stepOrder || (selectedSellerOrder.status === "Delivered" && step.status === "Delivered");
                    const isCurrent = currentOrder === stepOrder && selectedSellerOrder.status !== "Delivered";
                    const isStepDeliveredDone = selectedSellerOrder.status === "Delivered" && step.status === "Delivered";

                    return (
                      <div key={step.status} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                              isCompleted || isStepDeliveredDone
                                ? "bg-[#24833A] text-white"
                                : isCurrent
                                ? "border-2 border-[#24833A] bg-white text-[#24833A] ring-3 ring-emerald-100 shadow-2xs"
                                : "border border-gray-200 bg-white text-gray-400"
                            }`}
                          >
                            {isCompleted || isStepDeliveredDone ? (
                              <Check size={13} strokeWidth={2.8} />
                            ) : isCurrent ? (
                              <span className="h-2 w-2 rounded-full bg-[#24833A]" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          {idx < fulfillmentSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-5 my-0.5 ${
                                currentOrder > idx ? "bg-[#24833A]" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1 pb-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? "text-[#174D25]"
                                  : isCompleted || isStepDeliveredDone
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-extrabold text-[#24833A] bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                Current Stage
                              </span>
                            )}
                            {isStepDeliveredDone && (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details */}
              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#174D25]">Payment Information</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
                    {selectedSellerOrder.paymentStatus || "Paid"}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">
                  Method: <span className="font-semibold">{selectedSellerOrder.paymentMethod || "UPI / Direct"}</span>
                </p>
              </div>

              {/* Ordered Items List */}
              <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
                <span className="font-bold text-gray-900 block mb-2">
                  Ordered Products ({selectedSellerOrder.lineItems?.length || 1})
                </span>
                <div className="flex flex-col gap-2.5">
                  {selectedSellerOrder.lineItems && selectedSellerOrder.lineItems.length > 0 ? (
                    selectedSellerOrder.lineItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex-1 pr-2">
                          <p className="font-bold text-gray-900">{item.productName}</p>
                          <p className="text-[11px] text-gray-500">
                            {item.quantity} {item.unit || "unit"} × ₹{item.unitPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className="font-bold text-gray-900">
                          ₹{item.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-1">
                      <p className="font-bold text-gray-900">{selectedSellerOrder.items}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between font-extrabold text-sm text-[#174D25]">
                  <span>Total Payable:</span>
                  <span>{selectedSellerOrder.amount}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSellerOrder(null)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>

              {selectedSellerOrder.status === "Ready for Dispatch" ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateSellerStatus(selectedSellerOrder.id, "Packed")}
                  leftIcon={<Package size={14} />}
                  className="w-full sm:w-auto"
                >
                  Mark as Packed
                </Button>
              ) : selectedSellerOrder.status === "Packed" ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateSellerStatus(selectedSellerOrder.id, "Dispatched")}
                  leftIcon={<Truck size={14} />}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  Mark as Dispatched
                </Button>
              ) : selectedSellerOrder.status === "Dispatched" || selectedSellerOrder.status === "In Transit" ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateSellerStatus(selectedSellerOrder.id, "Delivered")}
                  leftIcon={<CheckCircle2 size={14} />}
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800"
                >
                  Mark as Delivered
                </Button>
              ) : selectedSellerOrder.status === "Delivered" ? (
                <div className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-[#174D25]">
                  <CheckCircle2 size={15} className="text-[#24833A]" />
                  <span>Order Delivered</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
