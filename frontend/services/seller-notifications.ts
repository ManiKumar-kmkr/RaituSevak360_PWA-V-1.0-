import {
  SellerOrder,
  Quotation,
  SellerEquipmentBooking,
  SellerProduct,
  SellerVerificationStatus,
  SellerRegistrationResult,
  SellerNotification,
} from "../types/seller";

export interface SellerNotificationSourceState {
  orders?: SellerOrder[];
  quotations?: Quotation[];
  bookings?: SellerEquipmentBooking[];
  products?: SellerProduct[];
  verificationStatus?: SellerVerificationStatus;
  lastRegistrationResult?: SellerRegistrationResult | null;
  readNotificationIds?: string[];
}

/**
 * Derives dynamic Seller Notifications from existing Zustand store state.
 * Prevents duplicates by using deterministic stable IDs based on entity identity and status.
 */
export function deriveSellerNotifications(
  state: SellerNotificationSourceState
): SellerNotification[] {
  const {
    orders = [],
    quotations = [],
    bookings = [],
    products = [],
    verificationStatus = "pending_verification",
    lastRegistrationResult,
    readNotificationIds = [],
  } = state;

  const readSet = new Set(readNotificationIds);
  const list: SellerNotification[] = [];

  // 1. Orders Notifications (New Orders & Fulfillment updates)
  orders.forEach((o) => {
    // New incoming order notification
    list.push({
      id: `notif_order_new_${o.id}`,
      category: "order",
      title: `Order Received: #${o.id}`,
      message: `${o.customer} placed an order for ${o.items} (${o.amount}).`,
      time: o.date || "Today",
      isRead: readSet.has(`notif_order_new_${o.id}`),
      link: "/dashboard/orders",
      actionLabel: "View Order",
      priority: o.status === "Ready for Dispatch" ? "high" : "normal",
      entityId: o.id,
    });

    // If order has progressed in fulfillment lifecycle, create status update notification
    if (o.status && o.status !== "Ready for Dispatch") {
      const statusKey = o.status.replace(/\s+/g, "_");
      list.push({
        id: `notif_order_status_${o.id}_${statusKey}`,
        category: "order",
        title: `Order ${o.status}: #${o.id}`,
        message: `Order #${o.id} for ${o.customer} has been updated to "${o.status}".`,
        time: o.date || "Recent",
        isRead: readSet.has(`notif_order_status_${o.id}_${statusKey}`),
        link: "/dashboard/orders",
        actionLabel: "Track Fulfillment",
        priority: "normal",
        entityId: o.id,
      });
    }
  });

  // 2. Farmer Quotations (Accepted, Declined, Submitted)
  quotations.forEach((q) => {
    if (q.status === "accepted") {
      list.push({
        id: `notif_quote_${q.id}_accepted`,
        category: "quotation",
        title: `Quotation Accepted! (${q.crop})`,
        message: `${q.farmerName} accepted your quotation of ₹${q.totalAmount.toLocaleString("en-IN")} for ${q.quantity} ${q.unit}.`,
        time: "Confirmed",
        isRead: readSet.has(`notif_quote_${q.id}_accepted`),
        link: "/dashboard/seller/leads",
        actionLabel: "View Buy Lead",
        priority: "high",
        entityId: q.id,
      });
    } else if (q.status === "rejected" || q.status === "declined") {
      list.push({
        id: `notif_quote_${q.id}_rejected`,
        category: "quotation",
        title: `Quotation Declined: ${q.crop}`,
        message: `Your quotation of ₹${q.totalAmount.toLocaleString("en-IN")} for ${q.crop} was declined by ${q.farmerName}.`,
        time: "Updated",
        isRead: readSet.has(`notif_quote_${q.id}_rejected`),
        link: "/dashboard/seller/leads",
        actionLabel: "Review Leads",
        priority: "normal",
        entityId: q.id,
      });
    } else if (q.status === "submitted") {
      list.push({
        id: `notif_quote_${q.id}_submitted`,
        category: "quotation",
        title: `Quotation Under Review: ${q.crop}`,
        message: `Quote of ₹${q.totalAmount.toLocaleString("en-IN")} submitted to ${q.farmerName} (${q.expectedResponse || "Within 24-48 hours"}).`,
        time: "Awaiting response",
        isRead: readSet.has(`notif_quote_${q.id}_submitted`),
        link: "/dashboard/seller/leads",
        actionLabel: "View Quotations",
        priority: "normal",
        entityId: q.id,
      });
    }
  });

  // 3. Equipment Fleet Bookings
  bookings.forEach((b) => {
    if (b.status === "Pending") {
      list.push({
        id: `notif_booking_${b.id}_pending`,
        category: "equipment",
        title: `New Equipment Booking: #${b.id}`,
        message: `${b.customerName || "Farmer"} requested ${b.equipmentName} (${b.duration}) at ${b.location}.`,
        time: b.bookingDate || "Upcoming",
        isRead: readSet.has(`notif_booking_${b.id}_pending`),
        link: "/dashboard/seller/equipment",
        actionLabel: "Confirm Booking",
        priority: "high",
        entityId: b.id,
      });
    } else if (b.status === "Confirmed") {
      list.push({
        id: `notif_booking_${b.id}_confirmed`,
        category: "equipment",
        title: `Booking Confirmed: #${b.id}`,
        message: `Rental booking for ${b.equipmentName} (${b.customerName || "Customer"}) confirmed for ₹${b.totalAmount.toLocaleString("en-IN")}.`,
        time: b.bookingDate || "Confirmed",
        isRead: readSet.has(`notif_booking_${b.id}_confirmed`),
        link: "/dashboard/seller/equipment",
        actionLabel: "Fleet Schedule",
        priority: "normal",
        entityId: b.id,
      });
    } else if (b.status === "Active") {
      list.push({
        id: `notif_booking_${b.id}_active`,
        category: "equipment",
        title: `Machinery Dispatched: #${b.id}`,
        message: `${b.equipmentName} is currently operating in field service at ${b.location}.`,
        time: "Active now",
        isRead: readSet.has(`notif_booking_${b.id}_active`),
        link: "/dashboard/seller/equipment",
        actionLabel: "Track Equipment",
        priority: "normal",
        entityId: b.id,
      });
    } else if (b.status === "Completed") {
      list.push({
        id: `notif_booking_${b.id}_completed`,
        category: "equipment",
        title: `Rental Completed: #${b.id}`,
        message: `Booking #${b.id} for ${b.equipmentName} ended successfully. ₹${b.totalAmount.toLocaleString("en-IN")} credited.`,
        time: "Completed",
        isRead: readSet.has(`notif_booking_${b.id}_completed`),
        link: "/dashboard/seller/equipment",
        actionLabel: "Rental Ledger",
        priority: "normal",
        entityId: b.id,
      });
    }
  });

  // 4. Product Stock Warnings (Threshold: <= 15 items)
  products.forEach((p) => {
    if (p.stock === 0) {
      list.push({
        id: `notif_stock_out_${p.id}`,
        category: "product",
        title: `Out of Stock: ${p.name}`,
        message: `Stock is 0 ${p.unit}. Update inventory to resume receiving customer orders.`,
        time: "Inventory Alert",
        isRead: readSet.has(`notif_stock_out_${p.id}`),
        link: "/dashboard/seller/products",
        actionLabel: "Restock Now",
        priority: "high",
        entityId: p.id,
      });
    } else if (p.stock <= 15) {
      list.push({
        id: `notif_stock_low_${p.id}`,
        category: "product",
        title: `Low Stock Warning: ${p.name}`,
        message: `Only ${p.stock} ${p.unit} remaining for ${p.name} (low stock limit: 15).`,
        time: "Low Inventory",
        isRead: readSet.has(`notif_stock_low_${p.id}`),
        link: "/dashboard/seller/products",
        actionLabel: "Update Stock",
        priority: "normal",
        entityId: p.id,
      });
    }
  });

  // 5. Account / KYC Status
  if (verificationStatus === "pending_verification") {
    list.push({
      id: "notif_account_pending_verification",
      category: "account",
      title: "Seller KYC Under Review",
      message: `Application #${lastRegistrationResult?.registrationId || "RS360-VND-849201"} is under verification. Expected: 24-48 business hours.`,
      time: lastRegistrationResult?.submittedAt || "Under review",
      isRead: readSet.has("notif_account_pending_verification"),
      link: "/dashboard/seller/onboarding",
      actionLabel: "Track KYC",
      priority: "normal",
    });
  } else if (verificationStatus === "verified") {
    list.push({
      id: "notif_account_verified",
      category: "account",
      title: "Certified Vendor Badge Active",
      message: "Your seller profile and credentials have been approved. Verified Seller badge is active.",
      time: "Active",
      isRead: readSet.has("notif_account_verified"),
      link: "/dashboard/seller/onboarding",
      actionLabel: "View Credentials",
      priority: "normal",
    });
  }

  // Sort: Unread first, then high priority first, stable sort
  return list.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    if (a.priority !== b.priority) {
      return a.priority === "high" ? -1 : 1;
    }
    return 0;
  });
}

/**
 * Returns total count of unread seller notifications
 */
export function getSellerUnreadCount(notifications: SellerNotification[]): number {
  return notifications.filter((n) => !n.isRead).length;
}
