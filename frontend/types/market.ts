export type CropCategory = "all" | "grains" | "vegetables" | "fruits" | "spices";

export interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  isPrimary?: boolean;
}

export interface NearbyMandiPrice {
  mandiId: string;
  mandiName: string;
  distanceKm: number;
  price: number;
  priceDiff: number; // positive = higher, negative = lower
}

export interface DayPricePoint {
  day: number;
  date: string;
  price: number;
}

export interface MarketCrop {
  id: string;
  name: string;
  variety: string;
  category: "grains" | "vegetables" | "fruits" | "spices";
  currentPrice: number;
  unit: string;
  priceChange: number; // e.g. +68 or -30
  priceChangePercent: number; // e.g. 3.2 or 1.5
  isPositive: boolean;
  todayMin: number;
  todayMax: number;
  govtMsp: number;
  arrivals: string;
  tradingWindow: string;
  lastUpdated: string;
  recommendation: "favorable" | "hold" | "sell_now";
  recommendationTitle: string;
  recommendationDesc: string;
  trendSummary: string;
  trend30Days: DayPricePoint[];
  nearbyMandis: NearbyMandiPrice[];
}

export interface PriceAlertConfig {
  cropId: string;
  cropName: string;
  targetPrice: number;
  enabled: boolean;
  mandiId: string;
}
