/**
 * Marketplace & Equipment Frontend Service Abstraction
 * 
 * NOTE FOR BACKEND TEAM:
 * This service currently provides development & realistic agricultural input data.
 * When real backend endpoints are ready, connect the API endpoints inside
 * the async methods below without modifying the UI layer.
 */

import {
  MarketplaceProduct,
  ProductCategory,
  EquipmentItem,
  EquipmentCategory,
  EquipmentBooking,
} from "@/types/marketplace";
import { SellerProduct, SellerEquipment } from "@/types/seller";
import { useSellerStore } from "@/store/seller-store";

/**
 * Safely maps an active SellerProduct to the MarketplaceProduct schema.
 */
export function mapSellerProductToMarketplace(
  sp: SellerProduct,
  storeName?: string
): MarketplaceProduct {
  const categoryMap: Record<string, MarketplaceProduct["category"]> = {
    seeds: "seeds",
    seed: "seeds",
    fertilizers: "fertilizer",
    fertilizer: "fertilizer",
    pesticides: "pesticides",
    pesticide: "pesticides",
    "farm tools": "tools",
    tools: "tools",
    tool: "tools",
    machinery: "machinery",
    tractor: "machinery",
  };

  const rawCat = (sp.category || "").toLowerCase().trim();
  const category: MarketplaceProduct["category"] = categoryMap[rawCat] || "tools";

  return {
    id: sp.id,
    name: sp.name,
    category,
    image: sp.imageUrl || "/images/marketplace/rice-seeds.svg",
    price: sp.price,
    mrp: Math.round(sp.price * 1.15),
    unit: sp.unit || "unit",
    rating: 4.8,
    reviewCount: 24,
    stock: Math.max(0, sp.stock),
    seller: storeName || "Verified Agri Seller",
    sellerLocation: sp.location || "Telangana Hub",
    badge: (sp.tags && sp.tags.length > 0 && sp.tags[0]) || "Verified Seller",
    description: sp.description || sp.name,
    specifications: {
      "Category": sp.category,
      "Sub-Category": sp.subCategory || "General",
      "Minimum Order (MOQ)": `${sp.moq || 1} ${sp.unit || "unit"}`,
      "Delivery Option": sp.isAvailableForDelivery
        ? "Doorstep Delivery Available"
        : "Store Pickup Only",
      "Store Location": sp.location || "Local Agri Mandi",
      ...(sp.tags && sp.tags.length > 0 ? { "Tags": sp.tags.join(", ") } : {}),
    },
    featured: false,
  };
}

