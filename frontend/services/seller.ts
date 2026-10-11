import {
  SellerOnboardingData,
  SellerVerificationStatus,
  SellerRegistrationResult,
  BuyLead,
  LeadFilterCriteria,
  Quotation,
  SellerEquipment,
  SellerEquipmentBooking,
  SellerProduct,
  SellerDashboardStats,
  SellerOrder,
} from "../types/seller";

// Initial Seller Sample Orders for Dispatches Tab
export const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: "ORD-9481",
    customer: "Sri Venkateswara Farms",
    customerPhone: "98490 12345",
    items: "BPT 5204 Paddy Seeds (4 bags)",
    amount: "₹5,000",
    totalAmountNum: 5000,
    status: "Ready for Dispatch",
    date: "Today, 11:30 AM",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    deliveryAddress: {
      fullName: "Sri Venkateswara Farms (Ramesh Varma)",
      phone: "98490 12345",
      street: "Plot 14, Agricultural Mandi Road",
      village: "Enumamula",
      mandal: "Hanamkonda",
      district: "Warangal",
      state: "Telangana",
      pincode: "506002",
    },
    paymentMethod: "UPI / QR Code",
    paymentStatus: "Paid",
    lineItems: [
      {
        productId: "PROD-101",
        productName: "BPT 5204 Samba Mahsuri Paddy Seeds",
        category: "Seeds",
        quantity: 4,
        unitPrice: 1250,
        totalPrice: 5000,
        unit: "bag (25kg)",
      },
    ],
  },
  {
    id: "ORD-9478",
    customer: "K. Narayana Rao",
    customerPhone: "94401 87654",
    items: "Organic Neem Cake Fertilizer (100kg)",
    amount: "₹2,400",
    totalAmountNum: 2400,
    status: "Delivered",
    date: "Yesterday",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    deliveryAddress: {
      fullName: "K. Narayana Rao",
      phone: "94401 87654",
      street: "House 3-21, Temple Street",
      village: "Geesugonda",
      mandal: "Geesugonda",
      district: "Warangal Rural",
      state: "Telangana",
      pincode: "506330",
    },
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    lineItems: [
      {
        productId: "PROD-102",
        productName: "Bio-Neem Organic Cake Fertilizer",
        category: "Fertilizers",
        quantity: 2,
        unitPrice: 850,
        totalPrice: 1700,
        unit: "bag (50kg)",
      },
    ],
  },
  {
    id: "ORD-9462",
    customer: "Bala Krishna Agro",
    customerPhone: "99887 76655",
    items: "Sprayer Nozzle Kit (2 sets)",
    amount: "₹1,150",
    totalAmountNum: 1150,
    status: "In Transit",
    date: "28 Sep 2026",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    deliveryAddress: {
      fullName: "Bala Krishna Agro",
      phone: "99887 76655",
      street: "Shop 12, Main Bazar",
      village: "Narsampet",
      mandal: "Narsampet",
      district: "Warangal",
      state: "Telangana",
      pincode: "506132",
    },
    paymentMethod: "UPI / PhonePe",
    paymentStatus: "Paid",
    lineItems: [
      {
        productId: "PROD-103",
        productName: "Sprayer Nozzle Kit",
        category: "Farm Tools",
        quantity: 2,
        unitPrice: 575,
        totalPrice: 1150,
        unit: "sets",
      },
    ],
  },
];

