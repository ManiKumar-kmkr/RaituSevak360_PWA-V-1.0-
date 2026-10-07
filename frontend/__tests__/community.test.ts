import { communityService, INITIAL_COMMUNITY_POSTS } from "../services/community";
import { useCommunityStore } from "../store/community-store";
import { CommunityCategory, CommunityFilter, CreatePostInput } from "../types/community";

describe("Farmer Community Module - Services & Data Integrity", () => {
  it("should have realistic initial seed discussions with honest development attributes", () => {
    expect(INITIAL_COMMUNITY_POSTS.length).toBeGreaterThanOrEqual(5);

    INITIAL_COMMUNITY_POSTS.forEach((post) => {
      // Must have valid IDs and farmer credentials
      expect(post.id).toBeTruthy();
      expect(post.authorId).toBeTruthy();
      expect(post.authorName).toBeTruthy();
      expect(post.authorLocation).toBeTruthy();
      expect(post.authorAvatar).toBeTruthy();

      // Category must be one of the Figma categories
      expect(["crop-issues", "market-talk", "tips", "questions"]).toContain(post.category);

      // Post text must be meaningful agricultural content
      expect(post.content.length).toBeGreaterThan(10);
      expect(post.content.length).toBeLessThanOrEqual(500);

      // Reaction and comments must be numeric
      expect(post.likesCount).toBeGreaterThanOrEqual(0);
      expect(post.commentsCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(post.comments)).toBe(true);
      expect(post.comments.length).toBe(post.commentsCount);

      // Comments must have valid structure
      post.comments.forEach((comment) => {
        expect(comment.id).toBeTruthy();
        expect(comment.postId).toBe(post.id);
        expect(comment.authorName).toBeTruthy();
        expect(comment.content).toBeTruthy();
        expect(comment.createdAt).toBeTruthy();
      });
    });
  });

  it("should cover all Figma categories in seeded data", () => {
    const categories = INITIAL_COMMUNITY_POSTS.map((p) => p.category);
    expect(categories).toContain("crop-issues");
    expect(categories).toContain("market-talk");
    expect(categories).toContain("tips");
    expect(categories).toContain("questions");
  });

  it("should filter posts by category correctly", () => {
    // All
    const allPosts = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "all",
    });
    expect(allPosts.length).toBe(INITIAL_COMMUNITY_POSTS.length);

    // Crop Issues
    const cropIssues = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "crop-issues",
    });
    expect(cropIssues.length).toBeGreaterThan(0);
    cropIssues.forEach((p) => expect(p.category).toBe("crop-issues"));

    // Market Talk
    const marketTalk = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "market-talk",
    });
    expect(marketTalk.length).toBeGreaterThan(0);
    marketTalk.forEach((p) => expect(p.category).toBe("market-talk"));

    // Tips
    const tips = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "tips",
    });
    expect(tips.length).toBeGreaterThan(0);
    tips.forEach((p) => expect(p.category).toBe("tips"));

    // Questions
    const questions = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "questions",
    });
    expect(questions.length).toBeGreaterThan(0);
    questions.forEach((p) => expect(p.category).toBe("questions"));
  });

  it("should search case-insensitively across post content, farmer name, and tags", () => {
    // Search for 'paddy'
    const paddyResults = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      search: "paddy",
    });
    expect(paddyResults.length).toBeGreaterThan(0);
    paddyResults.forEach((p) => {
      const match =
        p.content.toLowerCase().includes("paddy") ||
        p.authorName.toLowerCase().includes("paddy") ||
        p.tags?.some((t) => t.toLowerCase().includes("paddy"));
      expect(match).toBe(true);
    });

    // Search with uppercase 'PADDY' should yield identical results
    const upperPaddyResults = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      search: "PADDY",
    });
    expect(upperPaddyResults.length).toBe(paddyResults.length);

    // Search by author name 'Ramesh'
    const rameshResults = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      search: "Ramesh",
    });
    expect(rameshResults.length).toBeGreaterThan(0);
    expect(rameshResults.some((p) => p.authorName.includes("Ramesh"))).toBe(true);
  });

  it("should combine search and category filter correctly", () => {
    // Search 'chilli' with category 'market-talk'
    const combined = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "market-talk",
      search: "chilli",
    });
    expect(combined.length).toBeGreaterThan(0);
    combined.forEach((p) => {
      expect(p.category).toBe("market-talk");
      expect(
        p.content.toLowerCase().includes("chilli") ||
          p.tags?.some((t) => t.toLowerCase().includes("chilli"))
      ).toBe(true);
    });

    // Filtering for category 'tips' with 'chilli' should return empty if no tips match
    const tipsChilli = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      category: "tips",
      search: "chilli",
    });
    expect(tipsChilli.length).toBe(0);
  });

  it("should return empty list when search term has no matches", () => {
    const noResults = communityService.filterPosts(INITIAL_COMMUNITY_POSTS, {
      search: "nonexistentfarmtermxyz123",
    });
    expect(noResults.length).toBe(0);
  });
});

