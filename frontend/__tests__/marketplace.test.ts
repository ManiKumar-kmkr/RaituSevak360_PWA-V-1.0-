import marketplaceService, {
  SAMPLE_PRODUCTS,
  SAMPLE_EQUIPMENT,
} from "../services/marketplace";

describe("Marketplace Service Tests", () => {
  test("SAMPLE_PRODUCTS has valid products with required Figma fields", () => {
    expect(SAMPLE_PRODUCTS.length).toBeGreaterThanOrEqual(8);
    for (const p of SAMPLE_PRODUCTS) {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.price).toBeGreaterThan(0);
      expect(p.unit).toBeDefined();
      expect(p.rating).toBeGreaterThan(0);
      expect(p.reviewCount).toBeGreaterThan(0);
      expect(p.stock).toBeGreaterThan(0);
      expect(p.seller).toBeDefined();
      expect(p.description).toBeDefined();
      expect(Object.keys(p.specifications).length).toBeGreaterThan(0);
    }
  });

  test("Figma products are present", () => {
    const names = SAMPLE_PRODUCTS.map((p) => p.name);
    expect(names).toContain("Hybrid Rice Seeds (IR-64)");
    expect(names).toContain("Organic NPK Fertilizer (Granular)");
    expect(names).toContain("Crop Sprayer Pump (16L Battery Powered)");
    expect(names).toContain("Premium Harvesting Tool & Pruner Set");
    // Existing products preserved
    expect(names).toContain("BPH Resistant Paddy Seeds (BPT 5204)");
    expect(names).toContain("Organic Vermicompost Soil Conditioner");
    expect(names).toContain("Mahindra 575 DI Tractor (Day Rental)");
  });

  test("Search functionality is case-insensitive and matches queries correctly", async () => {
    const riceResults = await marketplaceService.getProducts("all", "rice");
    expect(riceResults.length).toBeGreaterThanOrEqual(2);
    expect(riceResults.some((p) => p.name.includes("Rice"))).toBe(true);

    const fertResults = await marketplaceService.getProducts("all", "fertilizer");
    expect(fertResults.length).toBeGreaterThanOrEqual(1);

    const seedResults = await marketplaceService.getProducts("all", "seeds");
    expect(seedResults.length).toBeGreaterThanOrEqual(2);

    const emptyResults = await marketplaceService.getProducts("all", "xyznonexistentproduct");
    expect(emptyResults.length).toBe(0);
  });

  test("Category filtering works correctly", async () => {
    const seedsOnly = await marketplaceService.getProducts("seeds");
    expect(seedsOnly.every((p) => p.category === "seeds")).toBe(true);
    expect(seedsOnly.length).toBeGreaterThanOrEqual(2);

    const fertilizerOnly = await marketplaceService.getProducts("fertilizer");
    expect(fertilizerOnly.every((p) => p.category === "fertilizer")).toBe(true);
    expect(fertilizerOnly.length).toBeGreaterThanOrEqual(2);

    const toolsOnly = await marketplaceService.getProducts("tools");
    expect(toolsOnly.every((p) => p.category === "tools")).toBe(true);
    expect(toolsOnly.length).toBeGreaterThanOrEqual(2);
  });

  test("Combined search and category filtering works", async () => {
    const seedSearch = await marketplaceService.getProducts("seeds", "IR-64");
    expect(seedSearch.length).toBe(1);
    expect(seedSearch[0].name).toBe("Hybrid Rice Seeds (IR-64)");

    const fertSearch = await marketplaceService.getProducts("fertilizer", "IR-64");
    expect(fertSearch.length).toBe(0);
  });

  test("getProductById returns correct product or null", async () => {
    const prod1 = await marketplaceService.getProductById("prod_1");
    expect(prod1).not.toBeNull();
    expect(prod1?.name).toBe("Hybrid Rice Seeds (IR-64)");

    const notFound = await marketplaceService.getProductById("invalid_id_999");
    expect(notFound).toBeNull();
  });

  test("Equipment Service and Booking works", async () => {
    const equipment = await marketplaceService.getEquipment();
    expect(equipment.length).toBeGreaterThanOrEqual(5);

    const tractors = await marketplaceService.getEquipment("tractor");
    expect(tractors.every((e) => e.category === "tractor")).toBe(true);

    const booking = await marketplaceService.bookEquipment({
      equipmentId: "eq_1",
      equipmentName: "Mahindra 575 DI Tractor (45 HP)",
      startDate: "2026-10-04",
      durationDays: 2,
      totalEstimatedAmount: 3600,
      farmerName: "Ramesh Kumar",
      contactMobile: "9876543210",
      farmLocation: "Madikonda, Warangal",
    });

    expect(booking.id).toMatch(/^EQ-BOOK-\d+$/);
    expect(booking.status).toBe("confirmed");
    expect(booking.totalEstimatedAmount).toBe(3600);
  });

  test("Cart Store manages Orders and Bookings correctly", () => {
    const { useCartStore } = require("../store/cart-store");

    // Add item and place order
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem(SAMPLE_PRODUCTS[0], 2);
    expect(useCartStore.getState().getItemsCount()).toBe(2);

    const order = useCartStore.getState().placeOrder("upi", "UPI / QR Code");
    expect(order.id).toMatch(/^RS360-ORD-\d+$/);
    expect(order.items.length).toBe(1);
    expect(order.itemsTotal).toBe(SAMPLE_PRODUCTS[0].price * 2);
    expect(useCartStore.getState().getItemsCount()).toBe(0); // cart emptied

    const fetchedOrder = useCartStore.getState().getOrderById(order.id);
    expect(fetchedOrder).toBeDefined();
    expect(fetchedOrder?.id).toBe(order.id);
    expect(fetchedOrder?.totalAmount).toBe(order.totalAmount);

    // Add booking
    const bookingItem = {
      id: "EQ-BOOK-7788",
      equipmentId: "eq_1",
      equipmentName: "Mahindra 575 DI Tractor (45 HP)",
      startDate: "2026-10-05",
      durationDays: 3,
      totalEstimatedAmount: 5400,
      farmerName: "Ramesh Kumar",
      contactMobile: "9876543210",
      farmLocation: "Madikonda, Hanamkonda",
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    };

    useCartStore.getState().addBooking(bookingItem);
    const fetchedBooking = useCartStore.getState().getBookingById("EQ-BOOK-7788");
    expect(fetchedBooking).toBeDefined();
    expect(fetchedBooking?.equipmentName).toBe("Mahindra 575 DI Tractor (45 HP)");
    expect(fetchedBooking?.durationDays).toBe(3);
    expect(fetchedBooking?.totalEstimatedAmount).toBe(5400);
  });
});
