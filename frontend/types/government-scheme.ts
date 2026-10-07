export type GovernmentLevel = 'central' | 'state';
export type SchemeStatus = 'active' | 'upcoming' | 'closed';
export type SchemeFilterType = 'all' | 'active' | 'upcoming' | 'central' | 'state';

export interface SchemeEligibilityCriteria {
  targetBeneficiaries: string[];
  landholdingRequirement: string;
  locationState: string;
  incomeOrExclusions: string[];
  otherConditions: string[];
}

export interface SchemeDocument {
  name: string;
  mandatory: boolean;
  description?: string;
}

export interface SchemeImportantDates {
  applicationDeadline: string;
  schemePeriod: string;
  isOngoing: boolean;
  details?: string;
}

export interface SchemeSource {
  name: string;
  url: string;
  verifiedAt: string;
}

export interface SchemeHowToApply {
  summary: string;
  steps: string[];
  portalName: string;
  officialPortalUrl: string;
  note?: string;
}

export interface SchemeHelpline {
  number: string;
  label: string;
  hours?: string;
}

export interface SchemeBenefit {
  headline: string;
  description: string;
  amountOrSubsidy: string;
  paymentFrequency: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  shortName?: string;
  shortDescription: string;
  governmentLevel: GovernmentLevel;
  ministry: string;
  department?: string;
  stateName?: string;
  status: SchemeStatus;
  categories: string[];
  crops: string[];
  benefit: SchemeBenefit;
  eligibility: SchemeEligibilityCriteria;
  documents: SchemeDocument[];
  importantDates: SchemeImportantDates;
  howToApply: SchemeHowToApply;
  officialWebsite: string;
  officialApplicationUrl: string;
  helpline: SchemeHelpline;
  source: SchemeSource;
  lastVerified: string;
  tags: string[];
  isPotentiallyEligible?: boolean;
}

export interface SchemeEligibilityEvaluation {
  schemeId: string;
  schemeName: string;
  isPotentiallyEligible: boolean;
  matchedCriteria: string[];
  pendingReviewCriteria: string[];
  summary: string;
  disclaimer: string;
}
