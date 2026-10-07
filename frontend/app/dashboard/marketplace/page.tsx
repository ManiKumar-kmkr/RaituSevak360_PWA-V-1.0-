"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  Plus,
  ArrowLeft,
  X,
  CheckCircle2,
  ShoppingCart,
  Tractor,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import { MarketplaceProduct, ProductCategory } from "@/types/marketplace";
import marketplaceService from "@/services/marketplace";
import ProductCard from "@/components/marketplace/ProductCard";
import { useCartStore } from "@/store/cart-store";
import { useSellerStore } from "@/store/seller-store";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

export default function MarketplacePage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);

  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inquiryProduct, setInquiryProduct] = useState<MarketplaceProduct | null>(null);
  const [isInquirySent, setIsInquirySent] = useState(false);

  // Cart store for header cart counter
  const getItemsCount = useCartStore((state) => state.getItemsCount);
  const cartCount = getItemsCount();

  // Seller store products to automatically react when seller products are added, updated, or toggled
  const sellerProducts = useSellerStore((state) => state.products);

  // Load products based on category, search, and reactive seller products
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoading(true);
      try {
        const data = await marketplaceService.getProducts(activeCategory, searchQuery);
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load marketplace products", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [activeCategory, searchQuery, sellerProducts]);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: "all", label: "All Products" },
    { id: "seeds", label: "Seeds" },
    { id: "fertilizer", label: "Fertilizers" },
    { id: "tools", label: "Tools & Sprayers" },
    { id: "pesticides", label: "Bio-Pesticides" },
    { id: "machinery", label: "Machinery" },
  ];

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInquirySent(true);
    setTimeout(() => {
      setInquiryProduct(null);
      setIsInquirySent(false);
    }, 1800);
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Top Breadcrumb & Cart Header Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />

        {/* Header Shopping Cart Pill with Live Count */}
        <Link
          href="/dashboard/marketplace/cart"
          className="relative inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-800 shadow-2xs transition hover:border-[#24833A] hover:bg-[#E4F0DD] hover:text-[#174D25] active:scale-95 cursor-pointer"
          aria-label="Open Shopping Cart"
        >
          <ShoppingCart size={16} className="text-[#24833A]" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#24833A] text-[10px] font-extrabold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Marketplace Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Store size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.marketplace")}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Direct Farmer Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Certified seeds, organic fertilizers, tools & farm implement rentals
            </p>
          </div>
        </div>

        {activeRole === "seller" && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Product Listing</span>
          </button>
        )}
      </div>

      {/* Equipment Rental Bridge Card (Connected to /dashboard/machinery) */}
      <div className="flex items-center justify-between rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-[#E4F0DD]/60 via-[#F7F9F6] to-white p-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#24833A] text-white">
            <Tractor size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900">
              Need Heavy Tractors or Harvesters?
            </span>
            <p className="text-[11px] text-gray-500">
              Book government-subsidized CHC rentals with certified operators.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/machinery"
          className="shrink-0 rounded-xl bg-white border border-[#24833A]/40 px-3 py-1.5 text-xs font-bold text-[#174D25] shadow-2xs hover:bg-[#E4F0DD] transition active:scale-95 cursor-pointer"
        >
          Book Equipment
        </Link>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            id="marketplace-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seeds, fertilizer, sprayers, IR-64..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-hidden shadow-2xs"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-[#24833A] text-white shadow-2xs"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Listings Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
          <p className="mt-3 text-xs font-semibold text-gray-500">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Store size={28} />
          </div>
          <h2 className="text-sm font-bold text-gray-900">No products found</h2>
          <p className="text-xs text-gray-500 max-w-xs">
            No products match &quot;{searchQuery}&quot; in the selected category.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition active:scale-95 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Clear Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickInquire={(p) => setInquiryProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Preserved Direct Trade Inquiry Modal */}
      {inquiryProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setInquiryProduct(null)}
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
                  {inquiryProduct.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInquiryProduct(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {isInquirySent ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#24833A]">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Inquiry Sent to Seller!</h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  {inquiryProduct.seller} will connect with you directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="mt-4 flex flex-col gap-3.5">
                <div className="rounded-xl bg-gray-50 p-3 text-xs flex justify-between items-center">
                  <span className="font-bold text-gray-700">Listed Price:</span>
                  <span className="font-extrabold text-[#174D25]">
                    ₹{inquiryProduct.price} / {inquiryProduct.unit}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Message / Desired Quantity
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Hello, I am interested in purchasing this product. Please share availability."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                    required
                  />
                </div>

                <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setInquiryProduct(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Send Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
