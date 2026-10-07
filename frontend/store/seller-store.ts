import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  SellerProduct,
  BuyLead,
  Quotation,
  SellerEquipment,
  SellerEquipmentBooking,
  SellerOnboardingData,
  SellerVerificationStatus,
  SellerRegistrationResult,
  SellerOrder,
  SellerFulfillmentStatus,
  EquipmentBookingStatus,
} from "../types/seller";
import {
  INITIAL_SELLER_PRODUCTS,
  INITIAL_BUY_LEADS,
  INITIAL_SELLER_EQUIPMENT,
  INITIAL_ONBOARDING_DATA,
  INITIAL_SELLER_ORDERS,
  INITIAL_QUOTATIONS,
  INITIAL_EQUIPMENT_BOOKINGS,
} from "../services/seller";

interface SellerState {
  products: SellerProduct[];
  orders: SellerOrder[];
  buyLeads: BuyLead[];
  quotations: Quotation[];
  equipment: SellerEquipment[];
  bookings: SellerEquipmentBooking[];
  onboardingData: SellerOnboardingData;
  verificationStatus: SellerVerificationStatus;
  lastRegistrationResult: SellerRegistrationResult | null;

  // Order Actions
  addOrder: (order: SellerOrder) => void;
  updateOrderStatus: (id: string, status: SellerFulfillmentStatus) => void;

  // Product Actions
  addProduct: (product: Omit<SellerProduct, "id" | "createdAt" | "updatedAt">) => SellerProduct;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => void;
  updateStock: (id: string, newStock: number) => void;
  toggleProductStatus: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Quotation Actions
  addQuotation: (
    quotation: Omit<Quotation, "id" | "sentAt" | "status" | "expectedResponse">
  ) => Quotation;
  acceptQuotation: (id: string) => void;
  rejectQuotation: (id: string) => void;

  // Equipment Fleet Owner Actions
  addEquipment: (item: Omit<SellerEquipment, "id">) => SellerEquipment;
  updateEquipment: (id: string, updates: Partial<SellerEquipment>) => void;
  toggleEquipmentStatus: (id: string) => void;
  deleteEquipment: (id: string) => void;
  addEquipmentBooking: (
    booking: Omit<SellerEquipmentBooking, "id" | "status" | "bookedAt">
  ) => SellerEquipmentBooking;
  updateBookingStatus: (id: string, status: EquipmentBookingStatus) => void;

  // Onboarding Actions
  updateOnboardingStep: (data: Partial<SellerOnboardingData>) => void;
  completeRegistration: () => SellerRegistrationResult;
  resetOnboarding: () => void;