// Initial Demo Products
export const INITIAL_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: "PROD-101",
    name: "BPT 5204 Samba Mahsuri Paddy Seeds",
    category: "Seeds",
    subCategory: "Paddy & Grains",
    price: 1250,
    unit: "bag (25kg)",
    moq: 2,
    stock: 85,
    status: "active",
    isAvailableForDelivery: true,
    location: "Warangal, Telangana",
    description: "High germination rate (98%), pest resistant certified foundation seeds suitable for Rabi & Kharif seasons.",
    tags: ["Certified", "High Yield", "Govt Approved"],
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-15T10:00:00Z",
    updatedAt: "2026-10-01T08:30:00Z",
  },
  {
    id: "PROD-102",
    name: "Bio-Neem Organic Cake Fertilizer",
    category: "Fertilizers",
    subCategory: "Organic Fertilizers",
    price: 850,
    unit: "bag (50kg)",
    moq: 5,
    stock: 140,
    status: "active",
    isAvailableForDelivery: true,
    location: "Warangal, Telangana",
    description: "100% pure cold-pressed neem cake. Rich in NPK and protects root zone against soil nematodes and termites.",
    tags: ["100% Organic", "NPK Rich", "Soil Conditioner"],
    imageUrl: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-18T14:20:00Z",
    updatedAt: "2026-10-02T11:00:00Z",
  },
  {
    id: "PROD-103",
    name: "KisanKraft 16L Battery Knapsack Sprayer",
    category: "Farm Tools",
    subCategory: "Spray Equipment",
    price: 2499,
    unit: "piece",
    moq: 1,
    stock: 28,
    status: "active",
    isAvailableForDelivery: true,
    location: "Hanamkonda, Telangana",
    description: "12V 12Ah heavy-duty battery sprayer with telescopic stainless steel lance and 4 adjustable spray nozzles.",
    tags: ["12V Battery", "Telescopic Lance", "1 Year Warranty"],
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-20T09:15:00Z",
    updatedAt: "2026-10-03T09:45:00Z",
  },
  {
    id: "PROD-104",
    name: "Organic Trichoderma Viride Bio-Fungicide",
    category: "Pesticides",
    subCategory: "Bio-Control Agents",
    price: 320,
    unit: "kg pack",
    moq: 3,
    stock: 62,
    status: "active",
    isAvailableForDelivery: true,
    location: "Warangal, Telangana",
    description: "Antagonistic bio-fungicide for seed treatment and soil application to control root rot, wilt, and damping-off.",
    tags: ["Bio-Fungicide", "Eco Friendly", "Zero Residue"],
    imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-22T16:00:00Z",
    updatedAt: "2026-10-03T15:20:00Z",
  },
  {
    id: "PROD-105",
    name: "Drip Irrigation 16mm Lateral Pipe (400m)",
    category: "Farm Tools",
    subCategory: "Micro Irrigation",
    price: 3800,
    unit: "roll (400m)",
    moq: 1,
    stock: 12,
    status: "inactive",
    isAvailableForDelivery: false,
    location: "Warangal, Telangana",
    description: "Virgin polymer UV-stabilized class 2 lateral line with 40cm emitter spacing for vegetable and orchard crops.",
    tags: ["UV Stabilized", "ISI Marked", "Water Saving"],
    imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-25T11:45:00Z",
    updatedAt: "2026-10-04T07:10:00Z",
  },
];

