import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CommunityPost,
  CommunityCategory,
  CreatePostInput,
  CommunityComment,
} from '../types/community';
import { INITIAL_COMMUNITY_POSTS, communityService } from '../services/community';

interface CommunityState {
  posts: CommunityPost[];

  // Actions
  addPost: (
    input: CreatePostInput,
    author: { id?: string; name?: string; location?: string }
  ) => CommunityPost;
  deletePost: (postId: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (
    postId: string,
    content: string,
    author: { id?: string; name?: string; location?: string }
  ) => CommunityComment;
  resetToInitial: () => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: INITIAL_COMMUNITY_POSTS,

      addPost: (input, author) => {
        const authorName = author.name?.trim() || 'Ramesh Kumar';
        const newPost: CommunityPost = {
          id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          authorId: author.id || 'my-user',
          authorName,
          authorLocation: author.location || 'Telangana, India',
          authorAvatar: communityService.getInitials(authorName),
          isVerified: true,
          category: input.category,
          content: input.content.trim(),
          imageUrl: input.imageUrl,
          likesCount: 0,
          likedByMe: false,
          commentsCount: 0,
          comments: [],
          createdAt: 'Just now',
          tags: [input.category],
          isMyPost: true,
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));

        return newPost;
      },

      deletePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        }));
      },

      toggleLike: (postId: string) => {
        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            const willLike = !p.likedByMe;
            return {
              ...p,
              likedByMe: willLike,
              likesCount: willLike ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
            };
          }),
        }));
      },

      addComment: (postId, content, author) => {
        const authorName = author.name?.trim() || 'Ramesh Kumar';
        const newComment: CommunityComment = {
          id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          postId,
          authorId: author.id || 'my-user',
          authorName,
          authorLocation: author.location || 'Local Farmer',
          authorAvatar: communityService.getInitials(authorName),
          isVerified: true,
          content: content.trim(),
          createdAt: 'Just now',
        };

        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, newComment],
            };
          }),
        }));

        return newComment;
      },

      resetToInitial: () => {
        set({ posts: INITIAL_COMMUNITY_POSTS });
      },
    }),
    {
      name: 'raitusevak-community-posts',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
