import { LabourWorker, LabourBooking, LabourWorkType } from "@/types/labour";

export const SAMPLE_WORKERS: LabourWorker[] = [
  {
    id: "wrk-01",
    name: "Anji Reddy & Team",
    avatar: "AR",
    workTypes: ["harvesting", "sowing", "general"],
    specialization: "Paddy & Cotton Harvesting Crew",
    skills: ["Sickle Harvesting", "Threshing", "Transplanting", "Bale Loading"],
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 42,
    dailyRate: 500,
    hourlyRate: 70,
    location: "Tenali",
    mandal: "Tenali",
    district: "Guntur",
    distanceKm: 3.4,
    availability: "available",
    languages: ["Telugu", "Hindi"],
    verified: true,
    bio: "Experienced 8-member harvest crew specializing in fast paddy harvesting, mechanical bundling, and seasonal cotton picking. Reliable and punctual.",
    completedJobs: 128,
    crewSize: 8,
    phone: "+91 98480 12345",
  },
  {
    id: "wrk-02",
    name: "K. Venkateswarlu",
    avatar: "KV",
    workTypes: ["spraying"],
    specialization: "Precision Chemical & Organic Spraying",
    skills: ["Power Sprayer", "Battery Backpack", "Pesticide Safety", "Neem Formulation"],
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 31,
    dailyRate: 550,
    hourlyRate: 80,
    location: "Mangalagiri",
    mandal: "Mangalagiri",
    district: "Guntur",
    distanceKm: 5.2,
    availability: "available",
    languages: ["Telugu"],
    verified: true,
    bio: "Certified crop protection applicator with calibrated nozzle spraying techniques. Ensures uniform droplet distribution with minimal chemical waste.",
    completedJobs: 86,
    phone: "+91 98481 23456",
  },
  {
    id: "wrk-03",
    name: "Lakshmamma Labour Crew",
    avatar: "LL",
    workTypes: ["sowing", "weeding"],
    specialization: "Nursery Transplantation & Weeding Collective",
    skills: ["Line Sowing", "Hand Weeding", "Paddy Mat Nursery", "Herbicide Spotting"],
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 64,
    dailyRate: 450,
    hourlyRate: 65,
    location: "Wardhannapet",
    mandal: "Wardhannapet",
    district: "Warangal",
    distanceKm: 4.1,
    availability: "available",
    languages: ["Telugu"],
    verified: true,
    bio: "Skilled women's cooperative specialized in delicate paddy seedling transplantation and intensive row weeding. Fast work pace with high survival rate.",
    completedJobs: 175,
    crewSize: 12,
    phone: "+91 98482 34567",
  },
  {
    id: "wrk-04",
    name: "B. Srinivas",
    avatar: "BS",
    workTypes: ["harvesting", "general"],
    specialization: "Cotton Plucking & General Farm Hand",
    skills: ["Cotton Picking", "Post-Harvest Drying", "Farm Fencing", "Canal Cleaning"],
    experienceYears: 5,
    rating: 4.7,
    reviewCount: 22,
    dailyRate: 420,
    hourlyRate: 60,
    location: "Hanamkonda",
    mandal: "Kazipet",
    district: "Warangal",
    distanceKm: 6.8,
    availability: "available",
    languages: ["Telugu", "Hindi"],
    verified: true,
    bio: "Hardworking agricultural worker for heavy fieldwork, crop loading, bund repair, and seasonal harvest plucking.",
    completedJobs: 49,
    phone: "+91 98483 45678",
  },
  {
    id: "wrk-05",
    name: "M. Ramaiah",
    avatar: "MR",
    workTypes: ["general", "weeding"],
    specialization: "Irrigation Channels & Soil Preparation",
    skills: ["Drip Maintenance", "Trench Digging", "Fertilizer Broadcast", "Ridge Making"],
    experienceYears: 9,
    rating: 4.6,
    reviewCount: 38,
    dailyRate: 500,
    hourlyRate: 75,
    location: "Miryalaguda",
    mandal: "Miryalaguda",
    district: "Nalgonda",
    distanceKm: 8.5,
    availability: "busy",
    languages: ["Telugu"],
    verified: true,
    bio: "Experienced irrigation specialist managing canal outlets, drip filter cleaning, and pre-monsoon field preparation.",
    completedJobs: 92,
    phone: "+91 98484 56789",
  },
  {
    id: "wrk-06",
    name: "Savitri Farm Collective",
    avatar: "SC",
    workTypes: ["harvesting", "weeding"],
    specialization: "Chilli & Vegetable Harvesting",
    skills: ["Grade-wise Sorting", "Chilli Picking", "Drying Yard Management", "Packaging"],
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 45,
    dailyRate: 460,
    hourlyRate: 65,
    location: "Khammam Rural",
    mandal: "Khammam",
    district: "Khammam",
    distanceKm: 4.7,
    availability: "available",
    languages: ["Telugu"],
    verified: true,
    bio: "Experienced in export-quality Teja chilli plucking, stalk trimming, and sorting. Guarantees damage-free harvest handling.",
    completedJobs: 110,
    crewSize: 10,
    phone: "+91 98485 67890",
  },
];

export const labourService = {
  getWorkers: async (filters?: {
    workType?: LabourWorkType;
    search?: string;
    availability?: string;
    userProfile?: LabourWorker | null;
  }): Promise<LabourWorker[]> => {
    let result = [...SAMPLE_WORKERS];

    // Connect user-created active labour profile to discovery
    // Inactive profile (isActive === false) is excluded from active discovery
    if (filters?.userProfile && filters.userProfile.isActive !== false) {
      result = [filters.userProfile, ...result.filter((w) => w.id !== filters.userProfile!.id)];
    }

    if (filters?.workType && filters.workType !== "all") {
      result = result.filter((w) => w.workTypes.includes(filters.workType!));
    }

    if (filters?.availability && filters.availability !== "all") {
      result = result.filter((w) => w.availability === filters.availability);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.specialization.toLowerCase().includes(q) ||
          w.location.toLowerCase().includes(q) ||
          w.district.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q)) ||
          w.workTypes.some((wt) => wt.toLowerCase().includes(q))
      );
    }

    return result;
  },

  getWorkerById: async (
    id: string,
    userProfile?: LabourWorker | null
  ): Promise<LabourWorker | undefined> => {
    if (userProfile && userProfile.id === id) {
      return userProfile;
    }
    return SAMPLE_WORKERS.find((w) => w.id === id);
  },
};