export const SAMPLE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "prod_1",
    name: "Hybrid Rice Seeds (IR-64)",
    category: "seeds",
    image: "/images/marketplace/rice-seeds.svg",
    price: 1150,
    mrp: 1350,
    unit: "25kg bag",
    rating: 4.8,
    reviewCount: 142,
    stock: 85,
    seller: "Sri Krishna Agri Inputs",
    sellerLocation: "Warangal Mandi Road",
    badge: "Certified Seed",
    description:
      "High-yielding semi-dwarf rice variety with excellent grain quality, 120-125 days maturity duration, and strong tolerance against bacterial blight.",
    specifications: {
      "Germination Rate": "Min 85%",
      "Physical Purity": "98%",
      "Crop Duration": "120 - 125 Days",
      "Seed Rate": "20 - 25 kg / Acre",
      "Certification": "State Seed Certification Agency",
    },
    featured: true,
  },
  {
    id: "prod_2",
    name: "BPH Resistant Paddy Seeds (BPT 5204)",
    category: "seeds",
    image: "/images/marketplace/bpt-seeds.svg",
    price: 1250,
    mrp: 1450,
    unit: "25kg bag",
    rating: 4.9,
    reviewCount: 210,
    stock: 50,
    seller: "Sri Krishna Agri Inputs",
    sellerLocation: "Warangal Hub",
    badge: "BPH Resistant",
    description:
      "Premium quality Samba Mahsuri (BPT 5204) foundation rice seeds treated for Brown Planthopper resistance and uniform tillering.",
    specifications: {
      "Germination Rate": "Min 90%",
      "Physical Purity": "99%",
      "Crop Duration": "145 - 150 Days",
      "Cooking Quality": "Super Fine Grain",
      "Certification": "ANGRAU Verified",
    },
    featured: true,
  },
  {
    id: "prod_3",
    name: "Organic NPK Fertilizer (Granular)",
    category: "fertilizer",
    image: "/images/marketplace/npk-fertilizer.svg",
    price: 850,
    mrp: 999,
    unit: "50kg bag",
    rating: 4.7,
    reviewCount: 95,
    stock: 120,
    seller: "Green Earth Farm Solutions",
    sellerLocation: "Narsampet",
    badge: "100% Organic",
    description:
      "Balanced organic NPK formula enriched with beneficial microbes, mycorrhiza, and bio-potash to restore soil organic carbon.",
    specifications: {
      "NPK Ratio": "8:8:8 Bio-Organic",
      "Organic Matter": "Min 40%",
      "Moisture Content": "Max 15%",
      "Form": "Slow-release Granules",
      "Application": "Basal / Top dressing",
    },
    featured: true,
  },
  {
    id: "prod_4",
    name: "Organic Vermicompost Soil Conditioner",
    category: "fertilizer",
    image: "/images/marketplace/vermicompost.svg",
    price: 450,
    mrp: 550,
    unit: "50kg bag",
    rating: 4.6,
    reviewCount: 68,
    stock: 200,
    seller: "Green Earth Farm Solutions",
    sellerLocation: "Mulugu Cluster",
    badge: "Organic Certified",
    description:
      "Eisenia fetida earthworm vermicompost rich in humus, humic acid, and plant growth promoting auxins. Boosts water retention in red & black soils.",
    specifications: {
      "Nitrogen (N)": "1.5 - 2.0%",
      "Phosphorus (P)": "1.0 - 1.5%",
      "Potassium (K)": "1.5 - 2.2%",
      "C:N Ratio": "15:1",
      "pH Range": "6.8 - 7.5",
    },
    featured: false,
  },
  {
    id: "prod_5",
    name: "Crop Sprayer Pump (16L Battery Powered)",
    category: "tools",
    image: "/images/marketplace/sprayer-pump.svg",
    price: 2450,
    mrp: 3100,
    unit: "1 Unit",
    rating: 4.8,
    reviewCount: 184,
    stock: 35,
    seller: "Kisan Tools & Machinery Co.",
    sellerLocation: "Hanamkonda",
    badge: "1-Yr Warranty",
    description:
      "12V 12Ah rechargeable dual-motor knapsack sprayer with adjustable brass nozzles, stainless steel telescopic lance, and ergonomic shoulder straps.",
    specifications: {
      "Tank Capacity": "16 Litres",
      "Battery": "12V 12Ah Lead-Acid / Li-Ion",
      "Working Pressure": "0.2 - 0.45 MPa",
      "Discharge Rate": "3.1 Litres/min",
      "Working Hours": "Up to 6-8 hours on full charge",
    },
    featured: true,
  },
  {
    id: "prod_6",
    name: "Premium Harvesting Tool & Pruner Set",
    category: "tools",
    image: "/images/marketplace/harvesting-tool.svg",
    price: 680,
    mrp: 850,
    unit: "Set of 3",
    rating: 4.5,
    reviewCount: 42,
    stock: 75,
    seller: "Kisan Tools & Machinery Co.",
    sellerLocation: "Warangal",
    badge: "High Carbon Steel",
    description:
      "Serrated stainless steel sickle, heavy-duty bypass hand pruner, and hedge shears with anti-slip rubberized grips for effortless harvesting.",
    specifications: {
      "Blade Material": "SK-5 High Carbon Tempered Steel",
      "Handle": "Ergonomic shock-absorbing TPR",
      "Cutting Capacity": "Up to 25mm diameter branches",
      "Rust Resistance": "Teflon coated blade",
    },
    featured: false,
  },
  {
    id: "prod_7",
    name: "Pure Neem Oil Bio-Pesticide (10,000 PPM)",
    category: "pesticides",
    image: "/images/marketplace/neem-oil.svg",
    price: 620,
    mrp: 750,
    unit: "1 Litre",
    rating: 4.7,
    reviewCount: 77,
    stock: 60,
    seller: "BioAgri Protections",
    sellerLocation: "Khammam",
    badge: "Eco-Friendly",
    description:
      "Cold-pressed Azadirachtin 10,000 PPM botanical concentrate for effective control of sucking pests, whitefly, aphids, bollworms, and fungal mildew.",
    specifications: {
      "Active Ingredient": "Azadirachtin 1% (10,000 PPM)",
      "Target Pests": "Whiteflies, Thrips, Aphids, Mites, Pod Borers",
      "Dosage": "2.5 - 3 ml per Litre of water",
      "Pre-Harvest Interval": "0 Days (Residue Free)",
    },
    featured: false,
  },
  {
    id: "prod_8",
    name: "Mahindra 575 DI Tractor (Day Rental)",
    category: "machinery",
    image: "/images/marketplace/tractor-rental.svg",
    price: 1800,
    mrp: 2000,
    unit: "1 Day Rental",
    rating: 4.9,
    reviewCount: 112,
    stock: 8,
    seller: "Ramesh Equipment Hub",
    sellerLocation: "Narsampet Rural CHC",
    badge: "CHC Verified",
    description:
      "45 HP fuel-efficient Mahindra 575 DI tractor available for day hire. Suitable for ploughing, rotavating, puddling, and crop haulage.",
    specifications: {
      "Horsepower": "45 HP",
      "Operator": "Available on request (+₹400/day)",
      "Fuel Policy": "Delivered with full tank, return full",
      "Implements": "Cultivator / Rotavator attachments available",
    },
    featured: true,
  },
];

