export type BusinessCategory =
  | "Seeds & Fertilizers"
  | "Farm Equipment"
  | "Pesticides"
  | "Organic Products";

export type ProductCategory =
  | "Seeds"
  | "Fertilizers"
  | "Pesticides"
  | "Farm Tools"
  | "Tractors"
  | "Harvesters"
  | "Irrigation"
  | "Organic";

export interface SellerOnboardingData {
  businessName: string;
  ownerName: string;
  mobile: string;
  isMobileVerified: boolean;
  email?: string;
  pinCode: string;
  storeAddress: string;
  locationVerified: boolean;
  gpsLocationName: string;
  businessCategories: BusinessCategory[];
  productCategories: ProductCategory[];
  rentEquipment: boolean;
  kycDocuments: {
    aadhaarUploaded: boolean;
    aadhaarFileName?: string;
    gstUploaded: boolean;
    gstFileName?: string;
    shopPhotoUploaded: boolean;
    shopPhotoFileName?: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    upiId?: string;
  };
  acceptCod: boolean;
  termsAccepted: boolean;
}

export type SellerVerificationStatus =
  | "unregistered"
  | "pending_verification"
  | "verified"
  | "rejected";

export interface SellerRegistrationResult {
  registrationId: string;
  submittedAt: string;
  estimatedVerificationDays: string;
  businessName: string;
}

export type LeadUrgency = "High" | "Medium" | "Low";
export type LeadCategory = "All" | "Grains" | "Vegetables" | "Fruits" | "Organic";

export interface BuyLead {
  id: string;
  farmerName: string;
  farmerLocation: string;
  district: string;
  state: string;
  crop: string;
  category: "Grains" | "Vegetables" | "Fruits" | "Organic";
  quantity: number;
  unit: string;
  expectedPricePerUnit: number;
  deliveryMode: "Farmer Pickup" | "Home Delivery" | "Flexible";
  deadline: string;
  postedTime: string;
  urgency: LeadUrgency;
  fieldImageUrl: string;
  farmerPhone: string;
  description?: string;
}

export interface LeadFilterCriteria {
  cropType: string;
  minQuantity: number;
  maxQuantity: number;
  district: string;
  datePosted: "all" | "today" | "week" | "month";
  urgency: "all" | LeadUrgency;
}

export type QuotationStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "declined"
  | "rejected"
  | "not_selected";

export interface Quotation {
  id: string;
  leadId: string;
  farmerName: string;
  sellerName?: string;
  sellerPhone?: string;
  sellerLocation?: string;
  crop: string;
  quantity: number;
  unit: string;
  offeredPrice: number;
  totalAmount: number;
  deliveryOption: "Farmer Pickup" | "Home Delivery";
  availableFrom: string;
  validity: string;
  notes?: string;
  sentAt: string;
  status: QuotationStatus;
  expectedResponse: string;
}

export type EquipmentCategory =
  | "Tractors"
  | "Harvesters"
  | "Harvesters / Implements"
  | "Drone"
  | "Other";

export type EquipmentDuration =
  | "2 Hours"
  | "4 Hours"
  | "Half Day"
  | "Full Day";

export interface SellerEquipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  ownerName: string;
  verified: boolean;
  location: string;
  pricePerHour: number;
  rateUnit?: string;
  securityDeposit: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description?: string;
  status?: "active" | "inactive";
  specifications: {
    hp?: string;
    fuel?: string;
    capacity?: string;
    model?: string;
    year?: string;
    [key: string]: string | undefined;
  };
  availabilityCalendar: {
    date: string;
    availableDurations: EquipmentDuration[];
  }[];
  isAvailable: boolean;
  reviews: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export type EquipmentBookingStatus =
  | "Pending"
  | "Confirmed"
  | "Active"
  | "Completed"
  | "Cancelled";

export interface SellerEquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  customerName?: string;
  bookingDate: string;
  startTime: string;
  duration: EquipmentDuration;
  rentalAmount: number;
  depositFee: number;
  totalAmount: number;
  paymentMethod: "UPI" | "Net Banking" | "Cash on Delivery / Pickup";
  paymentStatus: "Paid" | "Pending";
  contactPhone: string;
  location: string;
  status: EquipmentBookingStatus;
  bookedAt: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizers" | "Pesticides" | "Farm Tools" | "Other";
  subCategory: string;
  price: number;
  unit: string;
  moq: number;
  stock: number;
  status: "active" | "inactive";
  isAvailableForDelivery: boolean;
  location: string;
  description: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerDashboardStats {
  activeProductsCount: number;
  pendingOrdersCount: number;
  totalEarnings: number;
  monthlyRevenue: number;
  buyLeadsCount: number;
  equipmentCount: number;
  verificationStatus: SellerVerificationStatus;
}

export type SellerFulfillmentStatus =
  | "Ready for Dispatch"
  | "Packed"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface SellerOrderLineItem {
  productId: string;
  productName: string;
  productImage?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
}

export interface SellerOrderDeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
}

export interface SellerOrder {
  id: string;
  farmerOrderId?: string;
  customer: string;
  customerPhone?: string;
  items: string;
  amount: string;
  totalAmountNum?: number;
  status: SellerFulfillmentStatus;
  date: string;
  createdAt?: string;
  badgeColor?: string;
  deliveryAddress?: SellerOrderDeliveryAddress;
  paymentMethod?: string;
  paymentStatus?: string;
  lineItems?: SellerOrderLineItem[];
}

export type SellerNotificationCategory =
  | "order"
  | "quotation"
  | "equipment"
  | "product"
  | "account";

export interface SellerNotification {
  id: string;
  category: SellerNotificationCategory;
  titleKey?: string;
  title: string;
  messageKey?: string;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
  actionLabel?: string;
  priority?: "high" | "normal";
  entityId?: string;
}
