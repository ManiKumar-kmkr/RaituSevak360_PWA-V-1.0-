"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Plus,
  Minus,
  Zap,
  Check,
  Building2,
  Package,
  Share2,
  MessageSquare,
  X,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { MarketplaceProduct } from "@/types/marketplace";
import marketplaceService from "@/services/marketplace";
import { useCartStore } from "@/store/cart-store";
import { useSellerStore } from "@/store/seller-store";
import ProductThumbnail from "@/components/marketplace/ProductThumbnail";
import BackButton from "@/components/ui/BackButton";

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const getItemsCount = useCartStore((state) => state.getItemsCount);
  const cartCount = getItemsCount();

  const sellerProducts = useSellerStore((state) => state.products);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (productId) {
        const found = await marketplaceService.getProductById(productId);
        setProduct(found);

        if (found) {
          const all = await marketplaceService.getProducts(found.category);
          setRelatedProducts(all.filter((p) => p.id !== found.id).slice(0, 2));
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [productId, sellerProducts]);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    router.push("/dashboard/marketplace/cart");
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setIsInquiryOpen(false);
      setInquirySent(false);
    }, 1800);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-gray-600">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          The requested product may have been removed or is temporarily out of stock.
        </p>
        <Link
          href="/dashboard/marketplace"
          className="inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30]"
        >
          <ArrowLeft size={16} />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const computedSubtotal = product.price * quantity;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-20">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/marketplace" label="Back to Marketplace" />

        <Link
          href="/dashboard/marketplace/cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-2xs transition hover:border-[#24833A] hover:bg-[#E4F0DD] active:scale-95 cursor-pointer"
          aria-label="View Shopping Cart"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#24833A] text-[10px] font-extrabold text-white ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Main Product Card Container */}
      <div className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-6 shadow-2xs">
        {/* Large Product Visual */}
        <ProductThumbnail product={product} size="lg" />

        {/* Product Badges & Category */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#24833A]">
              <ShieldCheck size={13} />
              <span>{product.badge}</span>
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
            <Star size={13} className="fill-amber-400 text-amber-500" />
            <span>{product.rating}</span>
            <span className="text-gray-400 font-normal">
              ({product.reviewCount} farmer reviews)
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h1 className="mt-3 text-lg sm:text-2xl font-extrabold text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* Price & Unit Details */}
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#174D25]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-500">
            per {product.unit}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              MRP ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
          {product.mrp && product.mrp > product.price && (
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              Save ₹{(product.mrp - product.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Stock Status Indicator */}
        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>In Stock ({product.stock} units available for delivery)</span>
        </div>

        {/* Seller Info Card */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-[#F7F9F6] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#24833A] shadow-xs border border-gray-100">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">
                  {product.seller}
                </span>
                <ShieldCheck size={14} className="text-[#24833A]" />
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                Verified Seller • {product.sellerLocation}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsInquiryOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:border-[#24833A] hover:text-[#174D25] cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Direct Inquiry</span>
          </button>
        </div>

        {/* Description */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Product Description
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-gray-700">
            {product.description}
          </p>
        </div>

        {/* Product Specifications Table */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Technical Specifications
          </h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 text-xs"
              >
                <span className="font-semibold text-gray-500">{key}</span>
                <span className="font-bold text-gray-800 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Controls & Dynamic Price Breakdown */}
        <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-[#E4F0DD]/30 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-gray-800">Select Quantity</span>
              <p className="text-[11px] text-gray-500">
                Max {product.stock} units per farmer order
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-extrabold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Subtotal
                </span>
                <p className="text-sm font-extrabold text-[#174D25]">
                  ₹{computedSubtotal.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer ${
              isAdded
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-[#24833A] bg-white text-[#24833A] hover:bg-[#E4F0DD]"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} className="text-emerald-600" />
                <span>Added to Cart ({quantity} units)</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart • ₹{computedSubtotal.toLocaleString("en-IN")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#24833A] py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
          >
            <Zap size={18} className="fill-white" />
            <span>Buy Now • ₹{computedSubtotal.toLocaleString("en-IN")}</span>
          </button>
        </div>
      </div>

      {/* Direct Inquiry Modal (Preserving Existing Functionality) */}
      {isInquiryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsInquiryOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Direct Trade Inquiry</h3>
                <span className="text-[11px] text-[#24833A] font-semibold">
                  {product.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsInquiryOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#24833A]">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Inquiry Sent to Seller!</h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  {product.seller} will connect with you via mobile directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="mt-4 flex flex-col gap-3.5">
                <div className="rounded-xl bg-gray-50 p-3 text-xs flex justify-between items-center">
                  <span className="font-bold text-gray-700">Listed Price:</span>
                  <span className="font-extrabold text-[#174D25]">
                    ₹{product.price} / {product.unit}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Requirements & Delivery Location
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={`Hello ${product.seller}, I am interested in purchasing ${quantity} ${product.unit} of ${product.name}. Please confirm dispatch timeline.`}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                    required
                  />
                </div>

                <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsInquiryOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e6e30] cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
