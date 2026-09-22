export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  role: 'farmer' | 'labour' | 'machinery_provider' | 'buyer' | 'admin';
  language: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  totalLandAcres: number;
  primaryCrops: string[];
}

export interface Crop {
  id: string;
  farmerId: string;
  farmId: string;
  cropName: string;
  variety?: string;
  season: 'kharif' | 'rabi' | 'zaid';
  sowingDate: string;
  expectedHarvestDate?: string;
  areaInAcres: number;
  currentStage: string;
  healthStatus: string;
}

export interface WeatherData {
  district: string;
  temperatureCelsius: number;
  humidityPercentage: number;
  rainfallMm: number;
  windSpeedKmh: number;
  condition: string;
  alerts?: string[];
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  availableQuantity: number;
  location: {
    village: string;
    district: string;
  };
}
