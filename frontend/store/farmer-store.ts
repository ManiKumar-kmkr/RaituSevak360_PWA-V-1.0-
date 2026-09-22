import { create } from 'zustand';

interface FarmerState {
  currentFarmer: {
    village: string;
    district: string;
    totalAcres: number;
    activeCrops: string[];
  } | null;
  setFarmer: (data: any) => void;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  currentFarmer: null,
  setFarmer: (data) => set({ currentFarmer: data }),
}));
