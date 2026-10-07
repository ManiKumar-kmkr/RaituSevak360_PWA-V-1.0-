"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  Layers,
  MapPin,
  Truck,
  CheckCircle2,
  X,
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  Tag,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useSellerStore } from "@/store/seller-store";
import { SellerProduct } from "@/types/seller";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

const CATEGORIES = ["All", "Seeds", "Fertilizers", "Pesticides", "Farm Tools"];

export default function SellerProductsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const products = useSellerStore((state) => state.products);
  const addProduct = useSellerStore((state) => state.addProduct);
  const updateProduct = useSellerStore((state) => state.updateProduct);
  const updateStock = useSellerStore((state) => state.updateStock);
  const toggleProductStatus = useSellerStore((state) => state.toggleProductStatus);
  const deleteProduct = useSellerStore((state) => state.deleteProduct);

  // Search & Category filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // View / Modal states
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2 | 3>(1); // 1 = Image/Cat, 2 = Commercial, 3 = Published Success
  const [createdProduct, setCreatedProduct] = useState<SellerProduct | null>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  // Stock Update Modal State
  const [stockProduct, setStockProduct] = useState<SellerProduct | null>(null);
  const [stockAction, setStockAction] = useState<"add" | "reduce" | "set">("add");
  const [stockValue, setStockValue] = useState<number | "">("");

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<SellerProduct | null>(null);

  // Add Product Form State
  const [addForm, setAddForm] = useState({
    name: "",
    category: "Seeds" as SellerProduct["category"],
    subCategory: "",
    price: "" as number | "",
    unit: "bag (25kg)",
    moq: 1,
    stock: "" as number | "",
    location: "Warangal, Telangana",
    description: "",
    tagsInput: "Govt Approved, High Yield",
    isAvailableForDelivery: true,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Handle Add Product Step 1 Validation
  const handleAddNextStep = () => {
    const errs: Record<string, string> = {};
    if (!addForm.name.trim()) errs.name = "Product name is required";
    if (!addForm.category) errs.category = "Category is required";
    if (!addForm.subCategory.trim()) errs.subCategory = "Sub-category is required";

    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      return;
    }
    setAddErrors({});
    setAddStep(2);
  };

  // Handle Add Product Step 2 & Publish
  const handlePublishProduct = () => {
    const errs: Record<string, string> = {};
    if (!addForm.price || Number(addForm.price) <= 0) errs.price = "Enter a valid selling price";
    if (!addForm.unit.trim()) errs.unit = "Unit is required";
    if (addForm.stock === "" || Number(addForm.stock) < 0) errs.stock = "Available stock is required";
    if (!addForm.location.trim()) errs.location = "Location is required";
    if (!addForm.description.trim()) errs.description = "Product description is required";

    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      return;
    }

    const tagsArray = addForm.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newProd = addProduct({
      name: addForm.name,
      category: addForm.category,
      subCategory: addForm.subCategory,
      price: Number(addForm.price),
      unit: addForm.unit,
      moq: Number(addForm.moq) || 1,
      stock: Number(addForm.stock),
      location: addForm.location,
      description: addForm.description,
      tags: tagsArray.length > 0 ? tagsArray : ["Verified Product"],
      isAvailableForDelivery: addForm.isAvailableForDelivery,
      status: "active",
      imageUrl: addForm.imageUrl,
    });

    setCreatedProduct(newProd);
    setAddStep(3);
  };

  const handleResetAddForm = () => {
    setAddForm({
      name: "",
      category: "Seeds",
      subCategory: "",
      price: "",
      unit: "bag (25kg)",
      moq: 1,
      stock: "",
      location: "Warangal, Telangana",
      description: "",
      tagsInput: "Certified, High Yield",
      isAvailableForDelivery: true,
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    });
    setAddErrors({});
    setAddStep(1);
    setIsAddModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      subCategory: editingProduct.subCategory,
      price: Number(editingProduct.price),
      unit: editingProduct.unit,
      moq: Number(editingProduct.moq),
      stock: Number(editingProduct.stock),
      location: editingProduct.location,
      description: editingProduct.description,
      isAvailableForDelivery: editingProduct.isAvailableForDelivery,
      tags: Array.isArray(editingProduct.tags) ? editingProduct.tags : [],
    });
    // Update active selected view if open
    setSelectedProduct(editingProduct);
    setEditingProduct(null);
  };

  // Stock update submit
  const handleApplyStockUpdate = () => {
    if (!stockProduct || stockValue === "" || Number(stockValue) < 0) return;
    const val = Number(stockValue);
    let nextStock = stockProduct.stock;
    if (stockAction === "add") nextStock += val;
    else if (stockAction === "reduce") nextStock = Math.max(0, nextStock - val);
    else if (stockAction === "set") nextStock = val;

    updateStock(stockProduct.id, nextStock);

    if (selectedProduct && selectedProduct.id === stockProduct.id) {
      setSelectedProduct({ ...selectedProduct, stock: nextStock });
    }
    setStockProduct(null);
    setStockValue("");
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    if (selectedProduct?.id === productToDelete.id) {
      setSelectedProduct(null);
    }
    setProductToDelete(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-16">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#174D25]">My Products</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage catalog inventory & pricing</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            handleResetAddForm();
          }}
          leftIcon={<Plus size={16} strokeWidth={2.5} />}
        >
          Add Product
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name, tag, category..."
          className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 shadow-2xs transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products List */}
      <div className="flex flex-col gap-3">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <Package size={28} className="text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-gray-700">No Products Listed</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              You haven&apos;t added any products in this category yet. Click below to add your first item.
            </p>
            <button
              type="button"
              onClick={handleResetAddForm}
              className="mt-4 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition"
            >
              Add Product
            </button>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isActive = p.status === "active";
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`flex gap-3.5 rounded-3xl border p-3.5 sm:p-4 bg-white shadow-2xs transition hover:shadow-xs active:scale-[0.99] cursor-pointer ${
                  isActive ? "border-gray-200 hover:border-[#24833A]/60" : "border-gray-200 opacity-75 bg-gray-50/60"
                }`}
              >
                {/* Product Thumbnail */}
                <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                      isActive ? "bg-emerald-600 text-white" : "bg-gray-700 text-white"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Info & Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          p.stock > 10 ? "text-emerald-600" : p.stock > 0 ? "text-amber-600" : "text-red-500"
                        }`}
                      >
                        Stock: {p.stock}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#174D25] line-clamp-1 mt-0.5">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {p.subCategory} • MOQ {p.moq}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                    <span className="text-sm font-black text-[#24833A]">
                      ₹{p.price}{" "}
                      <span className="text-[10px] font-medium text-gray-400">/ {p.unit}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#24833A] hover:underline">
                      Manage <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= PRODUCT DETAIL VIEW MODAL ================= */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition z-10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Thumbnail */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
              <span
                className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-xs ${
                  selectedProduct.status === "active" ? "bg-emerald-600" : "bg-gray-800"
                }`}
              >
                {selectedProduct.status === "active" ? "Active Listing" : "Hidden / Inactive"}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {selectedProduct.category} • {selectedProduct.subCategory}
                </span>
                <h2 className="text-xl font-black text-[#174D25] leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <MapPin size={13} className="text-[#24833A]" />
                  <span>{selectedProduct.location}</span>
                </div>
              </div>

              {/* Price & Stock Stats */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#F4FBF5] p-3 text-xs border border-[#24833A]/20">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">Price</span>
                  <p className="text-sm font-black text-[#24833A]">
                    ₹{selectedProduct.price}
                  </p>
                  <span className="text-[10px] text-gray-500">per {selectedProduct.unit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">Stock</span>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedProduct.stock} units
                  </p>
                  <span className="text-[10px] text-gray-500">available</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">MOQ</span>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedProduct.moq} min
                  </p>
                  <span className="text-[10px] text-gray-500">order size</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100 leading-relaxed">
                <span className="font-bold text-gray-800 block mb-0.5">Description</span>
                {selectedProduct.description}
              </div>

              {/* Tags */}
              {selectedProduct.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              )}

              {/* Management Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingProduct(selectedProduct);
                  }}
                  leftIcon={<Edit size={14} />}
                >
                  Edit Product
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStockProduct(selectedProduct);
                    setStockValue(selectedProduct.stock);
                  }}
                  leftIcon={<Package size={14} />}
                >
                  Update Stock
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    toggleProductStatus(selectedProduct.id);
                    setSelectedProduct((prev) =>
                      prev ? { ...prev, status: prev.status === "active" ? "inactive" : "active" } : null
                    );
                  }}
                  leftIcon={selectedProduct.status === "active" ? <EyeOff size={14} /> : <Eye size={14} />}
                >
                  {selectedProduct.status === "active" ? "Deactivate" : "Keep Active"}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setProductToDelete(selectedProduct)}
                  leftIcon={<Trash2 size={14} />}
                >
                  Delete Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PRODUCT MODAL (STEP 1 & 2 & 3) ================= */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition z-10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* STEP 1: Basic & Category */}
            {addStep === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#24833A]">
                    STEP 1 OF 2
                  </span>
                  <h2 className="text-xl font-bold text-[#174D25]">List New Product</h2>
                  <p className="text-xs text-gray-500">Upload Images & Category Details</p>
                </div>

                {/* Image Upload Box */}
                <div className="rounded-2xl border-2 border-dashed border-[#24833A]/40 bg-[#F4FBF5] p-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#24833A] shadow-xs mb-2">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-[#174D25]">Upload Product Photo</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG or WebP up to 5MB</p>
                  <button
                    type="button"
                    onClick={() => {
                      // Demo upload toggle
                      setAddForm((prev) => ({
                        ...prev,
                        imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80",
                      }));
                    }}
                    className="mt-2.5 inline-flex items-center gap-1 rounded-xl bg-white border border-[#24833A]/30 px-3 py-1.5 text-xs font-bold text-[#174D25] shadow-2xs hover:bg-[#E4F0DD] transition"
                  >
                    Select Demo Photo
                  </button>
                </div>

                {/* Product Name */}
                <div>
                  <label htmlFor="prodName" className="block text-xs font-bold text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prodName"
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Certified Bio-Organic Trichoderma"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none"
                  />
                  {addErrors.name && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{addErrors.name}</p>
                  )}
                </div>

                {/* Category & Sub-category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="catSelect" className="block text-xs font-bold text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="catSelect"
                      value={addForm.category}
                      onChange={(e) => setAddForm((prev) => ({ ...prev, category: e.target.value as any }))}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                    >
                      <option value="Seeds">Seeds</option>
                      <option value="Fertilizers">Fertilizers</option>
                      <option value="Pesticides">Pesticides</option>
                      <option value="Farm Tools">Farm Tools</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subCat" className="block text-xs font-bold text-gray-700 mb-1">
                      Sub-Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subCat"
                      type="text"
                      value={addForm.subCategory}
                      onChange={(e) => setAddForm((prev) => ({ ...prev, subCategory: e.target.value }))}
                      placeholder="e.g. Bio-Fungicide"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                    />
                    {addErrors.subCategory && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{addErrors.subCategory}</p>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleAddNextStep}
                    className="flex-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Commercial Details */}
            {addStep === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#24833A]">
                    STEP 2 OF 2
                  </span>
                  <h2 className="text-xl font-bold text-[#174D25]">Commercial Details</h2>
                  <p className="text-xs text-gray-500">Pricing, Inventory & Logistics</p>
                </div>

                {/* Price & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="prodPrice" className="block text-xs font-bold text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prodPrice"
                      type="number"
                      min={1}
                      value={addForm.price}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          price: e.target.value === "" ? "" : Number(e.target.value),
                        }))
                      }
                      placeholder="1250"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-800 focus:border-[#24833A] focus:outline-none"
                    />
                    {addErrors.price && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{addErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="prodUnit" className="block text-xs font-bold text-gray-700 mb-1">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prodUnit"
                      type="text"
                      value={addForm.unit}
                      onChange={(e) => setAddForm((prev) => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g. bag (25kg), kg, piece"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Stock & MOQ */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="prodStock" className="block text-xs font-bold text-gray-700 mb-1">
                      Available Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prodStock"
                      type="number"
                      min={0}
                      value={addForm.stock}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          stock: e.target.value === "" ? "" : Number(e.target.value),
                        }))
                      }
                      placeholder="50"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                    />
                    {addErrors.stock && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{addErrors.stock}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="prodMoq" className="block text-xs font-bold text-gray-700 mb-1">
                      Min Order Qty (MOQ)
                    </label>
                    <input
                      id="prodMoq"
                      type="number"
                      min={1}
                      value={addForm.moq}
                      onChange={(e) =>
                        setAddForm((prev) => ({ ...prev, moq: Number(e.target.value) || 1 }))
                      }
                      placeholder="1"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="prodLocation" className="block text-xs font-bold text-gray-700 mb-1">
                    Store Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prodLocation"
                    type="text"
                    value={addForm.location}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Warangal, Telangana"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="prodDesc" className="block text-xs font-bold text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="prodDesc"
                    rows={2}
                    value={addForm.description}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe composition, crop suitability, application rates..."
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                  {addErrors.description && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{addErrors.description}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="prodTags" className="block text-xs font-bold text-gray-700 mb-1">
                    Tags <span className="text-gray-400 font-normal">(Comma separated)</span>
                  </label>
                  <input
                    id="prodTags"
                    type="text"
                    value={addForm.tagsInput}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, tagsInput: e.target.value }))}
                    placeholder="Certified, Organic, Fast Delivery"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>

                {/* Delivery Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/70 p-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">
                      Available for Delivery
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Ship to farmer address or village delivery point
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={addForm.isAvailableForDelivery}
                    onClick={() =>
                      setAddForm((prev) => ({
                        ...prev,
                        isAvailableForDelivery: !prev.isAvailableForDelivery,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      addForm.isAvailableForDelivery ? "bg-[#24833A]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        addForm.isAvailableForDelivery ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setAddStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handlePublishProduct}
                    className="flex-2"
                  >
                    Publish Product
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Published Success */}
            {addStep === 3 && createdProduct && (
              <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A]">
                  <CheckCircle2 size={36} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#174D25]">
                    Product Listed Successfully!
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your product is now active in the RaituSevak360 Marketplace.
                  </p>
                </div>

                {/* Preview Card */}
                <div className="w-full rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3 text-left flex gap-3 items-center">
                  <img
                    src={createdProduct.imageUrl}
                    alt={createdProduct.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
                      {createdProduct.name}
                    </h4>
                    <p className="text-xs font-black text-[#24833A]">
                      ₹{createdProduct.price} / {createdProduct.unit}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      Stock: {createdProduct.stock} units
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full mt-2">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setSelectedProduct(createdProduct);
                    }}
                  >
                    View Product
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => handleResetAddForm()}
                  >
                    List Another Product
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-[#174D25] mb-3">Edit Product</h3>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Farm Tools">Farm Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sub-Category</label>
                  <input
                    type="text"
                    value={editingProduct.subCategory}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subCategory: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, unit: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">MOQ</label>
                  <input
                    type="number"
                    value={editingProduct.moq}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, moq: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingProduct.location}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, location: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 focus:border-[#24833A] focus:outline-none"
                />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setEditingProduct(null)}
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
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= STOCK UPDATE MODAL ================= */}
      {stockProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#24833A]/20">
            <button
              type="button"
              onClick={() => setStockProduct(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-[#174D25]">Update Stock</h3>
            <p className="text-xs text-gray-500 truncate max-w-[240px] mt-0.5">
              {stockProduct.name}
            </p>

            <div className="mt-3 rounded-2xl bg-[#F4FBF5] border border-[#24833A]/20 p-3 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Current Available Stock</span>
              <span className="text-base font-black text-[#24833A]">
                {stockProduct.stock} units
              </span>
            </div>

            <div className="mt-4 flex gap-1.5 rounded-xl bg-gray-100 p-1 text-xs">
              {(["add", "reduce", "set"] as const).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setStockAction(act)}
                  className={`flex-1 rounded-lg py-1.5 font-bold capitalize transition ${
                    stockAction === act
                      ? "bg-white text-[#174D25] shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {act} Stock
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label htmlFor="stockUnits" className="block text-xs font-bold text-gray-700 mb-1">
                Quantity to {stockAction}
              </label>
              <input
                id="stockUnits"
                type="number"
                min={0}
                value={stockValue}
                onChange={(e) =>
                  setStockValue(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Enter unit count"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-bold text-gray-800 focus:border-[#24833A] focus:outline-none"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStockProduct(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleApplyStockUpdate}
                className="flex-2"
              >
                Apply Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-red-200 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-3">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">Delete Item?</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-gray-800">{productToDelete.name}</span>? This action cannot be undone.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setProductToDelete(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmDelete}
                className="flex-1"
              >
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
