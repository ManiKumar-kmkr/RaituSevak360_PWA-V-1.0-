export type SoilType =
  | "all"
  | "black_cotton"
  | "red_loam"
  | "alluvial"
  | "sandy_loam"
  | "clay";

export type IrrigationType =
  | "borewell"
  | "canal"
  | "drip"
  | "open_well"
  | "rainfed";

export type LandVerificationStatus =
  | "pending_verification"
  | "verified"
  | "rejected";

export interface LandPlot {
  id: string;
  title: string;
  location: string;
  mandal: string;
  district: string;
  state: string;
  acreage: number;
  soilType: SoilType;
  soilTypeName: string;
  irrigation: string;
  suitableCrops: string[];
  pricePerAcrePerYear: number;
  pricePerSeason?: number;
  roadAccess: string;
  leaseTerms: string;
  waterSource: string;
  fenced: boolean;
  verifiedOwner: boolean;
  verificationStatus?: LandVerificationStatus;
  isActive?: boolean;
  ownerName: string;
  ownerPhone?: string;
  availability: "available" | "reserved" | "leased";
  image?: string;
  featured?: boolean;
  isMyListing?: boolean;
}

export interface LandRentalRequest {
  id: string;
  landId: string;
  landTitle: string;
  landLocation: string;
  acreage: number;
  season: string;
  startDate: string;
  duration: string;
  intendedCrop: string;
  farmerName: string;
  farmerPhone: string;
  farmerNotes?: string;
  estimatedCost: number;
  status: "submitted" | "under_review" | "approved" | "rejected";
  createdAt: string;
}
