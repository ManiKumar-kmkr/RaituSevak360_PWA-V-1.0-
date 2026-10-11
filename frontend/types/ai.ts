export type AdvisorySeverity = 'low' | 'moderate' | 'high';

export type AdvisoryCategory = 'pest' | 'disease' | 'nutrition' | 'weather_risk' | 'general';

export interface StructuredAdvisory {
  id: string;
  cropNameKey: string;
  cropStageKey?: string;
  category: AdvisoryCategory;
  titleKey: string;
  diagnosisKey: string;
  severity: AdvisorySeverity;
  confidencePercent: number; // e.g. 94%
  symptomsKeys: string[];
  remediesKeys: string[];
  preventiveTipsKeys?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  advisory?: StructuredAdvisory;
  imageUrl?: string;
}

export interface QuickPromptOption {
  id: string;
  labelKey: string;
  queryText: string;
}

export interface FarmProfileInput {
  soilType: string;
  landArea: number | string;
  farmingSeason: string;
  waterAvailability: string;
  budgetMin: number;
  budgetMax: number;
  cropPreferences: string[];
}

export interface CropRecommendationItem {
  id: string;
  cropName: string;
  cropNameKey: string;
  cropSubName?: string;
  matchPercent: number; // e.g. 98%
  expectedYield: string; // e.g. "22–25 Quintals/Acre"
  marketDemand: 'High' | 'Medium' | 'Low';
  marketDemandKey: string;
  estNetIncome: string; // e.g. "₹45,000 - ₹52,000"
  description: string;
  descriptionKey: string;
  soilSuitability?: string;
  soilSuitabilityKey?: string;
  recommendedVarieties?: string[];
  sowingWindowKey?: string;
  durationDays?: string;
}
