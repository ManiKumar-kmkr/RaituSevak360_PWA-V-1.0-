"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  Search,
  X,
  Plus,
  Sparkles,
  MessageSquare,
  RotateCcw,
  CheckCircle2,
  Info,
  Check,
} from "lucide-react";
import { CommunityPost, CommunityFilter, CreatePostInput } from "@/types/community";
import { communityService } from "@/services/community";
import { useCommunityStore } from "@/store/community-store";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import PostCard from "@/components/community/PostCard";
import CommentsModal from "@/components/community/CommentsModal";
import CreatePostModal from "@/components/community/CreatePostModal";
import BackButton from "@/components/ui/BackButton";

function CommunityContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const posts = useCommunityStore((state) => state.posts);
  const addPost = useCommunityStore((state) => state.addPost);
  const deletePost = useCommunityStore((state) => state.deletePost);
  const toggleLike = useCommunityStore((state) => state.toggleLike);
  const addComment = useCommunityStore((state) => state.addComment);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CommunityFilter>("all");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] =
    useState<CommunityPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter chips configuration matching Figma
  const CATEGORY_CHIPS: { id: CommunityFilter; labelKey: string; fallback: string }[] = [
    { id: "all", labelKey: "community.filterAll", fallback: "All" },
    { id: "crop-issues", labelKey: "community.cropIssues", fallback: "Crop Issues" },
    { id: "market-talk", labelKey: "community.marketTalk", fallback: "Market Talk" },
    { id: "tips", labelKey: "community.tips", fallback: "Tips" },
    { id: "questions", labelKey: "community.questions", fallback: "Questions" },
  ];

  // Filtered discussions list
  const filteredPosts = useMemo(() => {
    return communityService.filterPosts(posts, {
      category: activeCategory,
      search: searchQuery,
    });
  }, [posts, activeCategory, searchQuery]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleShare = async (post: CommunityPost) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `RaituSevak360 Discussion by ${post.authorName}`,
          text: post.content,
          url: window.location.href,
        });
        showToast(t("community.shareSuccess") || "Shared successfully!");
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${post.content} - Discussion on RaituSevak360 Community`
      );
      showToast(t("community.linkCopied") || "Post copied to clipboard!");
    }
  };

  const handleCreatePost = (input: CreatePostInput) => {
    const authorName = user?.name || "Ramesh Kumar";
    addPost(input, {
      id: user?.id || "my-user",
      name: authorName,
      location: "Telangana, India",
    });
    showToast(t("community.postCreated") || "Discussion post published!");
  };

  const handleAddComment = (postId: string, text: string) => {
    const authorName = user?.name || "Ramesh Kumar";
    addComment(postId, text, {
      id: user?.id || "my-user",
      name: authorName,
      location: "Telangana, India",
    });

    // Update selected post state to reflect latest comment
    const updatedPost = useCommunityStore
      .getState()
      .posts.find((p) => p.id === postId);
    if (updatedPost) {
      setSelectedPostForComments(updatedPost);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-28 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-gray-900/90 text-white px-4 py-2.5 text-xs font-bold shadow-xl backdrop-blur-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 size={16} className="text-[#86EFAC]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Back Navigation to Dashboard */}
      <div className="flex items-center justify-between">
        <BackButton
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/dashboard");
            }
          }}
          label={t("common.backToDashboard") || "Back to Dashboard"}
        />
      </div>

      {/* Header Banner (Figma: Community / Share, discuss, and learn together) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Users size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t("community.title") || "Community"}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                Farmer Network
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {t("community.subtitle") || "Share, discuss, and learn together"}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar (Figma: Search questions, discussions...) */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            t("community.searchPlaceholder") || "Search questions, discussions..."
          }
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-xs sm:text-sm text-gray-900 shadow-2xs placeholder:text-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition"
          aria-label="Search discussions"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            aria-label={t("community.clearSearch") || "Clear search"}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category Chips Bar (Figma: All, Crop Issues, Market Talk, Tips, Questions) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
        {CATEGORY_CHIPS.map((chip) => {
          const isSelected = activeCategory === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveCategory(chip.id)}
              className={`inline-flex shrink-0 items-center justify-center rounded-full px-3.5 py-1.5 sm:px-4 text-xs font-bold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
              data-testid={`category-chip-${chip.id}`}
            >
              <span>{t(chip.labelKey) || chip.fallback}</span>
            </button>
          );
        })}
      </div>

      {/* Informational Farmer Community Note */}
      <div className="rounded-2xl bg-[#F4F9F2] p-3 border border-[#24833A]/15 text-[11px] text-[#174D25] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles size={14} className="text-[#24833A] shrink-0" />
          <span>
            {t("community.infoBanner") ||
              "Connect with local farmers across Telangana and AP. Share real experiences, crop advice & prices."}
          </span>
        </div>
      </div>

      {/* Discussions Feed List */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-2xs my-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            {t("community.noDiscussions") || "No discussions found"}
          </h2>
          <p className="mt-1 text-xs text-gray-500 max-w-sm">
            {t("community.noDiscussionsDesc") ||
              "Try searching for other crop terms, clear your filters, or start a new discussion!"}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={clearSearch}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{t("community.clearSearch") || "Clear Search"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e6f31] transition cursor-pointer"
            >
              <Plus size={14} />
              <span>{t("community.createPost") || "Create Post"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>
              Showing <strong>{filteredPosts.length}</strong> farmer discussions
            </span>
            {(searchQuery || activeCategory !== "all") && (
              <button
                type="button"
                onClick={clearSearch}
                className="font-bold text-[#24833A] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={toggleLike}
              onOpenComments={(p) => setSelectedPostForComments(p)}
              onShare={handleShare}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}

      {/* Floating Green "+" Button (Figma specification) */}
      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 sm:bottom-8 right-5 sm:right-10 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#24833A] text-white shadow-lg hover:bg-[#1e6f31] active:scale-95 transition-all duration-150 cursor-pointer"
        aria-label={t("community.createPost") || "Create Post"}
        data-testid="floating-create-post-btn"
      >
        <Plus size={28} strokeWidth={2.6} />
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />

      {/* Comments Drawer / Modal */}
      <CommentsModal
        post={selectedPostForComments}
        isOpen={!!selectedPostForComments}
        onClose={() => setSelectedPostForComments(null)}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        </div>
      }
    >
      <CommunityContent />
    </Suspense>
  );
}