describe("Farmer Community - Zustand Store & User Interactions", () => {
  beforeEach(() => {
    useCommunityStore.getState().resetToInitial();
  });

  it("should allow creating a new post and prepend it to the feed", () => {
    const initialCount = useCommunityStore.getState().posts.length;

    const newPostInput: CreatePostInput = {
      content: "Testing fall armyworm pheromone traps in my maize field today.",
      category: "tips",
      imageUrl: "https://example.com/maize-trap.jpg",
    };

    const created = useCommunityStore.getState().addPost(newPostInput, {
      id: "my-farmer-id",
      name: "Venkat Rao",
      location: "Khammam, Telangana",
    });

    expect(created.id).toBeTruthy();
    expect(created.content).toBe(newPostInput.content);
    expect(created.category).toBe("tips");
    expect(created.imageUrl).toBe(newPostInput.imageUrl);
    expect(created.authorName).toBe("Venkat Rao");
    expect(created.isMyPost).toBe(true);
    expect(created.likesCount).toBe(0);
    expect(created.likedByMe).toBe(false);
    expect(created.commentsCount).toBe(0);

    const posts = useCommunityStore.getState().posts;
    expect(posts.length).toBe(initialCount + 1);
    expect(posts[0].id).toBe(created.id); // Prepended at the top
  });

  it("should toggle like reaction (increment on like, decrement on unlike)", () => {
    const firstPost = useCommunityStore.getState().posts[0];
    const initialLikes = firstPost.likesCount;
    const initialLikedState = firstPost.likedByMe;

    // Toggle 1: Like
    useCommunityStore.getState().toggleLike(firstPost.id);
    let updated = useCommunityStore.getState().posts.find((p) => p.id === firstPost.id);
    expect(updated?.likedByMe).toBe(!initialLikedState);
    expect(updated?.likesCount).toBe(initialLikedState ? initialLikes - 1 : initialLikes + 1);

    // Toggle 2: Unlike
    useCommunityStore.getState().toggleLike(firstPost.id);
    updated = useCommunityStore.getState().posts.find((p) => p.id === firstPost.id);
    expect(updated?.likedByMe).toBe(initialLikedState);
    expect(updated?.likesCount).toBe(initialLikes);
  });

  it("should add a comment and increment comment count immediately", () => {
    const firstPost = useCommunityStore.getState().posts[0];
    const initialCommentsCount = firstPost.commentsCount;

    const comment = useCommunityStore.getState().addComment(
      firstPost.id,
      "Ensure proper sub-surface drainage before applying potassium.",
      {
        id: "commenter-1",
        name: "Dr. Anji Reddy",
        location: "Warangal",
      }
    );

    expect(comment.id).toBeTruthy();
    expect(comment.postId).toBe(firstPost.id);
    expect(comment.authorName).toBe("Dr. Anji Reddy");
    expect(comment.content).toContain("drainage");

    const updatedPost = useCommunityStore.getState().posts.find((p) => p.id === firstPost.id);
    expect(updatedPost?.commentsCount).toBe(initialCommentsCount + 1);
    expect(updatedPost?.comments.some((c) => c.id === comment.id)).toBe(true);
  });

  it("should allow deleting a post", () => {
    // Add a post first
    const created = useCommunityStore.getState().addPost(
      {
        content: "Post to be deleted.",
        category: "questions",
      },
      { id: "my-id", name: "Tester" }
    );

    expect(useCommunityStore.getState().posts.some((p) => p.id === created.id)).toBe(true);

    // Delete post
    useCommunityStore.getState().deletePost(created.id);
    expect(useCommunityStore.getState().posts.some((p) => p.id === created.id)).toBe(false);
  });
});

describe("Farmer Community - Localization Parity", () => {
  it("should have complete and aligned localization keys across en, te, and hi", () => {
    const en = require("../locales/en.json");
    const te = require("../locales/te.json");
    const hi = require("../locales/hi.json");

    expect(en.community).toBeDefined();
    expect(te.community).toBeDefined();
    expect(hi.community).toBeDefined();

    const enKeys = Object.keys(en.community).sort();
    const teKeys = Object.keys(te.community).sort();
    const hiKeys = Object.keys(hi.community).sort();

    expect(enKeys.length).toBeGreaterThan(25);
    expect(teKeys).toEqual(enKeys);
    expect(hiKeys).toEqual(enKeys);
  });

  it("should have community dashboard tile entries in en, te, and hi", () => {
    const en = require("../locales/en.json");
    const te = require("../locales/te.json");
    const hi = require("../locales/hi.json");

    expect(en.dashboard.communityTile).toBeTruthy();
    expect(en.dashboard.communityTileDesc).toBeTruthy();

    expect(te.dashboard.communityTile).toBeTruthy();
    expect(te.dashboard.communityTileDesc).toBeTruthy();

    expect(hi.dashboard.communityTile).toBeTruthy();
    expect(hi.dashboard.communityTileDesc).toBeTruthy();
  });
});