export const SAMPLE_EQUIPMENT: EquipmentItem[] = [
  {
    id: "eq_1",
    name: "Mahindra 575 DI Tractor (45 HP)",
    category: "tractor",
    image: "/images/marketplace/tractor.svg",
    dailyRate: 1800,
    hourlyRate: 350,
    owner: "Ramesh Equipment Hub",
    location: "Narsampet (4 km away)",
    distanceKm: 4,
    rating: 4.9,
    reviewCount: 88,
    available: true,
    operatorIncluded: true,
    fuelIncluded: false,
    specs: {
      "Engine Power": "45 HP @ 1900 RPM",
      "Drive": "2WD High Lug Tyres",
      "PTO Speed": "540 RPM",
      "Attachments Included": "9-Tyne Cultivator, 2-Disc Plough",
    },
  },
  {
    id: "eq_2",
    name: "John Deere 5050 D 4WD Tractor",
    category: "tractor",
    image: "/images/marketplace/john-deere.svg",
    dailyRate: 2200,
    hourlyRate: 420,
    owner: "Kisan CHC Center",
    location: "Warangal Rural (8 km away)",
    distanceKm: 8,
    rating: 4.8,
    reviewCount: 64,
    available: true,
    operatorIncluded: true,
    fuelIncluded: false,
    specs: {
      "Engine Power": "50 HP Turbocharged",
      "Drive": "4WD Wet-field capable",
      "Hydraulics": "1600 kg Lift Capacity",
      "Suitable Tasks": "Heavy puddling, deep subsoiling, haulage",
    },
  },
  {
    id: "eq_3",
    name: "Multi-Crop Combine Harvester (Track Type)",
    category: "harvester",
    image: "/images/marketplace/harvester.svg",
    dailyRate: 6500,
    hourlyRate: 1200,
    owner: "Telangana Agri Machinery Syndicate",
    location: "Mulugu Road (12 km away)",
    distanceKm: 12,
    rating: 4.9,
    reviewCount: 45,
    available: true,
    operatorIncluded: true,
    fuelIncluded: true,
    specs: {
      "Crops Handled": "Paddy, Wheat, Maize, Soybean",
      "Cutter Bar Width": "7.5 Feet",
      "Track Type": "Rubber crawler for wet paddy fields",
      "Grain Tank Capacity": "1400 Litres",
    },
  },
  {
    id: "eq_4",
    name: "10L Smart Agriculture Drone Sprayer",
    category: "sprayer",
    image: "/images/marketplace/drone.svg",
    dailyRate: 2800,
    hourlyRate: 500,
    owner: "RaituSevak Precision Drone Fleet",
    location: "CHC Warangal (5 km away)",
    distanceKm: 5,
    rating: 4.9,
    reviewCount: 130,
    available: true,
    operatorIncluded: true,
    fuelIncluded: true,
    specs: {
      "Tank Capacity": "10 Litres",
      "Spray Width": "4 - 5 Metres",
      "Coverage": "1 Acre in 7 minutes",
      "Pilot": "DGCA Certified Remote Pilot Included",
    },
  },
  {
    id: "eq_5",
    name: "Heavy-Duty Rotavator / Rotary Tiller (6 Feet)",
    category: "implement",
    image: "/images/marketplace/rotavator.svg",
    dailyRate: 850,
    hourlyRate: 150,
    owner: "Balaji Agro Rentals",
    location: "Parkal (15 km away)",
    distanceKm: 15,
    rating: 4.7,
    reviewCount: 38,
    available: true,
    operatorIncluded: false,
    fuelIncluded: false,
    specs: {
      "Tillage Width": "6 Feet (180 cm)",
      "Blades": "48 Boron Steel L-Type Blades",
      "Required Tractor HP": "40 HP and above",
      "Gearbox": "Multi-speed oil bath transmission",
    },
  },
];

