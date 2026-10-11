import {
  WelfareProgrammeReport,
  MandalImpactBreakdown,
  DemoBeneficiaryRecord,
  WelfareFilterState,
} from "@/types/welfare-report";

export const DISTRICT_MANDALS_MAP: Record<string, string[]> = {
  Guntur: ["Tenali", "Mangalagiri", "Amaravati", "Ponnur", "Tadikonda"],
  Krishna: ["Gudivada", "Machilipatnam", "Vijayawada Rural", "Vuyyuru", "Nuzvid"],
  "West Godavari": ["Bhimavaram", "Eluru Rural", "Tadepalligudem", "Tanuku", "Palakollu"],
  Kurnool: ["Adoni", "Nandyal", "Dhone", "Yemmiganur", "Alur"],
  Prakasam: ["Ongole", "Chirala", "Markapur", "Kandukur", "Addanki"],
};

export const ALL_DISTRICTS = Object.keys(DISTRICT_MANDALS_MAP);

export const REPORTING_PERIODS = [
  { id: "all", label: "All Reporting Periods" },
  { id: "Kharif 2026", label: "Kharif 2026" },
  { id: "Rabi 2025-26", label: "Rabi 2025-26" },
  { id: "Annual 2025-26", label: "Annual 2025-26" },
];

