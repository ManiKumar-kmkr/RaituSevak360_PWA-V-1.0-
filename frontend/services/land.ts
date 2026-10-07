import { LandPlot, SoilType } from "@/types/land";

export const SAMPLE_LAND_PLOTS: LandPlot[] = [
  {
    id: "lnd-01",
    title: "Prime Black Cotton Soil Farmland",
    location: "Tenali Rural, Guntur",
    mandal: "Tenali",
    district: "Guntur",
    state: "Andhra Pradesh",
    acreage: 5.5,
    soilType: "black_cotton",
    soilTypeName: "Black Cotton Soil (Regur)",
    irrigation: "Krishna Western Canal + 2 High-Yield Borewells",
    suitableCrops: ["Paddy", "Cotton", "Chilli", "Maize"],
    pricePerAcrePerYear: 32000,
    pricePerSeason: 16000,
    roadAccess: "12ft All-Weather Gravel Road, Direct Tractor Access",
    leaseTerms: "1 to 3 Year Lease • Canal water tax included",
    waterSource: "Canal gravity flow & 3-phase electric pump",
    fenced: true,
    verifiedOwner: true,
    ownerName: "K. Sambasiva Rao",
    ownerPhone: "+91 98490 88214",
    availability: "available",
    image: "field-black-soil",
    featured: true,
  },
  {
    id: "lnd-02",
    title: "High-Fertility Red Sandy Loam Plot",
    location: "Wardhannapet, Warangal",
    mandal: "Wardhannapet",
    district: "Warangal",
    state: "Telangana",
    acreage: 8.0,
    soilType: "red_loam",
    soilTypeName: "Red Sandy Loam",
    irrigation: "3 Borewells with Automated Drip Network",
    suitableCrops: ["Chilli", "Cotton", "Groundnut", "Vegetables"],
    pricePerAcrePerYear: 28000,
    pricePerSeason: 14000,
    roadAccess: "State Highway 33 Frontage • Direct Lorry Access",
    leaseTerms: "Seasonal or Annual Lease • 25% Advance",
    waterSource: "Continuous underground aquifer with 4-inch discharge",
    fenced: true,
    verifiedOwner: true,
    ownerName: "P. Raghava Reddy",
    ownerPhone: "+91 98491 77321",
    availability: "available",
    featured: true,
  },
  {
    id: "lnd-03",
    title: "Alluvial River Basin Double-Crop Land",
    location: "Vijayawada Rural, Krishna",
    mandal: "Vijayawada Rural",
    district: "Krishna",
    state: "Andhra Pradesh",
    acreage: 3.2,
    soilType: "alluvial",
    soilTypeName: "Alluvial Clay Loam",
    irrigation: "Krishna River Lift Irrigation Channel",
    suitableCrops: ["Paddy (Kharif + Rabi)", "Sugarcane", "Banana"],
    pricePerAcrePerYear: 38000,
    pricePerSeason: 19000,
    roadAccess: "Paved Tar Road with Farm Gate Entry",
    leaseTerms: "Minimum 1 Year lease • High organic matter content",
    waterSource: "Perennial river sub-channel",
    fenced: false,
    verifiedOwner: true,
    ownerName: "M. Venkata Ramana",
    ownerPhone: "+91 98492 66432",
    availability: "available",
  },
  {
    id: "lnd-04",
    title: "Organic Certified Farm Acreage",
    location: "Shamirpet, Medchal-Malkajgiri",
    mandal: "Shamirpet",
    district: "Medchal",
    state: "Telangana",
    acreage: 12.0,
    soilType: "red_loam",
    soilTypeName: "Rich Red Soil (Chalka)",
    irrigation: "Farm Rainwater Pond + Solar Powered Drip System",
    suitableCrops: ["Organic Vegetables", "Pulses", "Millets", "Horticulture"],
    pricePerAcrePerYear: 35000,
    pricePerSeason: 17500,
    roadAccess: "Paved Approach Road • 25 km from City Center",
    leaseTerms: "Organic farming practices strictly preferred • 2 Years minimum",
    waterSource: "Solar drip irrigation & open storage reservoir",
    fenced: true,
    verifiedOwner: true,
    ownerName: "Smt. Anuradha Devi",
    ownerPhone: "+91 98493 55543",
    availability: "available",
  },
  {
    id: "lnd-05",
    title: "Commercial Sandy Loam Farm Land",
    location: "Suryapet Mandal, Suryapet",
    mandal: "Suryapet",
    district: "Suryapet",
    state: "Telangana",
    acreage: 4.0,
    soilType: "sandy_loam",
    soilTypeName: "Sandy Loam",
    irrigation: "Dedicated Borewell with 3-inch discharge pipe",
    suitableCrops: ["Groundnut", "Castor", "Green Gram", "Maize"],
    pricePerAcrePerYear: 22000,
    pricePerSeason: 11000,
    roadAccess: "Farm Bund Cart Track • Tractor Accessible",
    leaseTerms: "Flexible seasonal lease (Kharif or Rabi)",
    waterSource: "Electric borewell with sub-surface distribution",
    fenced: false,
    verifiedOwner: true,
    ownerName: "Ch. Nageswara Rao",
    ownerPhone: "+91 98494 44654",
    availability: "available",
  },
  {
    id: "lnd-06",
    title: "Heavy Clay Canal-Fed Paddy Plot",
    location: "Miryalaguda, Nalgonda",
    mandal: "Miryalaguda",
    district: "Nalgonda",
    state: "Telangana",
    acreage: 6.5,
    soilType: "clay",
    soilTypeName: "Heavy Clay Soil",
    irrigation: "Nagarjuna Sagar Left Canal Feeder Channel",
    suitableCrops: ["Paddy", "Sugarcane"],
    pricePerAcrePerYear: 30000,
    pricePerSeason: 15000,
    roadAccess: "Canal Bund Road • Heavy Machinery Capable",
    leaseTerms: "Annual renewable contract",
    waterSource: "Canal feeder sluice gate",
    fenced: false,
    verifiedOwner: true,
    ownerName: "G. Janardhan",
    ownerPhone: "+91 98495 33765",
    availability: "available",
  },
];

export const landService = {
  getLandListings: async (filters?: {
    soilType?: SoilType;
    search?: string;
    maxPrice?: number;
    userListings?: LandPlot[];
  }): Promise<LandPlot[]> => {
    let result = [...SAMPLE_LAND_PLOTS];

    // Connect user-created active land listings to discovery
    // Inactive listings (isActive === false) are excluded from active discovery
    if (filters?.userListings && filters.userListings.length > 0) {
      const activeUserListings = filters.userListings.filter(
        (l) => l.isActive !== false
      );
      const userIds = new Set(activeUserListings.map((l) => l.id));
      result = [
        ...activeUserListings,
        ...result.filter((l) => !userIds.has(l.id)),
      ];
    }

    if (filters?.soilType && filters.soilType !== "all") {
      result = result.filter((l) => l.soilType === filters.soilType);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.mandal.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.soilTypeName.toLowerCase().includes(q) ||
          l.suitableCrops.some((c) => c.toLowerCase().includes(q))
      );
    }

    return result;
  },

  getLandById: async (
    id: string,
    userListings?: LandPlot[]
  ): Promise<LandPlot | undefined> => {
    if (userListings) {
      const foundUser = userListings.find((l) => l.id === id);
      if (foundUser) return foundUser;
    }
    return SAMPLE_LAND_PLOTS.find((l) => l.id === id);
  },
};