class MarketplaceService {
  /**
   * Retrieves combined products: SAMPLE_PRODUCTS + active non-duplicate products from useSellerStore
   */
  private getAllCombinedProducts(): MarketplaceProduct[] {
    const sampleItems = [...SAMPLE_PRODUCTS];
    try {
      const sellerState = useSellerStore.getState();
      const sellerProducts = sellerState?.products || [];
      const storeName = sellerState?.onboardingData?.businessName || "Verified Agri Seller";

      // Filter only active seller products
      const activeSellerProducts = sellerProducts.filter(
        (p) => p && p.status === "active"
      );

      // Map to MarketplaceProduct schema
      const mappedSellerProducts = activeSellerProducts.map((p) =>
        mapSellerProductToMarketplace(p, storeName)
      );

      // Prevent duplicates: avoid adding any seller product whose id already exists in sampleItems
      const existingIds = new Set(sampleItems.map((p) => p.id));
      const nonDuplicateSellerProducts = mappedSellerProducts.filter(
        (p) => !existingIds.has(p.id)
      );

      return [...sampleItems, ...nonDuplicateSellerProducts];
    } catch {
      return sampleItems;
    }
  }

  async getProducts(category: ProductCategory = "all", search: string = ""): Promise<MarketplaceProduct[]> {
    // Simulate lightweight client-side network latency
    await new Promise((resolve) => setTimeout(resolve, 80));

    let items = this.getAllCombinedProducts();

    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.seller.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return items;
  }

  async getProductById(id: string): Promise<MarketplaceProduct | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const allProducts = this.getAllCombinedProducts();
    const found = allProducts.find((p) => p.id === id);
    return found || null;
  }

  /**
   * Maps active SellerEquipment into the Farmer-facing EquipmentItem schema
   */
  private mapSellerEquipmentToMarketplace(eq: SellerEquipment): EquipmentItem {
    const c = (eq.category || "").toLowerCase();
    let cat: EquipmentCategory = "tractor";
    if (c.includes("harvester") && !c.includes("implement")) cat = "harvester";
    else if (c.includes("drone") || c.includes("sprayer")) cat = "sprayer";
    else if (c.includes("implement") || c.includes("rotavator") || c.includes("tiller")) cat = "implement";

    return {
      id: eq.id,
      name: eq.name,
      category: cat,
      image: eq.imageUrl || "/images/marketplace/tractor.svg",
      dailyRate: eq.pricePerHour * 8,
      hourlyRate: eq.pricePerHour,
      owner: eq.ownerName || "Agri Fleet Partner",
      location: eq.location,
      distanceKm: 6,
      rating: eq.rating || 4.8,
      reviewCount: eq.reviewCount || 10,
      available: (eq.status ?? (eq.isAvailable ? "active" : "inactive")) === "active",
      operatorIncluded: true,
      fuelIncluded: false,
      specs: (eq.specifications as Record<string, string>) || {},
    };
  }

  async getEquipment(category: EquipmentCategory = "all", search: string = ""): Promise<EquipmentItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let items = [...SAMPLE_EQUIPMENT];

    // Combine active seller equipment from shared useSellerStore
    try {
      const sellerState = useSellerStore.getState();
      const sellerEquipment = sellerState?.equipment || [];
      const activeSellerEq = sellerEquipment.filter(
        (e) => (e.status ?? (e.isAvailable ? "active" : "inactive")) === "active"
      );
      const mapped = activeSellerEq.map((e) => this.mapSellerEquipmentToMarketplace(e));
      const existingIds = new Set(items.map((i) => i.id));
      const nonDuplicate = mapped.filter((m) => !existingIds.has(m.id));
      items = [...items, ...nonDuplicate];
    } catch {
      // Fallback
    }

    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }

    return items;
  }

  async bookEquipment(bookingData: Omit<EquipmentBooking, "id" | "status" | "createdAt">): Promise<EquipmentBooking> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newBooking: EquipmentBooking = {
      ...bookingData,
      id: `EQ-BOOK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Synchronize into Seller incoming bookings in useSellerStore
    try {
      const sellerState = useSellerStore.getState();
      sellerState.addEquipmentBooking({
        equipmentId: bookingData.equipmentId,
        equipmentName: bookingData.equipmentName,
        equipmentCategory: "Tractors",
        customerName: bookingData.farmerName,
        bookingDate: bookingData.startDate,
        startTime: "08:00 AM",
        duration: "Full Day",
        rentalAmount: bookingData.totalEstimatedAmount,
        depositFee: 1000,
        totalAmount: bookingData.totalEstimatedAmount + 1000,
        paymentMethod: "Cash on Delivery / Pickup",
        paymentStatus: "Pending",
        contactPhone: bookingData.contactMobile,
        location: bookingData.farmLocation,
      });
    } catch {
      // Fallback
    }

    return newBooking;
  }
}

const marketplaceService = new MarketplaceService();
export default marketplaceService;