export const DEMO_WELFARE_PROGRAMMES: WelfareProgrammeReport[] = [
  {
    id: "WLF-AP-FFA-01",
    name: "Farmer Financial Assistance Scheme",
    shortCode: "FFA-2026",
    category: "financial_assistance",
    categoryLabel: "Financial Assistance",
    description: "Direct welfare transfer ensuring timely working capital for smallholders prior to sowing operations.",
    reportingPeriod: "Kharif 2026",
    targetBeneficiaries: 18500,
    registeredBeneficiaries: 17200,
    approvedApplications: 15400,
    benefitsDistributed: 14200,
    pendingApplications: 1200,
    underReviewApplications: 600,
    rejectedApplications: 0,
    allocatedBudgetRupees: 185000000, // ₹18.5 Cr
    approvedBudgetRupees: 154000000,  // ₹15.4 Cr
    disbursedBudgetRupees: 142000000, // ₹14.2 Cr
    districtsCovered: ["Guntur", "Krishna", "West Godavari", "Kurnool", "Prakasam"],
    lastUpdated: "2026-10-08 17:30 IST",
    dataSource: "State Agriculture MIS Demo Engine v1.0",
    mandalBreakdown: [
      { district: "Guntur", mandal: "Tenali", targetCount: 1500, registeredCount: 1420, approvedCount: 1310, distributedCount: 1220, pendingCount: 90 },
      { district: "Guntur", mandal: "Mangalagiri", targetCount: 1200, registeredCount: 1150, approvedCount: 1040, distributedCount: 980, pendingCount: 70 },
      { district: "Krishna", mandal: "Gudivada", targetCount: 1400, registeredCount: 1320, approvedCount: 1210, distributedCount: 1140, pendingCount: 80 },
      { district: "West Godavari", mandal: "Bhimavaram", targetCount: 1300, registeredCount: 1240, approvedCount: 1120, distributedCount: 1050, pendingCount: 90 },
      { district: "Kurnool", mandal: "Adoni", targetCount: 1600, registeredCount: 1480, approvedCount: 1300, distributedCount: 1180, pendingCount: 120 },
      { district: "Prakasam", mandal: "Ongole", targetCount: 1250, registeredCount: 1180, approvedCount: 1060, distributedCount: 990, pendingCount: 80 },
    ],
    sampleBeneficiaries: [
      {
        referenceId: "BEN-AP-2026-0101",
        farmerAlias: "V. R****** (Demo)",
        district: "Guntur",
        mandal: "Tenali",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "DBT Direct Working Capital",
        sanctionedAmountRupees: 10000,
        disbursedAmountRupees: 10000,
        status: "distributed",
        approvalDate: "2026-08-14",
        distributionDate: "2026-08-28",
      },
      {
        referenceId: "BEN-AP-2026-0102",
        farmerAlias: "K. S****** (Demo)",
        district: "Guntur",
        mandal: "Mangalagiri",
        landholdingCategory: "Marginal (< 1 Ha)",
        benefitType: "DBT Direct Working Capital",
        sanctionedAmountRupees: 10000,
        disbursedAmountRupees: 10000,
        status: "distributed",
        approvalDate: "2026-08-15",
        distributionDate: "2026-08-29",
      },
      {
        referenceId: "BEN-AP-2026-0103",
        farmerAlias: "M. N****** (Demo)",
        district: "Krishna",
        mandal: "Gudivada",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "DBT Direct Working Capital",
        sanctionedAmountRupees: 10000,
        disbursedAmountRupees: 0,
        status: "approved",
        approvalDate: "2026-09-02",
      },
      {
        referenceId: "BEN-AP-2026-0104",
        farmerAlias: "P. L****** (Demo)",
        district: "Kurnool",
        mandal: "Adoni",
        landholdingCategory: "Semi-Medium (2-4 Ha)",
        benefitType: "DBT Direct Working Capital",
        sanctionedAmountRupees: 10000,
        disbursedAmountRupees: 0,
        status: "pending",
        approvalDate: "2026-09-18",
      },
    ],
  },
  {
    id: "WLF-AP-IRR-02",
    name: "Micro-Irrigation & Drip Support Programme",
    shortCode: "IRR-2026",
    category: "irrigation_support",
    categoryLabel: "Irrigation Support",
    description: "Capital subsidy for precision drip and sprinkler equipment installations targeting water-scarce zones.",
    reportingPeriod: "Kharif 2026",
    targetBeneficiaries: 9200,
    registeredBeneficiaries: 8450,
    approvedApplications: 7120,
    benefitsDistributed: 6180,
    pendingApplications: 880,
    underReviewApplications: 450,
    rejectedApplications: 0,
    allocatedBudgetRupees: 138000000, // ₹13.8 Cr
    approvedBudgetRupees: 106800000,  // ₹10.68 Cr
    disbursedBudgetRupees: 92700000,   // ₹9.27 Cr
    districtsCovered: ["Kurnool", "Prakasam", "Guntur"],
    lastUpdated: "2026-10-07 14:15 IST",
    dataSource: "State Agriculture MIS Demo Engine v1.0",
    mandalBreakdown: [
      { district: "Kurnool", mandal: "Adoni", targetCount: 1800, registeredCount: 1650, approvedCount: 1420, distributedCount: 1250, pendingCount: 150 },
      { district: "Kurnool", mandal: "Dhone", targetCount: 1500, registeredCount: 1390, approvedCount: 1190, distributedCount: 1040, pendingCount: 130 },
      { district: "Prakasam", mandal: "Markapur", targetCount: 1400, registeredCount: 1280, approvedCount: 1090, distributedCount: 960, pendingCount: 120 },
      { district: "Guntur", mandal: "Amaravati", targetCount: 1200, registeredCount: 1100, approvedCount: 940, distributedCount: 820, pendingCount: 110 },
    ],
    sampleBeneficiaries: [
      {
        referenceId: "BEN-AP-2026-0201",
        farmerAlias: "S. B****** (Demo)",
        district: "Kurnool",
        mandal: "Adoni",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "Drip Irrigation Unit Subsidy",
        sanctionedAmountRupees: 28000,
        disbursedAmountRupees: 28000,
        status: "distributed",
        approvalDate: "2026-07-20",
        distributionDate: "2026-08-12",
      },
      {
        referenceId: "BEN-AP-2026-0202",
        farmerAlias: "T. C****** (Demo)",
        district: "Prakasam",
        mandal: "Markapur",
        landholdingCategory: "Medium (4-10 Ha)",
        benefitType: "Sprinkler Set Subsidy",
        sanctionedAmountRupees: 22000,
        disbursedAmountRupees: 0,
        status: "approved",
        approvalDate: "2026-08-30",
      },
      {
        referenceId: "BEN-AP-2026-0203",
        farmerAlias: "D. H****** (Demo)",
        district: "Kurnool",
        mandal: "Dhone",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "Drip Irrigation Unit Subsidy",
        sanctionedAmountRupees: 28000,
        disbursedAmountRupees: 0,
        status: "pending",
        approvalDate: "2026-09-12",
      },
    ],
  },
  {
    id: "WLF-AP-SFD-03",
    name: "Certified Seed & Fertilizer Subsidy",
    shortCode: "SFD-2026",
    category: "seed_fertilizer",
    categoryLabel: "Seed & Fertilizer",
    description: "Distribution of high-yielding certified seeds (paddy, pulses) and soil-specific bio-fertilizers through Rythu Bharosa Kendras.",
    reportingPeriod: "Kharif 2026",
    targetBeneficiaries: 24000,
    registeredBeneficiaries: 22800,
    approvedApplications: 21600,
    benefitsDistributed: 20400,
    pendingApplications: 850,
    underReviewApplications: 350,
    rejectedApplications: 0,
    allocatedBudgetRupees: 96000000,  // ₹9.6 Cr
    approvedBudgetRupees: 86400000,   // ₹8.64 Cr
    disbursedBudgetRupees: 81600000,  // ₹8.16 Cr
    districtsCovered: ["West Godavari", "Krishna", "Guntur", "Prakasam"],
    lastUpdated: "2026-10-09 11:00 IST",
    dataSource: "State Agriculture MIS Demo Engine v1.0",
    mandalBreakdown: [
      { district: "West Godavari", mandal: "Bhimavaram", targetCount: 3200, registeredCount: 3080, approvedCount: 2940, distributedCount: 2810, pendingCount: 90 },
      { district: "West Godavari", mandal: "Tanuku", targetCount: 2800, registeredCount: 2690, approvedCount: 2560, distributedCount: 2440, pendingCount: 80 },
      { district: "Krishna", mandal: "Machilipatnam", targetCount: 3100, registeredCount: 2950, approvedCount: 2810, distributedCount: 2670, pendingCount: 90 },
      { district: "Guntur", mandal: "Ponnur", targetCount: 2900, registeredCount: 2780, approvedCount: 2640, distributedCount: 2510, pendingCount: 80 },
    ],
    sampleBeneficiaries: [
      {
        referenceId: "BEN-AP-2026-0301",
        farmerAlias: "A. Y****** (Demo)",
        district: "West Godavari",
        mandal: "Bhimavaram",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "Subsidized Paddy Seed Kit",
        sanctionedAmountRupees: 4200,
        disbursedAmountRupees: 4200,
        status: "distributed",
        approvalDate: "2026-06-15",
        distributionDate: "2026-06-25",
      },
      {
        referenceId: "BEN-AP-2026-0302",
        farmerAlias: "G. V****** (Demo)",
        district: "Krishna",
        mandal: "Machilipatnam",
        landholdingCategory: "Marginal (< 1 Ha)",
        benefitType: "Bio-Fertilizer Consortia",
        sanctionedAmountRupees: 3800,
        disbursedAmountRupees: 3800,
        status: "distributed",
        approvalDate: "2026-06-20",
        distributionDate: "2026-07-02",
      },
    ],
  },
  {
    id: "WLF-AP-CPS-04",
    name: "Integrated Crop Protection Support",
    shortCode: "CPS-2026",
    category: "crop_protection",
    categoryLabel: "Crop Protection Support",
    description: "Bio-agent pheromone traps, yellow sticky cards, and eco-friendly biocides distributed to curtail whitefly and pink bollworm pests.",
    reportingPeriod: "Kharif 2026",
    targetBeneficiaries: 14500,
    registeredBeneficiaries: 13400,
    approvedApplications: 11900,
    benefitsDistributed: 10750,
    pendingApplications: 1020,
    underReviewApplications: 480,
    rejectedApplications: 0,
    allocatedBudgetRupees: 58000000,  // ₹5.8 Cr
    approvedBudgetRupees: 47600000,   // ₹4.76 Cr
    disbursedBudgetRupees: 43000000,  // ₹4.3 Cr
    districtsCovered: ["Guntur", "Kurnool", "Prakasam"],
    lastUpdated: "2026-10-06 16:45 IST",
    dataSource: "State Agriculture MIS Demo Engine v1.0",
    mandalBreakdown: [
      { district: "Guntur", mandal: "Tadikonda", targetCount: 2200, registeredCount: 2050, approvedCount: 1840, distributedCount: 1680, pendingCount: 140 },
      { district: "Kurnool", mandal: "Yemmiganur", targetCount: 2500, registeredCount: 2310, approvedCount: 2060, distributedCount: 1870, pendingCount: 160 },
      { district: "Prakasam", mandal: "Chirala", targetCount: 1900, registeredCount: 1760, approvedCount: 1570, distributedCount: 1420, pendingCount: 120 },
    ],
    sampleBeneficiaries: [
      {
        referenceId: "BEN-AP-2026-0401",
        farmerAlias: "C. R****** (Demo)",
        district: "Guntur",
        mandal: "Tadikonda",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "Pheromone Trap & Biocide Kit",
        sanctionedAmountRupees: 4500,
        disbursedAmountRupees: 4500,
        status: "distributed",
        approvalDate: "2026-08-01",
        distributionDate: "2026-08-15",
      },
      {
        referenceId: "BEN-AP-2026-0402",
        farmerAlias: "E. S****** (Demo)",
        district: "Kurnool",
        mandal: "Yemmiganur",
        landholdingCategory: "Semi-Medium (2-4 Ha)",
        benefitType: "IPM Bio-agent Pack",
        sanctionedAmountRupees: 4500,
        disbursedAmountRupees: 0,
        status: "approved",
        approvalDate: "2026-08-25",
      },
    ],
  },
  {
    id: "WLF-AP-AES-05",
    name: "Agricultural Equipment Subsidy",
    shortCode: "AES-2026",
    category: "equipment_subsidy",
    categoryLabel: "Equipment Subsidy",
    description: "Capital grant covering 40% to 50% cost of tractor-drawn implements, power tillers, rotavators, and harvesters for farmer collectives.",
    reportingPeriod: "Rabi 2025-26",
    targetBeneficiaries: 4800,
    registeredBeneficiaries: 4350,
    approvedApplications: 3620,
    benefitsDistributed: 3150,
    pendingApplications: 520,
    underReviewApplications: 210,
    rejectedApplications: 0,
    allocatedBudgetRupees: 192000000, // ₹19.2 Cr
    approvedBudgetRupees: 144800000,  // ₹14.48 Cr
    disbursedBudgetRupees: 126000000, // ₹12.6 Cr
    districtsCovered: ["West Godavari", "Krishna", "Guntur", "Kurnool"],
    lastUpdated: "2026-10-05 18:20 IST",
    dataSource: "State Agriculture MIS Demo Engine v1.0",
    mandalBreakdown: [
      { district: "West Godavari", mandal: "Eluru Rural", targetCount: 950, registeredCount: 880, approvedCount: 740, distributedCount: 650, pendingCount: 90 },
      { district: "Krishna", mandal: "Vuyyuru", targetCount: 880, registeredCount: 810, approvedCount: 680, distributedCount: 600, pendingCount: 80 },
      { district: "Guntur", mandal: "Tenali", targetCount: 1020, registeredCount: 930, approvedCount: 780, distributedCount: 680, pendingCount: 100 },
      { district: "Kurnool", mandal: "Adoni", targetCount: 980, registeredCount: 890, approvedCount: 740, distributedCount: 640, pendingCount: 100 },
    ],
    sampleBeneficiaries: [
      {
        referenceId: "BEN-AP-2026-0501",
        farmerAlias: "N. T****** (Demo)",
        district: "West Godavari",
        mandal: "Eluru Rural",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "Rotavator Implement Subsidy",
        sanctionedAmountRupees: 45000,
        disbursedAmountRupees: 45000,
        status: "distributed",
        approvalDate: "2026-03-10",
        distributionDate: "2026-04-05",
      },
      {
        referenceId: "BEN-AP-2026-0502",
        farmerAlias: "B. K****** (Demo)",
        district: "Krishna",
        mandal: "Vuyyuru",
        landholdingCategory: "Semi-Medium (2-4 Ha)",
        benefitType: "Power Tiller Subsidy",
        sanctionedAmountRupees: 65000,
        disbursedAmountRupees: 0,
        status: "approved",
        approvalDate: "2026-04-12",
      },
    ],
  },
  {
    id: "WLF-AP-SHM-06",
    name: "Soil Health & Micronutrient Assistance",
    shortCode: "SHM-2026",
    category: "soil_health",
    categoryLabel: "Soil Health & Micronutrient",
    description: "Grid-based soil sampling, computerized nutrient advisory cards, and targeted distribution of zinc and gypsum supplements.",
    reportingPeriod: "Annual 2025-26",
    targetBeneficiaries: 16000,
    registeredBeneficiaries: 15100,
    approvedApplications: 13950,
    benefitsDistributed: 13200,
    pendingApplications: 780,
    underReviewApplications: 370,
    rejectedApplications: 0,
    allocatedBudgetRupees: 48000000,  // ₹4.8 Cr
    approvedBudgetRupees: 41850000,   // ₹4.185 Cr
    disbursedBudgetRupees: 39600000,  // ₹3.96 Cr
    districtsCovered: ["Guntur", "Krishna", "West Godavari", "Kurnool", "Prakasam"],
    lastUpdated: "2026-10-04 12:10 IST",
    dataSource: "State Agriculture MIS Demo Engine v1.0",
    mandalBreakdown: [
      { district: "Guntur", mandal: "Amaravati", targetCount: 1500, registeredCount: 1420, approvedCount: 1320, distributedCount: 1260, pendingCount: 60 },
      { district: "Krishna", mandal: "Nuzvid", targetCount: 1600, registeredCount: 1510, approvedCount: 1400, distributedCount: 1330, pendingCount: 70 },
      { district: "West Godavari", mandal: "Palakollu", targetCount: 1550, registeredCount: 1470, approvedCount: 1360, distributedCount: 1290, pendingCount: 70 },
      { district: "Kurnool", mandal: "Alur", targetCount: 1700, registeredCount: 1590, approvedCount: 1460, distributedCount: 1380, pendingCount: 80 },
      { district: "Prakasam", mandal: "Addanki", targetCount: 1450, registeredCount: 1370, approvedCount: 1260, distributedCount: 1190, pendingCount: 70 },
    ],
    sampleBeneficiaries: [
      {
        referenceId: "BEN-AP-2026-0601",
        farmerAlias: "L. J****** (Demo)",
        district: "Guntur",
        mandal: "Amaravati",
        landholdingCategory: "Marginal (< 1 Ha)",
        benefitType: "Soil Card & Zinc Supplement Pack",
        sanctionedAmountRupees: 3000,
        disbursedAmountRupees: 3000,
        status: "distributed",
        approvalDate: "2026-02-18",
        distributionDate: "2026-03-01",
      },
      {
        referenceId: "BEN-AP-2026-0602",
        farmerAlias: "R. M****** (Demo)",
        district: "Krishna",
        mandal: "Nuzvid",
        landholdingCategory: "Small (1-2 Ha)",
        benefitType: "Soil Card & Gypsum Supplement",
        sanctionedAmountRupees: 3000,
        disbursedAmountRupees: 0,
        status: "pending",
        approvalDate: "2026-03-05",
      },
    ],
  },
];