// Initial Demo Quotations for Buyer/Farmer Leads
export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "QUOT-3091",
    leadId: "LEAD-401",
    farmerName: "Ramesh Reddy",
    sellerName: "Sri Balaji Agro Agencies",
    sellerPhone: "+91 98490 12345",
    sellerLocation: "Enumamula Mandi, Warangal",
    crop: "Paddy (BPT 5204)",
    quantity: 120,
    unit: "Quintals",
    offeredPrice: 2320,
    totalAmount: 278400,
    deliveryOption: "Farmer Pickup",
    availableFrom: "2026-10-08",
    validity: "7 Days",
    notes: "Direct farm loading with our bags and prompt payment on weighbridge slip.",
    sentAt: "2026-10-03T14:30:00Z",
    status: "submitted",
    expectedResponse: "Within 24-48 hours",
  },
  {
    id: "QUOT-3092",
    leadId: "LEAD-401",
    farmerName: "Ramesh Reddy",
    sellerName: "Kakatiya Grain Exports & Mills",
    sellerPhone: "+91 94401 55667",
    sellerLocation: "Hanamkonda Industrial Area, Warangal",
    crop: "Paddy (BPT 5204)",
    quantity: 120,
    unit: "Quintals",
    offeredPrice: 2370,
    totalAmount: 284400,
    deliveryOption: "Home Delivery",
    availableFrom: "2026-10-09",
    validity: "5 Days",
    notes: "Will bring our 10-wheeler lorry directly to farm gate. Instant online RTGS bank transfer.",
    sentAt: "2026-10-04T09:15:00Z",
    status: "submitted",
    expectedResponse: "Within 24 hours",
  },
  {
    id: "QUOT-3093",
    leadId: "LEAD-402",
    farmerName: "Anjiiah Kuruma",
    sellerName: "Deccan Cotton Ginning & Pressing",
    sellerPhone: "+91 98480 33445",
    sellerLocation: "Huzurabad, Karimnagar",
    crop: "Cotton (Shankar-6)",
    quantity: 65,
    unit: "Quintals",
    offeredPrice: 7450,
    totalAmount: 484250,
    deliveryOption: "Farmer Pickup",
    availableFrom: "2026-10-10",
    validity: "4 Days",
    notes: "Competitive rate for clean moisture-free Grade-A staple cotton.",
    sentAt: "2026-10-04T10:00:00Z",
    status: "submitted",
    expectedResponse: "Within 48 hours",
  },
];

// Initial Realistic Buy Leads
export const INITIAL_BUY_LEADS: BuyLead[] = [
  {
    id: "LEAD-401",
    farmerName: "Ramesh Reddy",
    farmerLocation: "Wardhannapet, Warangal",
    district: "Warangal",
    state: "Telangana",
    crop: "Paddy (BPT 5204)",
    category: "Grains",
    quantity: 120,
    unit: "Quintals",
    expectedPricePerUnit: 2350,
    deliveryMode: "Farmer Pickup",
    deadline: "10 Oct 2026",
    postedTime: "2 hours ago",
    urgency: "High",
    fieldImageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    farmerPhone: "+91 98480 12345",
    description: "Harvested yesterday, moisture level 14%, clean grain ready at farm gate with easy tractor/lorry road access.",
  },
  {
    id: "LEAD-402",
    farmerName: "Anjiiah Kuruma",
    farmerLocation: "Huzurabad, Karimnagar",
    district: "Karimnagar",
    state: "Telangana",
    crop: "Cotton (Shankar-6)",
    category: "Grains",
    quantity: 65,
    unit: "Quintals",
    expectedPricePerUnit: 7400,
    deliveryMode: "Farmer Pickup",
    deadline: "15 Oct 2026",
    postedTime: "5 hours ago",
    urgency: "High",
    fieldImageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80",
    farmerPhone: "+91 98481 98765",
    description: "First picking grade-A long staple white cotton. Zero trash, stored in covered shed.",
  },
  {
    id: "LEAD-403",
    farmerName: "Srinivas Rao",
    farmerLocation: "Tenali, Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    crop: "Guntur Teja Red Chilli",
    category: "Vegetables",
    quantity: 40,
    unit: "Quintals",
    expectedPricePerUnit: 18500,
    deliveryMode: "Home Delivery",
    deadline: "18 Oct 2026",
    postedTime: "Yesterday",
    urgency: "Medium",
    fieldImageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
    farmerPhone: "+91 94401 55432",
    description: "Sun-dried fiery red chilli, uniform stemless grading. Direct dispatch to cold storage or mandi.",
  },
  {
    id: "LEAD-404",
    farmerName: "Venkatesh Naidu",
    farmerLocation: "Khammam Rural",
    district: "Khammam",
    state: "Telangana",
    crop: "Yellow Maize (Corn)",
    category: "Grains",
    quantity: 200,
    unit: "Quintals",
    expectedPricePerUnit: 2150,
    deliveryMode: "Farmer Pickup",
    deadline: "22 Oct 2026",
    postedTime: "2 days ago",
    urgency: "Medium",
    fieldImageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    farmerPhone: "+91 99890 33211",
    description: "High test-weight hybrid feed maize, machine threshed, packed in 50kg new HDPE gunny bags.",
  },
  {
    id: "LEAD-405",
    farmerName: "Lakshmi Bai",
    farmerLocation: "Suryapet, Nalgonda",
    district: "Nalgonda",
    state: "Telangana",
    crop: "Organic Country Tomatoes",
    category: "Organic",
    quantity: 50,
    unit: "Crates (25kg)",
    expectedPricePerUnit: 600,
    deliveryMode: "Home Delivery",
    deadline: "Tomorrow",
    postedTime: "3 hours ago",
    urgency: "High",
    fieldImageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    farmerPhone: "+91 97012 44321",
    description: "Certified zero-chemical organic desi tomatoes, firm and glossy, picked this morning.",
  },
];

