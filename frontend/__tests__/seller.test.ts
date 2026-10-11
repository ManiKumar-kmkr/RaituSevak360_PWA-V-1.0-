import sellerService, {
  INITIAL_SELLER_PRODUCTS,
  INITIAL_BUY_LEADS,
  INITIAL_SELLER_EQUIPMENT,
} from "../services/seller";
import { useSellerStore } from "../store/seller-store";

describe("Seller Module - Service & Store", () => {
  beforeEach(() => {
    // Reset store before each test
    useSellerStore.getState().resetOnboarding();
  });

  describe("Seller Onboarding & KYC", () => {
    it("should update onboarding step data correctly", () => {
      useSellerStore.getState().updateOnboardingStep({
        businessName: "Kisan Agro Store",
        ownerName: "Mani Kumar",
        mobile: "9849012345",
      });

      const data = useSellerStore.getState().onboardingData;
      expect(data.businessName).toBe("Kisan Agro Store");
      expect(data.ownerName).toBe("Mani Kumar");
      expect(data.mobile).toBe("9849012345");
    });

    it("should complete registration and generate a verification ID", () => {
      useSellerStore.getState().updateOnboardingStep({
        businessName: "Reddy Fertilizers",
        ownerName: "Reddy",
      });

      const res = useSellerStore.getState().completeRegistration();
      expect(res.registrationId).toMatch(/^RS360-VND-\d{6}$/);
      expect(useSellerStore.getState().verificationStatus).toBe("pending_verification");
    });
  });

  describe("Seller Product Management", () => {
    it("should add a new product to store", () => {
      const initialCount = useSellerStore.getState().products.length;
      const newProd = useSellerStore.getState().addProduct({
        name: "Bio Potassium Mobilizing Bacteria",
        category: "Fertilizers",
        subCategory: "Bio-Fertilizer",
        price: 450,
        unit: "kg pack",
        moq: 2,
        stock: 50,
        location: "Warangal, Telangana",
        description: "Enriches soil microbial count and fixes potash.",
        tags: ["Bio-Tech", "Organic"],
        isAvailableForDelivery: true,
        status: "active",
        imageUrl: "https://example.com/bio-potash.jpg",
      });

      expect(newProd.id).toMatch(/^PROD-\d{3}$/);
      expect(useSellerStore.getState().products.length).toBe(initialCount + 1);
    });

    it("should update product stock without going below zero", () => {
      const prod = useSellerStore.getState().products[0];
      useSellerStore.getState().updateStock(prod.id, 99);
      expect(useSellerStore.getState().products.find((p) => p.id === prod.id)?.stock).toBe(99);

      // Attempt negative stock
      useSellerStore.getState().updateStock(prod.id, -10);
      expect(useSellerStore.getState().products.find((p) => p.id === prod.id)?.stock).toBe(99);
    });

    it("should toggle product active/inactive visibility", () => {
      const prod = useSellerStore.getState().products[0];
      const initialStatus = prod.status;

      useSellerStore.getState().toggleProductStatus(prod.id);
      expect(useSellerStore.getState().products.find((p) => p.id === prod.id)?.status).toBe(
        initialStatus === "active" ? "inactive" : "active"
      );

      useSellerStore.getState().toggleProductStatus(prod.id);
      expect(useSellerStore.getState().products.find((p) => p.id === prod.id)?.status).toBe(
        initialStatus
      );
    });

    it("should delete product on confirmation", () => {
      const prod = useSellerStore.getState().products[0];
      const initialCount = useSellerStore.getState().products.length;

      useSellerStore.getState().deleteProduct(prod.id);
      expect(useSellerStore.getState().products.length).toBe(initialCount - 1);
      expect(useSellerStore.getState().products.find((p) => p.id === prod.id)).toBeUndefined();
    });
  });

  describe("Buy Leads & Quotations", () => {
    it("should filter leads by category", async () => {
      const grains = await sellerService.getBuyLeads("Grains");
      expect(grains.length).toBeGreaterThan(0);
      expect(grains.every((l) => l.category === "Grains")).toBe(true);
    });

    it("should send a commercial quotation dynamically calculated", () => {
      const initialQuotes = useSellerStore.getState().quotations.length;
      const quote = useSellerStore.getState().addQuotation({
        leadId: "LEAD-401",
        farmerName: "Ramesh Reddy",
        crop: "Paddy (BPT 5204)",
        quantity: 120,
        unit: "Quintals",
        offeredPrice: 2350,
        totalAmount: 120 * 2350,
        deliveryOption: "Farmer Pickup",
        availableFrom: "2026-10-09",
        validity: "7 Days",
      });

      expect(quote.id).toMatch(/^QUOT-\d{4}$/);
      expect(quote.totalAmount).toBe(282000);
      expect(useSellerStore.getState().quotations.length).toBe(initialQuotes + 1);
    });
  });

  describe("Equipment Rental", () => {
    it("should retrieve equipment list and filter by category", async () => {
      const tractors = await sellerService.getEquipmentList("Tractors");
      expect(tractors.length).toBeGreaterThan(0);
      expect(tractors.every((t) => t.category === "Tractors")).toBe(true);
    });

    it("should record equipment booking and calculate rental fees", () => {
      const initialBookings = useSellerStore.getState().bookings.length;
      const booking = useSellerStore.getState().addEquipmentBooking({
        equipmentId: "EQ-801",
        equipmentName: "Mahindra 575 DI XP Plus Tractor (47 HP)",
        equipmentCategory: "Tractors",
        bookingDate: "2026-10-08",
        startTime: "08:00 AM",
        duration: "4 Hours",
        rentalAmount: 2600,
        depositFee: 2000,
        totalAmount: 4600,
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        contactPhone: "+91 98490 12345",
        location: "Warangal",
      });

      expect(booking.id).toMatch(/^BK-\d{4}$/);
      expect(booking.status).toBe("Confirmed");
      expect(useSellerStore.getState().bookings.length).toBe(initialBookings + 1);
    });
  });

  describe("Seller Localization & Settings Verification", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getTranslation } = require("../lib/i18n");

    it("should resolve nav.settings to Settings without raw key in English", () => {
      const enSettings = getTranslation("en", "nav.settings");
      expect(enSettings).toBe("Settings");
      expect(enSettings).not.toBe("nav.settings");

      const teSettings = getTranslation("te", "nav.settings");
      expect(teSettings).toBe("సెట్టింగ్‌లు");

      const hiSettings = getTranslation("hi", "nav.settings");
      expect(hiSettings).toBe("सेटिंग्स");
    });

    it("should resolve seller onboarding buttons purely per language without mixed strings", () => {
      // English: 100% pure English
      const enContinue = getTranslation("en", "seller.onboarding.continue");
      expect(enContinue).toBe("Continue");
      expect(enContinue).not.toContain("आगे बढ़ें");

      const enSubmit = getTranslation("en", "seller.onboarding.submitVerification");
      expect(enSubmit).toBe("Submit Verification");
      expect(enSubmit).not.toContain("सत्यापन");

      const enComplete = getTranslation("en", "seller.onboarding.completeRegistration");
      expect(enComplete).toBe("Complete Registration");
      expect(enComplete).not.toContain("पंजीकरण");

      // Telugu
      expect(getTranslation("te", "seller.onboarding.continue")).toBe("కొనసాగించండి");
      expect(getTranslation("te", "seller.onboarding.submitVerification")).toBe("ధృవీకరణ సమర్పించండి");
      expect(getTranslation("te", "seller.onboarding.completeRegistration")).toBe("నమోదు పూర్తి చేయండి");

      // Hindi
      expect(getTranslation("hi", "seller.onboarding.continue")).toBe("आगे बढ़ें");
      expect(getTranslation("hi", "seller.onboarding.submitVerification")).toBe("सत्यापन करें");
      expect(getTranslation("hi", "seller.onboarding.completeRegistration")).toBe("पंजीकरण पूरा करें");
    });

    it("should resolve seller settings translations properly", () => {
      expect(getTranslation("en", "seller.settings.title")).toBe("Seller & Store Settings");
      expect(getTranslation("te", "seller.settings.title")).toBe("విక్రేత & స్టోర్ సెట్టింగ్‌లు");
      expect(getTranslation("hi", "seller.settings.title")).toBe("विक्रेता और स्टोर सेटिंग्स");
    });

    it("should preserve backwards compatibility for seller.onboarding string resolution", () => {
      expect(getTranslation("en", "seller.onboarding")).toBe("Business Verification");
      expect(getTranslation("te", "seller.onboarding")).toBe("వ్యాపార ధృవీకరణ");
      expect(getTranslation("hi", "seller.onboarding")).toBe("व्यवसाय सत्यापन");
    });
  });
});
