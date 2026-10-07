"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Image as ImageIcon,
  Send,
  AlertCircle,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { CommunityCategory, CreatePostInput } from "@/types/community";
import { useTranslation } from "@/hooks/useTranslation";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (input: CreatePostInput) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmitPost,
}: CreatePostModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("crop-issues");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const CATEGORIES: { id: CommunityCategory; labelKey: string; fallback: string }[] = [
    { id: "crop-issues", labelKey: "community.cropIssues", fallback: "Crop Issues" },
    { id: "market-talk", labelKey: "community.marketTalk", fallback: "Market Talk" },
    { id: "tips", labelKey: "community.tips", fallback: "Tips" },
    { id: "questions", labelKey: "community.questions", fallback: "Questions" },
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t("community.imageSizeError") || "Image size must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      setError(t("community.postRequired") || "Please write your post content");
      return;
    }

    if (trimmed.length > 500) {
      setError(t("community.postTooLong") || "Post cannot exceed 500 characters");
      return;
    }

    onSubmitPost({
      content: trimmed,
      category,
      imageUrl: imagePreview || undefined,
    });

    // Reset Form
    setContent("");
    setCategory("crop-issues");
    setImagePreview(null);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div>
            <h2 id="create-post-title" className="text-base sm:text-lg font-bold text-gray-900">
              {t("community.createPost") || "Create Discussion Post"}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {t("community.createPostSubtitle") || "What's happening on your farm?"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
            aria-label={t("community.close") || "Close"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Category Selector Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              {t("community.selectCategory") || "Select Category"}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                    <span>{t(cat.labelKey) || cat.fallback}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Area Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="post-content-input"
                className="text-xs font-bold text-gray-700 uppercase tracking-wide"
              >
                {t("community.postContent") || "Your Message"}
              </label>
              <span
                className={`text-[11px] font-bold ${
                  content.length > 450 ? "text-amber-600" : "text-gray-400"
                }`}
              >
                {content.length}/500
              </span>
            </div>

            <textarea
              id="post-content-input"
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              placeholder={
                t("community.postPlaceholder") ||
                "Share crop symptoms, mandi price observations, pest management tips, or questions for fellow farmers..."
              }
              maxLength={500}
              className="w-full rounded-2xl border border-gray-200 bg-white p-3.5 text-xs sm:text-sm text-gray-900 shadow-2xs placeholder:text-gray-400 focus:border-[#24833A] focus:outline-hidden focus:ring-1 focus:ring-[#24833A] transition resize-none"
              aria-label="Post content"
            />
          </div>

          {/* Image Upload & Preview */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 max-h-48 w-full bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full h-full object-cover max-h-48"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition cursor-pointer"
                  aria-label={t("community.removeImage") || "Remove image"}
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition cursor-pointer w-fit"
              >
                <ImageIcon size={15} className="text-[#24833A]" />
                <span>{t("community.addImage") || "Add Crop Photo"}</span>
              </button>
            )}
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="rounded-xl bg-red-50 p-2.5 text-xs font-bold text-red-600 flex items-center gap-2 border border-red-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Informational Non-Government Disclaimer */}
          <div className="rounded-xl bg-gray-50 p-2.5 text-[11px] text-gray-500 flex items-start gap-2 border border-gray-100 leading-normal">
            <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
            <span>
              {t("community.userContentDisclaimer") ||
                "Community posts are user-generated farming discussions. Please maintain polite, constructive agricultural sharing."}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              {t("community.cancel") || "Cancel"}
            </button>

            <button
              type="submit"
              disabled={!content.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2 text-xs font-bold text-white hover:bg-[#1e6f31] disabled:bg-gray-300 disabled:text-gray-500 transition shadow-2xs cursor-pointer active:scale-95"
            >
              <span>{t("community.post") || "Publish Post"}</span>
              <Send size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