// Initial Realistic Equipment Rentals for Seller / Fleet Owners
export const INITIAL_SELLER_EQUIPMENT: SellerEquipment[] = [
  {
    id: "EQ-801",
    name: "Mahindra 575 DI XP Plus Tractor (47 HP)",
    category: "Tractors",
    ownerName: "Sri Balaji Agro Services",
    verified: true,
    location: "Warangal Bypass Road, Warangal",
    pricePerHour: 650,
    securityDeposit: 2000,
    rating: 4.8,
    reviewCount: 36,
    imageUrl: "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=600&q=80",
    specifications: {
      hp: "47 HP",
      fuel: "Diesel",
      capacity: "1500 kg lift",
      model: "2025 XP Plus",
      year: "2025",
    },
    isAvailable: true,
    availabilityCalendar: [
      {
        date: "2026-10-05",
        availableDurations: ["2 Hours", "4 Hours", "Half Day", "Full Day"],
      },
      {
        date: "2026-10-06",
        availableDurations: ["2 Hours", "4 Hours", "Half Day"],
      },
      {
        date: "2026-10-07",
        availableDurations: ["Full Day"],
      },
    ],
    reviews: [
      { user: "M. Ramana", rating: 5, comment: "Powerful tractor, driver was very punctual and fuel efficient.", date: "28 Sep 2026" },
      { user: "K. Suresh", rating: 4.5, comment: "Good condition implement attachment, easily ploughed 4 acres.", date: "15 Sep 2026" },
    ],
  },
  {
    id: "EQ-802",
    name: "John Deere Multi-Crop Combine Harvester",
    category: "Harvesters",
    ownerName: "Kisan Agro Heavy Machinery",
    verified: true,
    location: "Karimnagar Main Road",
    pricePerHour: 2200,
    securityDeposit: 5000,
    rating: 4.9,
    reviewCount: 24,
    imageUrl: "https://images.unsplash.com/photo-1543883072-a193cb9d4692?auto=format&fit=crop&w=600&q=80",
    specifications: {
      hp: "105 HP Turbo",
      fuel: "Diesel",
      capacity: "Paddy & Maize cutter",
      model: "W70 SynchroSmart",
      year: "2024",
    },
    isAvailable: true,
    availabilityCalendar: [
      {
        date: "2026-10-05",
        availableDurations: ["Half Day", "Full Day"],
      },
      {
        date: "2026-10-06",
        availableDurations: ["Full Day"],
      },
    ],
    reviews: [
      { user: "Ch. Anjaiah", rating: 5, comment: "Clean grain separation, zero grain loss in heavy paddy field.", date: "22 Sep 2026" },
    ],
  },
  {
    id: "EQ-803",
    name: "DJI Agras T40 40L Agriculture Drone",
    category: "Drone",
    ownerName: "Kisan Drones & Robotics Ltd.",
    verified: true,
    location: "Hanamkonda, Warangal",
    pricePerHour: 950,
    securityDeposit: 3000,
    rating: 4.9,
    reviewCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80",
    specifications: {
      capacity: "40L liquid / 50kg granular",
      coverage: "1 acre in 6 minutes",
      fuel: "Electric Dual Battery",
      model: "Agras T40 DGCA Certified",
      year: "2026",
    },
    isAvailable: true,
    availabilityCalendar: [
      {
        date: "2026-10-05",
        availableDurations: ["2 Hours", "4 Hours", "Half Day", "Full Day"],
      },
      {
        date: "2026-10-06",
        availableDurations: ["2 Hours", "4 Hours"],
      },
    ],
    reviews: [
      { user: "P. Venkat", rating: 5, comment: "Sprayed 12 acres of cotton in less than 2 hours. Excellent droplet penetration.", date: "30 Sep 2026" },
    ],
  },
  {
    id: "EQ-804",
    name: "Shaktiman 7-Feet Multi-Speed Rotavator",
    category: "Harvesters / Implements",
    ownerName: "Sri Balaji Agro Services",
    verified: true,
    location: "Warangal Bypass Road",
    pricePerHour: 350,
    securityDeposit: 1000,
    rating: 4.7,
    reviewCount: 19,
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80",
    specifications: {
      capacity: "48 Boron Steel Blades",
      hp: "Requires 40+ HP tractor",
      model: "Regular Plus 185",
      year: "2025",
    },
    isAvailable: true,
    availabilityCalendar: [
      {
        date: "2026-10-05",
        availableDurations: ["2 Hours", "4 Hours", "Half Day", "Full Day"],
      },
    ],
    reviews: [
      { user: "G. Naveen", rating: 4.5, comment: "Pulverizes tough soil into fine tilth with one single pass.", date: "18 Sep 2026" },
    ],
  },
];

