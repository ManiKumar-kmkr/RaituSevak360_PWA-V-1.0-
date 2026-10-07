import { labourService, SAMPLE_WORKERS } from "../services/labour";
import { landService, SAMPLE_LAND_PLOTS } from "../services/land";
import { useCartStore } from "../store/cart-store";
import { LabourBooking } from "../types/labour";
import { LandRentalRequest } from "../types/land";

describe("Farm Labour Service & Discovery Flow", () => {
  test("returns all sample verified workers", async () => {
    const workers = await labourService.getWorkers();
    expect(workers.length).toBe(SAMPLE_WORKERS.length);
    expect(workers.length).toBeGreaterThanOrEqual(6);
  });

  test("filters workers by work type", async () => {
    const harvestingWorkers = await labourService.getWorkers({
      workType: "harvesting",
    });
    expect(harvestingWorkers.length).toBeGreaterThan(0);
    harvestingWorkers.forEach((w) => {
      expect(w.workTypes).toContain("harvesting");
    });
  });

  test("filters workers by search query (case-insensitive)", async () => {
    const searchResults = await labourService.getWorkers({
      search: "TeNaLi",
    });
    expect(searchResults.length).toBeGreaterThan(0);
    searchResults.forEach((w) => {
      const match =
        w.location.toLowerCase().includes("tenali") ||
        w.name.toLowerCase().includes("tenali") ||
        w.specialization.toLowerCase().includes("tenali");
      expect(match).toBe(true);
    });
  });

  test("retrieves worker by ID", async () => {
    const worker = await labourService.getWorkerById("wrk-01");
    expect(worker).toBeDefined();
    expect(worker?.name).toContain("Anji Reddy");
    expect(worker?.dailyRate).toBe(500);
    expect(worker?.verified).toBe(true);
  });
});

describe("Farm Land Service & Rental Discovery Flow", () => {
  test("returns all sample verified agricultural land plots", async () => {
    const plots = await landService.getLandListings();
    expect(plots.length).toBe(SAMPLE_LAND_PLOTS.length);
    expect(plots.length).toBeGreaterThanOrEqual(6);
  });

  test("filters land listings by soil type", async () => {
    const blackCottonPlots = await landService.getLandListings({
      soilType: "black_cotton",
    });
    expect(blackCottonPlots.length).toBeGreaterThan(0);
    blackCottonPlots.forEach((p) => {
      expect(p.soilType).toBe("black_cotton");
    });
  });

  test("filters land by search query across crop suitability and location", async () => {
    const warangalPlots = await landService.getLandListings({
      search: "warangal",
    });
    expect(warangalPlots.length).toBeGreaterThan(0);
    warangalPlots.forEach((p) => {
      const match =
        p.location.toLowerCase().includes("warangal") ||
        p.district.toLowerCase().includes("warangal") ||
        p.title.toLowerCase().includes("warangal");
      expect(match).toBe(true);
    });
  });

  test("retrieves land plot by ID with irrigation and lease terms", async () => {
    const land = await landService.getLandById("lnd-01");
    expect(land).toBeDefined();
    expect(land?.acreage).toBe(5.5);
    expect(land?.pricePerAcrePerYear).toBe(32000);
    expect(land?.verifiedOwner).toBe(true);
  });
});

