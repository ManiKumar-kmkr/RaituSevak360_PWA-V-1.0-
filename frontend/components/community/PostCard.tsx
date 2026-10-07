"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  ShieldCheck,
  Trash2,
  AlertCircle,
  Tag,
  Clock,
  MapPin,
} from "lucide-react";
import { CommunityPost, CommunityCategory } from "@/types/community";
import { useTranslation } from "@/hooks/useTranslation";

interface PostCardProps {
  post: CommunityPost;
  onToggleLike: (postId: string) => void;
  onOpenComments: (post: CommunityPost) => void;
  onShare: (post: CommunityPost) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({
  post,
  onToggleLike,
  onOpenComments,
  onShare,
  onDelete,
}: PostCardProps) {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getCategoryBadge = (category: CommunityCategory) => {
    switch (category) {
      case "crop-issues":
        return {
          label: t("community.cropIssues") || "Crop Issues",
          className: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "market-talk":
        return {
          label: t("community.marketTalk") || "Market Talk",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "tips":
        return {
          label: t("community.tips") || "Tips",
          className: "bg-emerald-50 text-[#174D25] border-emerald-200",
        };
      case "questions":
        return {
          label: t("community.questions") || "Questions",
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      default:
        return {
          label: category,
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const badge = getCategoryBadge(post.category);

  return (
    <article
      className="flex flex-col rounded-3xl border border-gray-200 bg-white p-4.5 sm:p-5 shadow-2xs transition-all duration-200 hover:border-[#24833A]/30 hover:shadow-xs"
      data-testid={`community-post-${post.id}`}
    >
      {/* Post Header: Avatar, Name, Location/Time & Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] font-bold text-sm text-[#174D25] shadow-xs">
            {post.authorAvatar || post.authorName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                {post.authorName}
              </span>
              {post.isVerified && (
                <span
                  className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200"
                  title="Verified Community Member"
                >
                  <ShieldCheck size={11} className="text-[#24833A]" />
                  <span>{t("community.verifiedFarmer") || "Verified Farmer"}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
              {post.authorLocation && (
                <>
                  <span className="truncate max-w-[140px] sm:max-w-none">
                    {post.authorLocation}
                  </span>
                  <span>•</span>
                </>
              )}
              <span className="shrink-0">{post.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Pill */}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
          >
            {badge.label}
          </span>

          {/* Delete Own Post Button */}
          {post.isMyPost && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
              title={t("community.deletePost") || "Delete post"}
              aria-label={t("community.deletePost") || "Delete post"}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialogue */}
      {showDeleteConfirm && (
        <div className="mt-3 rounded-2xl bg-red-50 p-3 border border-red-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-800 font-medium">
            <AlertCircle size={15} className="shrink-0 text-red-600" />
            <span>{t("community.confirmDelete") || "Delete this discussion post?"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition cursor-pointer"
            >
              {t("community.cancel") || "Cancel"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete?.(post.id);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
            >
              {t("community.delete") || "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* Post Text Content */}
      <div className="mt-3 text-sm sm:text-base text-gray-800 leading-relaxed font-normal whitespace-pre-line">
        {post.content}
      </div>

      {/* Optional Post Image */}
      {post.imageUrl && (
        <div className="mt-3.5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 max-h-72 w-full">
          <img
            src={post.imageUrl}
            alt="Farm discussion photo"
            className="w-full h-full object-cover max-h-72 hover:opacity-95 transition"
            loading="lazy"
          />
        </div>
      )}

      {/* Action Footer: Like, Comment, Share */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-5">
          {/* Reaction / Like Button */}
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className={`inline-flex items-center gap-1.5 transition active:scale-90 cursor-pointer ${
              post.likedByMe
                ? "text-red-600 font-bold"
                : "text-gray-500 hover:text-red-600"
            }`}
            aria-label={`${post.likedByMe ? "Unlike" : "Like"} post by ${post.authorName}`}
            data-testid={`like-btn-${post.id}`}
          >
            <Heart
              size={18}
              className={`transition-colors ${
                post.likedByMe ? "fill-red-600 text-red-600" : ""
              }`}
            />
            <span>{post.likesCount}</span>
          </button>

          {/* Comment Count / Open Comments */}
          <button
            type="button"
            onClick={() => onOpenComments(post)}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#24833A] transition cursor-pointer"
            aria-label={`View comments on post by ${post.authorName}`}
            data-testid={`comment-btn-${post.id}`}
          >
            <MessageSquare size={17} />
            <span>{post.commentsCount}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => onShare(post)}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#174D25] hover:bg-gray-100 px-2.5 py-1 rounded-xl transition cursor-pointer"
          aria-label={`Share post by ${post.authorName}`}
          data-testid={`share-btn-${post.id}`}
        >
          <Share2 size={16} />
          <span className="font-semibold">{t("community.share") || "Share"}</span>
        </button>
      </div>
    </article>
  );
}
