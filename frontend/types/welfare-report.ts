export type WelfareCategory =
  | "financial_assistance"
  | "irrigation_support"
  | "seed_fertilizer"
  | "crop_protection"
  | "equipment_subsidy"
  | "soil_health";

export type WelfareApplicationStatus =
  | "all"
  | "approved"
  | "distributed"
  | "pending"
  | "under_review";

export interface MandalImpactBreakdown {
  district: string;
  mandal: string;
  targetCount: number;
  registeredCount: number;
  approvedCount: number;
  distributedCount: number;
  pendingCount: number;
}

export interface DemoBeneficiaryRecord {
  referenceId: string; // e.g. "BEN-AP-2026-0812"
  farmerAlias: string; // e.g. "V. R******"
  district: string;
  mandal: string;
  landholdingCategory: string; // e.g. "Small (1-2 Ha)"
  benefitType: string;
  sanctionedAmountRupees: number;
  disbursedAmountRupees: number;
  status: "approved" | "distributed" | "pending" | "under_review";
  approvalDate: string;
  distributionDate?: string;
}

export interface WelfareProgrammeReport {
  id: string; // e.g. "WLF-AP-FFA-01"
  name: string;
  shortCode: string;
  category: WelfareCategory;
  categoryLabel: string;
  description: string;
  reportingPeriod: string;
  targetBeneficiaries: number;
  registeredBeneficiaries: number;
  approvedApplications: number;
  benefitsDistributed: number;
  pendingApplications: number;
  underReviewApplications: number;
  rejectedApplications: number;
  allocatedBudgetRupees: number;
  approvedBudgetRupees: number;
  disbursedBudgetRupees: number;
  districtsCovered: string[];
  lastUpdated: string;
  dataSource: string;
  mandalBreakdown: MandalImpactBreakdown[];
  sampleBeneficiaries: DemoBeneficiaryRecord[];
}

export interface WelfareFilterState {
  searchQuery: string;
  selectedDistrict: string;
  selectedMandal: string;
  selectedProgramme: string;
  selectedPeriod: string;
  selectedStatus: WelfareApplicationStatus;
}