describe("Zustand Persistent State: Labour Bookings & Land Rental Requests", () => {
  beforeEach(() => {
    useCartStore.setState({
      labourBookings: [],
      landRequests: [],
    });
  });

  test("addLabourBooking persists booking to store with calculated total", () => {
    const mockBooking: LabourBooking = {
      id: "RS360-LAB-9999",
      workerId: "wrk-01",
      workerName: "Anji Reddy & Team",
      workerAvatar: "AR",
      workType: "Harvesting Crew",
      startDate: "2026-10-05",
      durationDays: 4,
      dailyRate: 500,
      totalAmount: 2000,
      farmLocation: "Survey 42, Tenali, Guntur",
      farmerName: "Ramesh Kumar Reddy",
      farmerPhone: "9876543210",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    useCartStore.getState().addLabourBooking(mockBooking);

    const storeState = useCartStore.getState();
    expect(storeState.labourBookings.length).toBe(1);
    expect(storeState.labourBookings[0].id).toBe("RS360-LAB-9999");
    expect(storeState.labourBookings[0].totalAmount).toBe(2000);

    const retrieved = storeState.getLabourBookingById("RS360-LAB-9999");
    expect(retrieved).toBeDefined();
    expect(retrieved?.workerName).toBe("Anji Reddy & Team");
  });

  test("addLandRequest persists rental request to store with submitted status", () => {
    const mockRequest: LandRentalRequest = {
      id: "RS360-LND-8888",
      landId: "lnd-01",
      landTitle: "Prime Black Cotton Soil Farmland",
      landLocation: "Tenali Rural, Guntur",
      acreage: 5.5,
      season: "Kharif 2026",
      startDate: "2026-10-10",
      duration: "1 Year",
      intendedCrop: "Paddy",
      farmerName: "Ramesh Kumar Reddy",
      farmerPhone: "9876543210",
      estimatedCost: 176000,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };

    useCartStore.getState().addLandRequest(mockRequest);

    const storeState = useCartStore.getState();
    expect(storeState.landRequests.length).toBe(1);
    expect(storeState.landRequests[0].id).toBe("RS360-LND-8888");
    expect(storeState.landRequests[0].status).toBe("submitted");
    expect(storeState.landRequests[0].estimatedCost).toBe(176000);

    const retrieved = storeState.getLandRequestById("RS360-LND-8888");
    expect(retrieved).toBeDefined();
    expect(retrieved?.landTitle).toBe("Prime Black Cotton Soil Farmland");
  });

  test("Provider side: setMyWorkerProfile, edit profile, and toggle availability/active", () => {
    const mockProfile = {
      id: "wrk-user-1234",
      name: "Ramesh Kumar Reddy",
      avatar: "RR",
      workTypes: ["harvesting" as const, "general" as const],
      specialization: "Harvesting & Farm Work Crew",
      skills: ["Sickle Harvesting", "Paddy Threshing"],
      experienceYears: 6,
      rating: 5.0,
      reviewCount: 1,
      dailyRate: 480,
      location: "Madikonda, Kazipet",
      mandal: "Kazipet",
      district: "Warangal",
      distanceKm: 0.5,
      availability: "available" as const,
      verificationStatus: "pending_verification" as const,
      isActive: true,
      languages: ["Telugu"],
      verified: false,
      bio: "Available for paddy harvest in Warangal cluster",
      completedJobs: 0,
      isMyProfile: true,
    };

    useCartStore.getState().setMyWorkerProfile(mockProfile);

    let state = useCartStore.getState();
    expect(state.myWorkerProfile).toBeDefined();
    expect(state.myWorkerProfile?.name).toBe("Ramesh Kumar Reddy");
    expect(state.myWorkerProfile?.isMyProfile).toBe(true);
    expect(state.myWorkerProfile?.availability).toBe("available");
    expect(state.myWorkerProfile?.verificationStatus).toBe("pending_verification");
    expect(state.myWorkerProfile?.isActive).toBe(true);

    // Edit profile - should update existing record without changing ID
    useCartStore.getState().updateMyWorkerProfile({
      dailyRate: 520,
      experienceYears: 7,
    });
    state = useCartStore.getState();
    expect(state.myWorkerProfile?.id).toBe("wrk-user-1234");
    expect(state.myWorkerProfile?.dailyRate).toBe(520);
    expect(state.myWorkerProfile?.experienceYears).toBe(7);

    // Toggle availability to busy
    useCartStore.getState().updateMyWorkerAvailability("busy");
    state = useCartStore.getState();
    expect(state.myWorkerProfile?.availability).toBe("busy");

    // Deactivate profile
    useCartStore.getState().toggleMyWorkerActive();
    state = useCartStore.getState();
    expect(state.myWorkerProfile?.isActive).toBe(false);

    // Reactivate profile
    useCartStore.getState().toggleMyWorkerActive();
    state = useCartStore.getState();
    expect(state.myWorkerProfile?.isActive).toBe(true);
  });

  test("Labour discovery connection: active profile appears, deactivated profile is hidden", async () => {
    const activeProfile = {
      id: "wrk-user-discovery-test",
      name: "Farmer Krishna Reddy",
      avatar: "KR",
      workTypes: ["harvesting" as const],
      specialization: "Paddy Harvesting Expert",
      skills: ["Sickle Harvesting"],
      experienceYears: 10,
      rating: 5.0,
      reviewCount: 0,
      dailyRate: 550,
      location: "Kazipet",
      mandal: "Kazipet",
      district: "Warangal",
      distanceKm: 0.8,
      availability: "available" as const,
      verificationStatus: "pending_verification" as const,
      isActive: true,
      languages: ["Telugu"],
      verified: false,
      bio: "Local expert harvest crew lead",
      completedJobs: 0,
      isMyProfile: true,
    };

    // Active profile must be discoverable at top of workers list
    const workersActive = await labourService.getWorkers({
      userProfile: activeProfile,
    });
    expect(workersActive.length).toBe(SAMPLE_WORKERS.length + 1);
    expect(workersActive[0].id).toBe("wrk-user-discovery-test");
    expect(workersActive[0].isMyProfile).toBe(true);

    // Deactivated profile must NOT appear in discovery
    const deactivatedProfile = {
      ...activeProfile,
      isActive: false,
    };
    const workersDeactivated = await labourService.getWorkers({
      userProfile: deactivatedProfile,
    });
    expect(workersDeactivated.length).toBe(SAMPLE_WORKERS.length);
    expect(workersDeactivated.find((w) => w.id === "wrk-user-discovery-test")).toBeUndefined();
  });

  test("Provider side: addMyLandListing, edit listing, and toggle active/availability", () => {
    const mockLand = {
      id: "lnd-user-5678",
      title: "Fertile Canal-Fed Farmland for Lease",
      location: "Madikonda, Kazipet",
      mandal: "Kazipet",
      district: "Warangal",
      state: "Telangana",
      acreage: 4.5,
      soilType: "black_cotton" as const,
      soilTypeName: "Black Cotton Soil",
      irrigation: "Borewell + Canal",
      suitableCrops: ["Paddy", "Cotton"],
      pricePerAcrePerYear: 30000,
      roadAccess: "Tractor Road",
      leaseTerms: "1 Year lease",
      waterSource: "Electric 3-phase pump",
      fenced: true,
      verifiedOwner: false,
      verificationStatus: "pending_verification" as const,
      isActive: true,
      ownerName: "Ramesh Kumar Reddy",
      availability: "available" as const,
      isMyListing: true,
    };

    useCartStore.getState().addMyLandListing(mockLand);

    let state = useCartStore.getState();
    expect(state.myLandListings.length).toBe(1);
    expect(state.myLandListings[0].id).toBe("lnd-user-5678");
    expect(state.myLandListings[0].isMyListing).toBe(true);
    expect(state.myLandListings[0].isActive).toBe(true);

    // Edit listing - updates same record without duplication
    useCartStore.getState().updateMyLandListing({
      ...mockLand,
      pricePerAcrePerYear: 35000,
      acreage: 5.0,
    });
    state = useCartStore.getState();
    expect(state.myLandListings.length).toBe(1);
    expect(state.myLandListings[0].pricePerAcrePerYear).toBe(35000);
    expect(state.myLandListings[0].acreage).toBe(5.0);

    // Update availability
    useCartStore.getState().updateMyLandListingAvailability("lnd-user-5678", "reserved");
    state = useCartStore.getState();
    expect(state.myLandListings[0].availability).toBe("reserved");

    // Deactivate listing
    useCartStore.getState().toggleMyLandListingActive("lnd-user-5678");
    state = useCartStore.getState();
    expect(state.myLandListings[0].isActive).toBe(false);

    // Reactivate listing
    useCartStore.getState().toggleMyLandListingActive("lnd-user-5678");
    state = useCartStore.getState();
    expect(state.myLandListings[0].isActive).toBe(true);

    // Remove listing
    useCartStore.getState().removeMyLandListing("lnd-user-5678");
    state = useCartStore.getState();
    expect(state.myLandListings.length).toBe(0);
  });

  test("Land discovery connection: active user listing appears, deactivated listing is hidden", async () => {
    const activeLandListing = {
      id: "lnd-user-discovery-test",
      title: "Special Alluvial Soil Plot for Paddy",
      location: "Kazipet Rural",
      mandal: "Kazipet",
      district: "Warangal",
      state: "Telangana",
      acreage: 6.0,
      soilType: "alluvial" as const,
      soilTypeName: "Alluvial Soil",
      irrigation: "Canal Water Rights",
      suitableCrops: ["Paddy", "Sugarcane"],
      pricePerAcrePerYear: 36000,
      roadAccess: "Paved Road",
      leaseTerms: "1 Year",
      waterSource: "Canal Feeder",
      fenced: true,
      verifiedOwner: false,
      verificationStatus: "pending_verification" as const,
      isActive: true,
      ownerName: "Farmer Krishna Reddy",
      availability: "available" as const,
      isMyListing: true,
    };

    // Active listing must appear at the top of rental discovery
    const listingsActive = await landService.getLandListings({
      userListings: [activeLandListing],
    });
    expect(listingsActive.length).toBe(SAMPLE_LAND_PLOTS.length + 1);
    expect(listingsActive[0].id).toBe("lnd-user-discovery-test");
    expect(listingsActive[0].isMyListing).toBe(true);

    // Deactivated listing must NOT appear in rental discovery
    const deactivatedLandListing = {
      ...activeLandListing,
      isActive: false,
    };
    const listingsDeactivated = await landService.getLandListings({
      userListings: [deactivatedLandListing],
    });
    expect(listingsDeactivated.length).toBe(SAMPLE_LAND_PLOTS.length);
    expect(listingsDeactivated.find((l) => l.id === "lnd-user-discovery-test")).toBeUndefined();
  });
});
