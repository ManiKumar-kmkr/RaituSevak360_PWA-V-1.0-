import {
  CommunityPost,
  CommunityCategory,
  CommunityFilter,
  CreatePostInput,
  CommunityComment,
} from '@/types/community';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-ramesh',
    authorName: 'Ramesh Kumar',
    authorLocation: 'Kazipet, Telangana',
    authorAvatar: 'RK',
    isVerified: true,
    category: 'crop-issues',
    content:
      'My paddy leaves are turning yellow after heavy rainfall. Has anyone faced the same issue? Looking for recommendations on soil drainage and micronutrient spray.',
    imageUrl:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    likesCount: 24,
    likedByMe: false,
    commentsCount: 2,
    comments: [
      {
        id: 'comm-101',
        postId: 'post-1',
        authorId: 'usr-suresh',
        authorName: 'Suresh Goud',
        authorLocation: 'Khammam',
        authorAvatar: 'SG',
        isVerified: true,
        content:
          'I faced the same problem last week. First ensure stagnant water is completely drained from the field corners.',
        createdAt: '2h ago',
      },
      {
        id: 'comm-102',
        postId: 'post-1',
        authorId: 'usr-ravi',
        authorName: 'Ravi Teja',
        authorLocation: 'Warangal',
        authorAvatar: 'RT',
        content:
          'Try spraying Zinc Sulphate (5g/L) mixed with 1% Urea during morning hours. It helped my BPT crop recover in 4 days.',
        createdAt: '1h ago',
      },
    ],
    createdAt: '2h ago',
    tags: ['paddy', 'yellowing', 'rainfall', 'zinc', 'drainage'],
    isMyPost: false,
  },
  {
    id: 'post-2',
    authorId: 'usr-suresh',
    authorName: 'Suresh Goud',
    authorLocation: 'Khammam, Telangana',
    authorAvatar: 'SG',
    isVerified: true,
    category: 'market-talk',
    content:
      'Teja chilli prices reached ₹18,500/quintal in Khammam AMC today. High export demand for dried pods. Expecting steady rates through next week.',
    likesCount: 42,
    likedByMe: false,
    commentsCount: 1,
    comments: [
      {
        id: 'comm-201',
        postId: 'post-2',
        authorId: 'usr-venkat',
        authorName: 'Venkatesh Naidu',
        authorLocation: 'Guntur',
        authorAvatar: 'VN',
        content:
          'In Guntur yard it opened at ₹18,200 for grade-A Teja. Quality pods are commanding a good premium.',
        createdAt: '3h ago',
      },
    ],
    createdAt: '4h ago',
    tags: ['chilli', 'teja', 'mandi', 'khammam', 'market-prices'],
    isMyPost: false,
  },
  {
    id: 'post-3',
    authorId: 'usr-anji',
    authorName: 'Anji Reddy',
    authorLocation: 'Tenali, Andhra Pradesh',
    authorAvatar: 'AR',
    isVerified: true,
    category: 'tips',
    content:
      'Effective organic spray for aphids and whiteflies: 5ml Neem oil (10,000 ppm) + 2ml liquid soap per litre of water. Spray during late evening hours for maximum coverage.',
    likesCount: 68,
    likedByMe: true,
    commentsCount: 1,
    comments: [
      {
        id: 'comm-301',
        postId: 'post-3',
        authorId: 'usr-lakshmi',
        authorName: 'Lakshmamma',
        authorLocation: 'Mangalagiri',
        authorAvatar: 'LM',
        content:
          'Works wonderfully on bhendi and brinjal too! Make sure the solution is properly emulsified.',
        createdAt: '5h ago',
      },
    ],
    createdAt: '6h ago',
    tags: ['organic', 'neem-oil', 'pest-control', 'tips', 'aphids'],
    isMyPost: false,
  },
  {
    id: 'post-4',
    authorId: 'usr-venkat',
    authorName: 'Venkatesh Naidu',
    authorLocation: 'Guntur, Andhra Pradesh',
    authorAvatar: 'VN',
    isVerified: false,
    category: 'questions',
    content:
      'What is the recommended lateral spacing for drip irrigation in Bt Cotton on heavy black cotton soil? Is 4 feet lateral spacing sufficient or should I go with 5 feet?',
    likesCount: 15,
    likedByMe: false,
    commentsCount: 1,
    comments: [
      {
        id: 'comm-401',
        postId: 'post-4',
        authorId: 'usr-radhika',
        authorName: 'Dr. K. Radhika',
        authorLocation: 'Warangal',
        authorAvatar: 'KR',
        isVerified: true,
        content:
          'For heavy black soil, 4.5 to 5 feet paired row lateral spacing is optimal to prevent root waterlogging during monsoon.',
        createdAt: '7h ago',
      },
    ],
    createdAt: '8h ago',
    tags: ['drip-irrigation', 'cotton', 'black-soil', 'spacing', 'irrigation'],
    isMyPost: false,
  },
  {
    id: 'post-5',
    authorId: 'usr-radhika',
    authorName: 'Dr. K. Radhika',
    authorLocation: 'Warangal, Telangana',
    authorAvatar: 'KR',
    isVerified: true,
    category: 'crop-issues',
    content:
      'Early alert: Fall Armyworm egg masses spotted in Kharif maize fields across Warangal rural. Farmers are advised to set up pheromone traps (5 traps/acre) and scout leaf whorls.',
    imageUrl:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    likesCount: 53,
    likedByMe: false,
    commentsCount: 1,
    comments: [
      {
        id: 'comm-501',
        postId: 'post-5',
        authorId: 'usr-ramesh',
        authorName: 'Ramesh Kumar',
        authorLocation: 'Kazipet',
        authorAvatar: 'RK',
        isVerified: true,
        content:
          'Thank you doctor. Installed 5 traps yesterday and already caught adult moths. Will apply neem cake in whorls.',
        createdAt: '10h ago',
      },
    ],
    createdAt: '12h ago',
    tags: ['maize', 'fall-armyworm', 'pest-alert', 'pheromone-traps', 'advisory'],
    isMyPost: false,
  },
  {
    id: 'post-6',
    authorId: 'usr-ramanaiah',
    authorName: 'B. Ramanaiah',
    authorLocation: 'Nalgonda, Telangana',
    authorAvatar: 'BR',
    isVerified: true,
    category: 'tips',
    content:
      'Successfully installed a 6-line solar fence around our 5-acre groundnut field. Wild boar crop damage has dropped to zero this season. Check state horticulture subsidy for 50% cost assistance.',
    likesCount: 37,
    likedByMe: false,
    commentsCount: 1,
    comments: [
      {
        id: 'comm-601',
        postId: 'post-6',
        authorId: 'usr-suresh',
        authorName: 'Suresh Goud',
        authorLocation: 'Khammam',
        authorAvatar: 'SG',
        isVerified: true,
        content: 'How much was the net cost after subsidy per acre brother?',
        createdAt: '1d ago',
      },
    ],
    createdAt: '1d ago',
    tags: ['solar-fence', 'groundnut', 'wild-boar', 'subsidy', 'fencing'],
    isMyPost: false,
  },
];

export const communityService = {
  /**
   * Filters and searches posts
   */
  filterPosts: (
    posts: CommunityPost[],
    filters?: { category?: CommunityFilter; search?: string }
  ): CommunityPost[] => {
    let result = [...posts];

    // Filter by Category
    if (filters?.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Search against content, author name, category, and tags
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((p) => {
        const inContent = p.content.toLowerCase().includes(q);
        const inAuthor = p.authorName.toLowerCase().includes(q);
        const inLocation = p.authorLocation
          ? p.authorLocation.toLowerCase().includes(q)
          : false;
        const inCategory = p.category.toLowerCase().includes(q);
        const inTags = p.tags.some((tag) => tag.toLowerCase().includes(q));
        return inContent || inAuthor || inLocation || inCategory || inTags;
      });
    }

    return result;
  },

  /**
   * Generates initials from full name
   */
  getInitials: (name: string): string => {
    if (!name) return 'F';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  },
};

export default communityService;
