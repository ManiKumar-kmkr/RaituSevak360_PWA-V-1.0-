"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Zap, Check, ShieldCheck, MapPin } from "lucide-react";
import { MarketplaceProduct } from "@/types/marketplace";
import { useCartStore } from "@/store/cart-store";
import ProductThumbnail from "./ProductThumbnail";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: MarketplaceProduct;
  onQuickInquire?: (product: MarketplaceProduct) => void;
}

export default function ProductCard({ product, onQuickInquire }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    router.push("/dashboard/marketplace/cart");
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/marketplace/${product.id}`)}
      className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#24833A]/40 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Product Visual Illustration */}
        <ProductThumbnail product={product} size="md" />

        {/* Badges & Meta */}
        <div className="mt-3 flex items-center justify-between gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25]">
            <ShieldCheck size={11} />
            <span>{product.badge}</span>
          </span>
          <div className="flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px]">
            <Star size={11} className="fill-amber-400 text-amber-500" />
            <span>{product.rating}</span>
            <span className="text-gray-400 font-normal text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="mt-2 text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#24833A] transition-colors">
          {product.name}
        </h3>

        {/* Seller Info */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
          <span className="truncate font-medium">{product.seller}</span>
          <span className="text-gray-300">•</span>
          <span className="truncate text-gray-400">{product.sellerLocation}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        {/* Price & Unit */}
        <div className="flex items-baseline justify-between gap-1">
          <div>
            <span className="text-base sm:text-lg font-extrabold text-[#174D25]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="ml-1 text-[11px] font-medium text-gray-500">
              / {product.unit}
            </span>
          </div>

          {product.mrp && product.mrp > product.price && (
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Stock note */}
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-700">
            In Stock ({product.stock} units)
          </span>
        </div>

        {/* Dual Actions: Add to Cart and Buy Now */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant={isAdded ? "outline" : "secondary"}
            size="sm"
            onClick={handleAddToCart}
            leftIcon={isAdded ? <Check size={14} className="text-emerald-600" /> : <ShoppingCart size={14} />}
            aria-label={`Add ${product.name} to cart`}
            className={isAdded ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : ""}
          >
            {isAdded ? "Added ✓" : "Add to Cart"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleBuyNow}
            leftIcon={<Zap size={14} className="fill-white" />}
            aria-label={`Buy ${product.name} now`}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