// Initial Realistic Equipment Rental Bookings for Fleet Owners
export const INITIAL_EQUIPMENT_BOOKINGS: SellerEquipmentBooking[] = [
  {
    id: "BK-7701",
    equipmentId: "EQ-801",
    equipmentName: "Mahindra 575 DI XP Plus Tractor (47 HP)",
    equipmentCategory: "Tractors",
    customerName: "Ramesh Varma (Sri Venkateswara Farms)",
    bookingDate: "2026-10-06",
    startTime: "08:00 AM",
    duration: "Half Day",
    rentalAmount: 2600,
    depositFee: 500,
    totalAmount: 3100,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    contactPhone: "+91 98490 12345",
    location: "Wardhannapet, Warangal",
    status: "Confirmed",
    bookedAt: "2026-10-03T16:00:00Z",
  },
  {
    id: "BK-7702",
    equipmentId: "EQ-803",
    equipmentName: "DJI Agras T40 40L Agriculture Drone",
    equipmentCategory: "Drone",
    customerName: "B. Mallesh Yadav",
    bookingDate: "2026-10-07",
    startTime: "06:30 AM",
    duration: "2 Hours",
    rentalAmount: 1900,
    depositFee: 1000,
    totalAmount: 2900,
    paymentMethod: "Cash on Delivery / Pickup",
    paymentStatus: "Pending",
    contactPhone: "+91 94408 77665",
    location: "Geesugonda, Warangal Rural",
    status: "Pending",
    bookedAt: "2026-10-04T11:20:00Z",
  },
  {
    id: "BK-7703",
    equipmentId: "EQ-802",
    equipmentName: "John Deere Multi-Crop Combine Harvester",
    equipmentCategory: "Harvesters",
    customerName: "K. Narayana Rao",
    bookingDate: "2026-10-05",
    startTime: "07:00 AM",
    duration: "Full Day",
    rentalAmount: 17600,
    depositFee: 5000,
    totalAmount: 22600,
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    contactPhone: "+91 99881 22334",
    location: "Enumamula, Hanamkonda",
    status: "Active",
    bookedAt: "2026-10-02T14:10:00Z",
  },
  {
    id: "BK-7704",
    equipmentId: "EQ-804",
    equipmentName: "Shaktiman 7-Feet Multi-Speed Rotavator",
    equipmentCategory: "Harvesters / Implements",
    customerName: "S. Thirupathi Reddy",
    bookingDate: "2026-10-01",
    startTime: "09:00 AM",
    duration: "4 Hours",
    rentalAmount: 1400,
    depositFee: 500,
    totalAmount: 1900,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    contactPhone: "+91 98665 44332",
    location: "Parkal Mandal",
    status: "Completed",
    bookedAt: "2026-09-30T10:00:00Z",
  },
];

