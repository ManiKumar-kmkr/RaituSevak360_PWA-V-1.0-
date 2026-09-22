'use client';

import { useState, useEffect } from 'react';

export function useFarmer() {
  const [farmerProfile, setFarmerProfile] = useState<{
    name: string;
    village: string;
    district: string;
    totalLandAcres: number;
  }>({
    name: 'రమేష్ పటేల్',
    village: 'కొత్తపల్లి',
    district: 'కరీంనగర్',
    totalLandAcres: 5.5,
  });

  return { farmerProfile, setFarmerProfile };
}
