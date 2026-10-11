export type CommunityCategory =
  | 'crop-issues'
  | 'market-talk'
  | 'tips'
  | 'questions';

export type CommunityFilter = 'all' | CommunityCategory;

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorLocation?: string;
  authorAvatar?: string;
  isVerified?: boolean;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorLocation?: string;
  authorAvatar?: string;
  isVerified?: boolean;
  category: CommunityCategory;
  content: string;
  imageUrl?: string;
  likesCount: number;
  likedByMe?: boolean;
  commentsCount: number;
  comments: CommunityComment[];
  createdAt: string;
  tags: string[];
  isMyPost?: boolean;
}

export interface CreatePostInput {
  content: string;
  category: CommunityCategory;
  imageUrl?: string;
}