  // Notification Actions
  readNotificationIds: string[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      products: INITIAL_SELLER_PRODUCTS,
      orders: INITIAL_SELLER_ORDERS,
      buyLeads: INITIAL_BUY_LEADS,
      quotations: INITIAL_QUOTATIONS,
      equipment: INITIAL_SELLER_EQUIPMENT,
      bookings: INITIAL_EQUIPMENT_BOOKINGS,
      onboardingData: INITIAL_ONBOARDING_DATA,
      verificationStatus: "pending_verification",
      lastRegistrationResult: {
        registrationId: "RS360-VND-849201",
        submittedAt: "03 Oct 2026",
        estimatedVerificationDays: "24-48 business hours",
        businessName: INITIAL_ONBOARDING_DATA.businessName,
      },

      addOrder: (newOrder) => {
        set((state) => {
          const currentOrders = state.orders || [];
          // Prevent duplicates by ID or farmerOrderId
          if (
            currentOrders.some(
              (o) =>
                o.id === newOrder.id ||
                (newOrder.farmerOrderId && o.farmerOrderId === newOrder.farmerOrderId)
            )
          ) {
            return state;
          }
          return {
            orders: [newOrder, ...currentOrders],
          };
        });
      },

      updateOrderStatus: (id, status) => {
        const getBadgeColor = (st: SellerFulfillmentStatus) => {
          switch (st) {
            case "Ready for Dispatch":
              return "bg-amber-50 text-amber-700 border-amber-200";
            case "Packed":
              return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "Dispatched":
            case "In Transit":
              return "bg-blue-50 text-blue-700 border-blue-200";
            case "Delivered":
              return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Cancelled":
              return "bg-rose-50 text-rose-700 border-rose-200";
            default:
              return "bg-gray-50 text-gray-700 border-gray-200";
          }
        };

        set((state) => ({
          orders: (state.orders || []).map((o) =>
            o.id === id ? { ...o, status, badgeColor: getBadgeColor(status) } : o
          ),
        }));
      },

      addProduct: (productData) => {
        const newProd: SellerProduct = {
          ...productData,
          id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          products: [newProd, ...state.products],
        }));
        return newProd;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      updateStock: (id, newStock) => {
        if (newStock < 0) return;
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      toggleProductStatus: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: p.status === "active" ? "inactive" : "active",
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addQuotation: (quoteData) => {
        const state = get();
        const quote: Quotation = {
          ...quoteData,
          id: `QUOT-${Math.floor(1000 + Math.random() * 9000)}`,
          sellerName: quoteData.sellerName || state.onboardingData?.businessName || "Sri Balaji Agro Agencies",
          sellerPhone: quoteData.sellerPhone || state.onboardingData?.mobile || "+91 98490 12345",
          sellerLocation: quoteData.sellerLocation || state.onboardingData?.storeAddress || "Enumamula Mandi, Warangal",
          sentAt: new Date().toISOString(),
          status: "submitted",
          expectedResponse: "Within 24-48 hours",
        };
        set((prevState) => ({
          quotations: [quote, ...prevState.quotations],
        }));
        return quote;
      },

      acceptQuotation: (quotationId) => {
        set((state) => {
          const target = (state.quotations || []).find((q) => q.id === quotationId);
          if (!target) return state;

          return {
            quotations: (state.quotations || []).map((q) => {
              if (q.id === quotationId) {
                return { ...q, status: "accepted" };
              }
              // Mark other quotations for the same demand/lead as "not_selected"
              if (q.leadId === target.leadId && (q.status === "submitted" || q.status === "under_review")) {
                return { ...q, status: "not_selected" };
              }
              return q;
            }),
          };
        });
      },

      rejectQuotation: (quotationId) => {
        set((state) => ({
          quotations: (state.quotations || []).map((q) =>
            q.id === quotationId ? { ...q, status: "rejected" } : q
          ),
        }));
      },

      addEquipment: (itemData) => {
        const state = get();
        const id = `EQ-${Math.floor(100 + Math.random() * 900)}`;
        const newItem: SellerEquipment = {
          ...itemData,
          id,
          ownerName: itemData.ownerName || state.onboardingData?.businessName || "My Farm Fleet",
          verified: itemData.verified ?? true,
          rating: itemData.rating ?? 5.0,
          reviewCount: itemData.reviewCount ?? 0,
          reviews: itemData.reviews ?? [],
          isAvailable: itemData.isAvailable ?? true,
          status: itemData.status ?? "active",
          availabilityCalendar: itemData.availabilityCalendar || [
            {
              date: new Date().toISOString().split("T")[0],
              availableDurations: ["2 Hours", "4 Hours", "Half Day", "Full Day"],
            },
          ],
        };
        set((prevState) => ({
          equipment: [newItem, ...prevState.equipment],
        }));
        return newItem;
      },

      updateEquipment: (id, updates) => {
        set((state) => ({
          equipment: state.equipment.map((e) => {
            if (e.id === id) {
              const newStatus = updates.status !== undefined ? updates.status : e.status;
              const newAvailable =
                updates.isAvailable !== undefined
                  ? updates.isAvailable
                  : newStatus === "active";
              return {
                ...e,
                ...updates,
                status: newStatus,
                isAvailable: newAvailable,
              };
            }
            return e;
          }),
        }));
      },

      toggleEquipmentStatus: (id) => {
        set((state) => ({
          equipment: state.equipment.map((e) => {
            if (e.id === id) {
              const currentActive = (e.status ?? (e.isAvailable ? "active" : "inactive")) === "active";
              const nextStatus = currentActive ? "inactive" : "active";
              return {
                ...e,
                status: nextStatus,
                isAvailable: nextStatus === "active",
              };
            }
            return e;
          }),
        }));
      },

      deleteEquipment: (id) => {
        set((state) => ({
          equipment: state.equipment.filter((e) => e.id !== id),
        }));
      },

      addEquipmentBooking: (bookingData) => {
        const booking: SellerEquipmentBooking = {
          ...bookingData,
          id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
          status: (bookingData as any).status || "Confirmed",
          bookedAt: new Date().toISOString(),
        };
        set((state) => ({
          bookings: [booking, ...state.bookings],
        }));
        return booking;
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
      },

      updateOnboardingStep: (data) => {
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        }));
      },

      completeRegistration: () => {
        const state = get();
        const regId = `RS360-VND-${Math.floor(100000 + Math.random() * 900000)}`;
        const result: SellerRegistrationResult = {
          registrationId: regId,
          submittedAt: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          estimatedVerificationDays: "24-48 business hours",
          businessName: state.onboardingData.businessName || "Registered Agro Store",
        };
        set({
          verificationStatus: "pending_verification",
          lastRegistrationResult: result,
        });
        return result;
      },

      resetOnboarding: () => {
        set({
          onboardingData: { ...INITIAL_ONBOARDING_DATA },
          verificationStatus: "unregistered",
        });
      },

      readNotificationIds: ["notif_order_status_ORD-9478_Delivered"],

      markNotificationRead: (id) => {
        set((state) => {
          const current = state.readNotificationIds || [];
          if (current.includes(id)) return state;
          return {
            readNotificationIds: [...current, id],
          };
        });
      },

      markAllNotificationsRead: (ids) => {
        set((state) => {
          const currentSet = new Set(state.readNotificationIds || []);
          ids.forEach((id) => currentSet.add(id));
          return {
            readNotificationIds: Array.from(currentSet),
          };
        });
      },
    }),
    {
      name: "raitusevak-seller-store",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
