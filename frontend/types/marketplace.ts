export type ProductCategory =
  | "all"
  | "seeds"
  | "fertilizer"
  | "tools"
  | "pesticides"
  | "machinery";

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: "seeds" | "fertilizer" | "tools" | "pesticides" | "machinery";
  image: string;
  price: number;
  mrp?: number;
  unit: string;
  rating: number;
  reviewCount: number;
  stock: number;
  seller: string;
  sellerLocation: string;
  badge: string;
  description: string;
  specifications: Record<string, string>;
  featured?: boolean;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
}

export type PaymentMethodType = "upi" | "cod" | "card" | "kcc";

export interface MarketplaceOrder {
  id: string;
  items: CartItem[];
  itemsTotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  address: DeliveryAddress;
  status: "placed" | "packed" | "shipped" | "delivered";
  createdAt: string;
  estimatedDeliveryDate: string;
}

export type EquipmentCategory =
  | "all"
  | "tractor"
  | "harvester"
  | "sprayer"
  | "implement"
  | "chc";

export interface EquipmentItem {
  id: string;
  name: string;
  category: "tractor" | "harvester" | "sprayer" | "implement" | "chc";
  image: string;
  hourlyRate?: number;
  dailyRate: number;
  owner: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  specs: Record<string, string>;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  durationDays: number;
  durationHours?: number;
  totalEstimatedAmount: number;
  farmerName: string;
  contactMobile: string;
  farmLocation: string;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}
