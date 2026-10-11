import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CartItem,
  MarketplaceProduct,
  DeliveryAddress,
  PaymentMethodType,
  MarketplaceOrder,
  EquipmentBooking,
} from "@/types/marketplace";
import { LabourBooking, LabourWorker, WorkerAvailability } from "@/types/labour";
import { LandRentalRequest, LandPlot } from "@/types/land";
import { SellerOrder } from "@/types/seller";
import { useSellerStore } from "./seller-store";

interface CartState {
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  orders: MarketplaceOrder[];
  bookings: EquipmentBooking[];
  labourBookings: LabourBooking[];
  landRequests: LandRentalRequest[];

  // Provider-Side States (Two-Sided Marketplace)
  myWorkerProfile: LabourWorker | null;
  myLandListings: LandPlot[];

  // Actions
  addItem: (product: MarketplaceProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setDeliveryAddress: (address: Partial<DeliveryAddress>) => void;
  placeOrder: (paymentMethod: PaymentMethodType, paymentMethodLabel: string) => MarketplaceOrder;
  getOrderById: (orderId: string) => MarketplaceOrder | undefined;
  addBooking: (booking: EquipmentBooking) => void;
  getBookingById: (bookingId: string) => EquipmentBooking | undefined;
  addLabourBooking: (booking: LabourBooking) => void;
  getLabourBookingById: (bookingId: string) => LabourBooking | undefined;
  addLandRequest: (request: LandRentalRequest) => void;
  getLandRequestById: (requestId: string) => LandRentalRequest | undefined;

  // Provider-Side Actions
  setMyWorkerProfile: (profile: LabourWorker | null) => void;
  updateMyWorkerProfile: (updates: Partial<LabourWorker>) => void;
  updateMyWorkerAvailability: (availability: WorkerAvailability) => void;
  toggleMyWorkerActive: () => void;
  addMyLandListing: (land: LandPlot) => void;
  updateMyLandListing: (land: LandPlot) => void;
  toggleMyLandListingActive: (id: string) => void;
  updateMyLandListingAvailability: (id: string, availability: "available" | "reserved" | "leased") => void;
  removeMyLandListing: (id: string) => void;

  // Computations
  getItemsCount: () => number;
  getItemsTotal: () => number;
  getDeliveryCharge: () => number;
  getTotalAmount: () => number;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  fullName: "Ramesh Kumar Reddy",
  phone: "9876543210",
  street: "Survey No. 42, Farm Gate Road",
  village: "Madikonda",
  mandal: "Kazipet",
  district: "Hanamkonda",
  state: "Telangana",
  pincode: "506142",
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryAddress: DEFAULT_ADDRESS,
      orders: [],
      bookings: [],
      labourBookings: [],
      landRequests: [],
      myWorkerProfile: null,
      myLandListings: [],

      addItem: (product: MarketplaceProduct, quantity: number = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQty = Math.min(currentItem.quantity + quantity, product.stock);
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQty,
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(Math.max(1, quantity), product.stock),
              },
            ],
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                return {
                  ...item,
                  quantity: Math.min(quantity, item.product.stock),
                };
              }
              return item;
            }),
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setDeliveryAddress: (partialAddress: Partial<DeliveryAddress>) => {
        set((state) => ({
          deliveryAddress: {
            ...state.deliveryAddress,
            ...partialAddress,
          },
        }));
      },

      placeOrder: (paymentMethod: PaymentMethodType, paymentMethodLabel: string): MarketplaceOrder => {
        const state = get();
        const itemsTotal = state.getItemsTotal();
        const deliveryCharge = state.getDeliveryCharge();
        const totalAmount = itemsTotal + deliveryCharge;

        const date = new Date();
        const estDate = new Date();
        estDate.setDate(date.getDate() + 3);

        const newOrder: MarketplaceOrder = {
          id: `RS360-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
          items: [...state.items],
          itemsTotal,
          deliveryCharge,
          totalAmount,
          paymentMethod,
          paymentMethodLabel,
          address: { ...state.deliveryAddress },
          status: "placed",
          createdAt: date.toISOString(),
          estimatedDeliveryDate: estDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };

        // Synchronize Seller products in cart to Seller-side Dispatches/Orders
        try {
          const sellerState = useSellerStore.getState();
          const sellerProducts = sellerState?.products || [];
          const sellerProductIds = new Set(sellerProducts.map((p) => p.id));

          // Filter line items that belong to active or registered Seller products
          const sellerCartItems = state.items.filter(
            (item) => sellerProductIds.has(item.product.id) || item.product.id.startsWith("PROD-")
          );

          if (sellerCartItems.length > 0 && typeof sellerState.addOrder === "function") {
            const sellerItemsTotal = sellerCartItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );

            const itemsSummary = sellerCartItems
              .map(
                (item) =>
                  `${item.product.name} (${item.quantity} ${
                    item.product.unit || "unit"
                  })`
              )
              .join(", ");

            const sellerOrder: SellerOrder = {
              id: newOrder.id,
              farmerOrderId: newOrder.id,
              customer: state.deliveryAddress.fullName || "Farmer Customer",
              customerPhone: state.deliveryAddress.phone || "",
              items: itemsSummary,
              amount: `₹${sellerItemsTotal.toLocaleString("en-IN")}`,
              totalAmountNum: sellerItemsTotal,
              status: "Ready for Dispatch",
              date: "Just now",
              createdAt: date.toISOString(),
              badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
              deliveryAddress: { ...state.deliveryAddress },
              paymentMethod: paymentMethodLabel,
              paymentStatus: paymentMethod === "cod" ? "Pending (Cash on Delivery)" : "Paid",
              lineItems: sellerCartItems.map((item) => ({
                productId: item.product.id,
                productName: item.product.name,
                productImage: item.product.image,
                category: item.product.category,
                quantity: item.quantity,
                unitPrice: item.product.price,
                totalPrice: item.product.price * item.quantity,
                unit: item.product.unit,
              })),
            };

            sellerState.addOrder(sellerOrder);
          }
        } catch (err) {
          console.warn("Seller order dispatch synchronization:", err);
        }

        set((prevState) => ({
          orders: [newOrder, ...prevState.orders],
          items: [], // clear cart after successful order creation
        }));

        return newOrder;
      },

      getOrderById: (orderId: string) => {
        const { orders } = get();
        return orders.find((o) => o.id === orderId);
      },

      addBooking: (booking: EquipmentBooking) => {
        set((state) => ({
          bookings: [booking, ...state.bookings.filter((b) => b.id !== booking.id)],
        }));
      },

      getBookingById: (bookingId: string) => {
        const { bookings } = get();
        return bookings.find((b) => b.id === bookingId);
      },

      addLabourBooking: (booking: LabourBooking) => {
        set((state) => ({
          labourBookings: [booking, ...(state.labourBookings || []).filter((b) => b.id !== booking.id)],
        }));
      },

      getLabourBookingById: (bookingId: string) => {
        const { labourBookings } = get();
        return (labourBookings || []).find((b) => b.id === bookingId);
      },

      addLandRequest: (request: LandRentalRequest) => {
        set((state) => ({
          landRequests: [request, ...(state.landRequests || []).filter((r) => r.id !== request.id)],
        }));
      },

      getLandRequestById: (requestId: string) => {
        const { landRequests } = get();
        return (landRequests || []).find((r) => r.id === requestId);
      },

      setMyWorkerProfile: (profile: LabourWorker | null) => {
        set({ myWorkerProfile: profile });
      },

      updateMyWorkerProfile: (updates: Partial<LabourWorker>) => {
        set((state) => ({
          myWorkerProfile: state.myWorkerProfile
            ? { ...state.myWorkerProfile, ...updates }
            : null,
        }));
      },

      updateMyWorkerAvailability: (availability: WorkerAvailability) => {
        set((state) => ({
          myWorkerProfile: state.myWorkerProfile
            ? { ...state.myWorkerProfile, availability }
            : null,
        }));
      },

      toggleMyWorkerActive: () => {
        set((state) => {
          if (!state.myWorkerProfile) return {};
          const currentActive = state.myWorkerProfile.isActive !== false;
          return {
            myWorkerProfile: {
              ...state.myWorkerProfile,
              isActive: !currentActive,
            },
          };
        });
      },

      addMyLandListing: (land: LandPlot) => {
        set((state) => ({
          myLandListings: [land, ...(state.myLandListings || []).filter((l) => l.id !== land.id)],
        }));
      },

      updateMyLandListing: (updatedLand: LandPlot) => {
        set((state) => ({
          myLandListings: (state.myLandListings || []).map((l) =>
            l.id === updatedLand.id ? updatedLand : l
          ),
        }));
      },

      toggleMyLandListingActive: (id: string) => {
        set((state) => ({
          myLandListings: (state.myLandListings || []).map((l) =>
            l.id === id ? { ...l, isActive: l.isActive === false ? true : false } : l
          ),
        }));
      },

      updateMyLandListingAvailability: (
        id: string,
        availability: "available" | "reserved" | "leased"
      ) => {
        set((state) => ({
          myLandListings: (state.myLandListings || []).map((l) =>
            l.id === id ? { ...l, availability } : l
          ),
        }));
      },

      removeMyLandListing: (id: string) => {
        set((state) => ({
          myLandListings: (state.myLandListings || []).filter((l) => l.id !== id),
        }));
      },

      getItemsCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemsTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getDeliveryCharge: () => {
        const { items } = get();
        if (items.length === 0) return 0;
        const total = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        return total >= 1000 ? 0 : 50;
      },

      getTotalAmount: () => {
        const itemsTotal = get().getItemsTotal();
        const deliveryCharge = get().getDeliveryCharge();
        return itemsTotal + deliveryCharge;
      },
    }),
    {
      name: "raitusevak-marketplace-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        deliveryAddress: state.deliveryAddress,
        orders: state.orders,
        bookings: state.bookings,
        labourBookings: state.labourBookings || [],
        landRequests: state.landRequests || [],
        myWorkerProfile: state.myWorkerProfile,
        myLandListings: state.myLandListings || [],
      }),
    }
  )
);