// Initial demo onboarding data
export const INITIAL_ONBOARDING_DATA: SellerOnboardingData = {
  businessName: "Sri Lakshmi Venkateswara Agro Traders",
  ownerName: "Mani Kumar Reddy",
  mobile: "9849012345",
  isMobileVerified: true,
  email: "info@lakshmiagro.in",
  pinCode: "506002",
  storeAddress: "Shop #14, Agriculture Market Yard, Warangal",
  locationVerified: true,
  gpsLocationName: "Warangal, Telangana (GPS Verified)",
  businessCategories: ["Seeds & Fertilizers", "Farm Equipment"],
  productCategories: ["Seeds", "Fertilizers", "Farm Tools"],
  rentEquipment: true,
  kycDocuments: {
    aadhaarUploaded: true,
    aadhaarFileName: "aadhaar_front_back_verified.pdf",
    gstUploaded: true,
    gstFileName: "gst_reg_certificate_36AA.pdf",
    shopPhotoUploaded: true,
    shopPhotoFileName: "shop_front_signboard.jpg",
  },
  bankDetails: {
    accountNumber: "50200012345678",
    ifscCode: "HDFC0000421",
    accountHolderName: "Sri Lakshmi Venkateswara Agro Traders",
    upiId: "lakshmiagro@okhdfcbank",
  },
  acceptCod: true,
  termsAccepted: true,
};

// Frontend Service Abstraction for Seller / Vendor Module
class SellerService {
  private products: SellerProduct[] = [...INITIAL_SELLER_PRODUCTS];
  private buyLeads: BuyLead[] = [...INITIAL_BUY_LEADS];
  private equipment: SellerEquipment[] = [...INITIAL_SELLER_EQUIPMENT];
  private quotations: Quotation[] = [...INITIAL_QUOTATIONS];
  private bookings: SellerEquipmentBooking[] = [
    {
      id: "BK-7701",
      equipmentId: "EQ-801",
      equipmentName: "Mahindra 575 DI XP Plus Tractor (47 HP)",
      equipmentCategory: "Tractors",
      bookingDate: "2026-10-06",
      startTime: "08:00 AM",
      duration: "Half Day",
      rentalAmount: 2600,
      depositFee: 500,
      totalAmount: 3100,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      contactPhone: "+91 98490 12345",
      location: "Wardhannapet, Warangal",
      status: "Confirmed",
      bookedAt: "2026-10-03T16:00:00Z",
    },
  ];
  private onboardingData: SellerOnboardingData = { ...INITIAL_ONBOARDING_DATA };
  private verificationStatus: SellerVerificationStatus = "pending_verification";

  // Dashboard Stats
  public async getDashboardStats(): Promise<SellerDashboardStats> {
    const activeProductsCount = this.products.filter((p) => p.status === "active").length;
    return {
      activeProductsCount,
      pendingOrdersCount: 3,
      totalEarnings: 148500,
      monthlyRevenue: 62400,
      buyLeadsCount: this.buyLeads.length,
      equipmentCount: this.equipment.length,
      verificationStatus: this.verificationStatus,
    };
  }

  // Onboarding & Profile
  public async getOnboardingData(): Promise<SellerOnboardingData> {
    return { ...this.onboardingData };
  }

