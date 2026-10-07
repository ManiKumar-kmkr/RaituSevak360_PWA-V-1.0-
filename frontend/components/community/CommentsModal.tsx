"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  CornerDownRight,
  Clock,
} from "lucide-react";
import { CommunityPost, CommunityComment } from "@/types/community";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";

interface CommentsModalProps {
  post: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

export default function CommentsModal({
  post,
  isOpen,
  onClose,
  onAddComment,
}: CommentsModalProps) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError(t("community.commentRequired") || "Please enter a comment");
      return;
    }

    onAddComment(post.id, commentText.trim());
    setCommentText("");
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comments-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2
                id="comments-modal-title"
                className="text-base font-bold text-gray-900"
              >
                {t("community.commentsTitle") || "Comments"} ({post.comments.length})
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {t("community.discussionOn") || "Discussion by"} {post.authorName}
              </p>
            </div>
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

        {/* Original Post Excerpt Box */}
        <div className="mt-3.5 rounded-2xl bg-gray-50 p-3 border border-gray-100 text-xs text-gray-700 line-clamp-2 italic leading-relaxed">
          &ldquo;{post.content}&rdquo;
        </div>

        {/* Comments List (Scrollable Area) */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 min-h-[140px] max-h-[350px]">
          {post.comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
              <MessageSquare size={28} className="mb-2 opacity-50" />
              <p className="text-xs font-semibold">
                {t("community.noCommentsYet") ||
                  "No comments yet. Be the first to share your thoughts!"}
              </p>
            </div>
          ) : (
            post.comments.map((comm) => (
              <div
                key={comm.id}
                className="flex items-start gap-2.5 rounded-2xl bg-[#F8FAF7] p-3 border border-gray-100/80"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E4F0DD] text-xs font-bold text-[#174D25]">
                  {comm.authorAvatar || comm.authorName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-900">
                      {comm.authorName}
                    </span>
                    {comm.isVerified && (
                      <ShieldCheck size={11} className="text-[#24833A]" />
                    )}
                    <span className="text-[10px] text-gray-400">
                      • {comm.createdAt}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {comm.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-gray-100">
          {error && (
            <p className="mb-1.5 text-[11px] font-bold text-red-600">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (error) setError(null);
              }}
              placeholder={
                t("community.writeComment") || "Write a comment or advice..."
              }
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-2.5 px-3.5 text-xs text-gray-900 shadow-2xs focus:border-[#24833A] focus:outline-hidden focus:ring-1 focus:ring-[#24833A]"
              maxLength={280}
              aria-label="Comment text"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#24833A] text-white hover:bg-[#1e6f31] disabled:bg-gray-200 disabled:text-gray-400 transition cursor-pointer shadow-xs active:scale-95"
              aria-label={t("community.sendComment") || "Send comment"}
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