/**
 * Format Indian currency with rupee symbol and comma separators
 */
export function formatIndianRupees(amount: number): string {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  } else if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2);
    return `₹${lakh} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatExactRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Calculate demonstration aggregate metrics across all or filtered programmes
 */
export function calculateWelfareMetrics(programmes: WelfareProgrammeReport[]) {
  const registeredBeneficiaries = programmes.reduce(
    (sum, p) => sum + p.registeredBeneficiaries,
    0
  );
  const benefitsApproved = programmes.reduce(
    (sum, p) => sum + p.approvedApplications,
    0
  );
  const benefitsDistributed = programmes.reduce(
    (sum, p) => sum + p.benefitsDistributed,
    0
  );
  const pendingApplications = programmes.reduce(
    (sum, p) => sum + p.pendingApplications,
    0
  );

  const districtsSet = new Set<string>();
  programmes.forEach((p) => {
    p.districtsCovered.forEach((d) => districtsSet.add(d));
  });
  const districtsCovered = districtsSet.size;
  const programmesMonitored = programmes.length;

  const totalAllocatedBudget = programmes.reduce(
    (sum, p) => sum + p.allocatedBudgetRupees,
    0
  );
  const totalApprovedBudget = programmes.reduce(
    (sum, p) => sum + p.approvedBudgetRupees,
    0
  );
  const totalDisbursedBudget = programmes.reduce(
    (sum, p) => sum + p.disbursedBudgetRupees,
    0
  );

  return {
    registeredBeneficiaries,
    benefitsApproved,
    benefitsDistributed,
    pendingApplications,
    districtsCovered,
    programmesMonitored,
    totalAllocatedBudget,
    totalApprovedBudget,
    totalDisbursedBudget,
  };
}

/**
 * Filter programmes according to active filter state
 */
export function filterWelfareProgrammes(
  programmes: WelfareProgrammeReport[],
  filters: WelfareFilterState
): WelfareProgrammeReport[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return programmes.filter((p) => {
    // District filter
    if (filters.selectedDistrict !== "all") {
      if (!p.districtsCovered.includes(filters.selectedDistrict)) {
        return false;
      }
    }

    // Mandal filter
    if (filters.selectedMandal !== "all") {
      const hasMandal = p.mandalBreakdown.some(
        (m) =>
          (filters.selectedDistrict === "all" || m.district === filters.selectedDistrict) &&
          m.mandal === filters.selectedMandal
      );
      if (!hasMandal) {
        return false;
      }
    }

    // Programme filter
    if (filters.selectedProgramme !== "all") {
      if (p.id !== filters.selectedProgramme) {
        return false;
      }
    }

    // Period filter
    if (filters.selectedPeriod !== "all") {
      if (p.reportingPeriod !== filters.selectedPeriod) {
        return false;
      }
    }

    // Status filter
    if (filters.selectedStatus !== "all") {
      if (filters.selectedStatus === "approved" && p.approvedApplications <= 0) return false;
      if (filters.selectedStatus === "distributed" && p.benefitsDistributed <= 0) return false;
      if (filters.selectedStatus === "pending" && p.pendingApplications <= 0) return false;
      if (filters.selectedStatus === "under_review" && p.underReviewApplications <= 0) return false;
    }

    // Search query matches: Programme Name, Reference, District, Mandal, Beneficiary Reference
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchRef = p.id.toLowerCase().includes(query) || p.shortCode.toLowerCase().includes(query);
      const matchDistrict = p.districtsCovered.some((d) => d.toLowerCase().includes(query));
      const matchMandal = p.mandalBreakdown.some((m) => m.mandal.toLowerCase().includes(query));
      const matchBeneficiary = p.sampleBeneficiaries.some((b) =>
        b.referenceId.toLowerCase().includes(query)
      );

      if (!matchName && !matchRef && !matchDistrict && !matchMandal && !matchBeneficiary) {
        return false;
      }
    }

    return true;
  });
}