  public async saveOnboardingData(data: Partial<SellerOnboardingData>): Promise<SellerRegistrationResult> {
    this.onboardingData = { ...this.onboardingData, ...data };
    this.verificationStatus = "pending_verification";
    const regId = `RS360-VND-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      registrationId: regId,
      submittedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      estimatedVerificationDays: "24-48 business hours",
      businessName: this.onboardingData.businessName || "Registered Agro Business",
    };
  }

  public async getVerificationStatus(): Promise<SellerVerificationStatus> {
    return this.verificationStatus;
  }

  // Products
  public async getProducts(category?: string, search?: string): Promise<SellerProduct[]> {
    let result = [...this.products];
    if (category && category !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public async getProductById(id: string): Promise<SellerProduct | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  public async addProduct(product: Omit<SellerProduct, "id" | "createdAt" | "updatedAt">): Promise<SellerProduct> {
    const newProduct: SellerProduct = {
      ...product,
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<SellerProduct>): Promise<SellerProduct> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    const updated = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.products[index] = updated;
    return updated;
  }

  public async updateStock(id: string, newStock: number): Promise<SellerProduct> {
    if (newStock < 0) throw new Error("Stock cannot be negative");
    return this.updateProduct(id, { stock: newStock });
  }

  public async toggleProductStatus(id: string): Promise<SellerProduct> {
    const product = await this.getProductById(id);
    if (!product) throw new Error("Product not found");
    const nextStatus = product.status === "active" ? "inactive" : "active";
    return this.updateProduct(id, { status: nextStatus });
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  // Buy Leads
  public async getBuyLeads(category?: string, search?: string, filters?: Partial<LeadFilterCriteria>): Promise<BuyLead[]> {
    let result = [...this.buyLeads];
    if (category && category !== "All") {
      result = result.filter((l) => l.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.crop.toLowerCase().includes(q) ||
          l.farmerName.toLowerCase().includes(q) ||
          l.farmerLocation.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q)
      );
    }
    if (filters) {
      if (filters.cropType && filters.cropType !== "All") {
        result = result.filter((l) => l.crop.toLowerCase().includes(filters.cropType!.toLowerCase()));
      }
      if (filters.district && filters.district !== "All") {
        result = result.filter((l) => l.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.urgency && filters.urgency !== "all") {
        result = result.filter((l) => l.urgency === filters.urgency);
      }
      if (filters.minQuantity !== undefined) {
        result = result.filter((l) => l.quantity >= filters.minQuantity!);
      }
      if (filters.maxQuantity !== undefined) {
        result = result.filter((l) => l.quantity <= filters.maxQuantity!);
      }
    }
    return result;
  }

  public async getLeadById(id: string): Promise<BuyLead | null> {
    return this.buyLeads.find((l) => l.id === id) || null;
  }

  // Quotations
  public async sendQuotation(
    quoteData: Omit<Quotation, "id" | "sentAt" | "status" | "expectedResponse">
  ): Promise<Quotation> {
    const quote: Quotation = {
      ...quoteData,
      id: `QUOT-${Math.floor(1000 + Math.random() * 9000)}`,
      sentAt: new Date().toISOString(),
      status: "submitted",
      expectedResponse: "Within 24-48 hours",
    };
    this.quotations.unshift(quote);
    return quote;
  }

  public async getQuotations(): Promise<Quotation[]> {
    return [...this.quotations];
  }

  // Equipment Rental
  public async getEquipmentList(category?: string, search?: string): Promise<SellerEquipment[]> {
    let result = [...this.equipment];
    if (category && category !== "All") {
      result = result.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public async getEquipmentById(id: string): Promise<SellerEquipment | null> {
    return this.equipment.find((e) => e.id === id) || null;
  }

  public async bookEquipment(
    bookingData: Omit<SellerEquipmentBooking, "id" | "status" | "bookedAt">
  ): Promise<SellerEquipmentBooking> {
    const booking: SellerEquipmentBooking = {
      ...bookingData,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    };
    this.bookings.unshift(booking);
    return booking;
  }

  public async getBookings(): Promise<SellerEquipmentBooking[]> {
    return [...this.bookings];
  }
}

const sellerService = new SellerService();
export default sellerService;
