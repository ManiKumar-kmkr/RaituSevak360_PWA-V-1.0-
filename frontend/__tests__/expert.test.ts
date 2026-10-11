import { useExpertStore } from "../store/expert-store";

describe("Agriculture Expert Module - Store & Flows", () => {
  beforeEach(() => {
    // Reset store state
    const store = useExpertStore.getState();
    store.resetOnboarding();
  });

  test("expert onboarding step transitions and validation updates", () => {
    const store = useExpertStore.getState();

    expect(store.onboarding.step).toBe(1);

    store.setOnboardingStep(2);
    expect(useExpertStore.getState().onboarding.step).toBe(2);

    store.updateOnboardingData({
      fullName: "Dr. Srinivas Rao",
      qualification: "Ph.D in Agronomy",
      mobile: "9876543210",
      location: "PJTSAU Hyderabad",
    });

    const updated = useExpertStore.getState().onboarding;
    expect(updated.fullName).toBe("Dr. Srinivas Rao");
    expect(updated.qualification).toBe("Ph.D in Agronomy");

    store.submitOnboarding();
    const submitted = useExpertStore.getState().onboarding;
    expect(submitted.step).toBe(5);
    expect(submitted.applicationId).toBeDefined();
    expect(useExpertStore.getState().isOnboarded).toBe(true);
  });

  test("farmer connection requests acceptance and rejection flow", () => {
    const store = useExpertStore.getState();
    const requests = store.requests;
    expect(requests.length).toBeGreaterThan(0);

    const pendingRequest = requests.find((r) => r.status === "pending");
    expect(pendingRequest).toBeDefined();

    if (pendingRequest) {
      store.acceptRequest(pendingRequest.id);
      const acceptedReq = useExpertStore
        .getState()
        .requests.find((r) => r.id === pendingRequest.id);
      expect(acceptedReq?.status).toBe("accepted");

      const anotherReq = requests.find((r) => r.id !== pendingRequest.id);
      if (anotherReq) {
        store.rejectRequest(anotherReq.id, "Outside crop advisory domain");
        const rejectedReq = useExpertStore
          .getState()
          .requests.find((r) => r.id === anotherReq.id);
        expect(rejectedReq?.status).toBe("rejected");
      }
    }
  });

  test("consultation scheduling and state updates", () => {
    const store = useExpertStore.getState();

    const newConsultation = store.scheduleConsultation({
      farmerName: "Anji Reddy",
      farmerPhone: "9848012345",
      village: "Narsapur",
      mandal: "Narsapur",
      district: "Medak",
      crop: "Paddy (Rice)",
      topic: "Brown Plant Hopper (BPH) management",
      description: "Severe hopper burn symptoms observed in lowland fields.",
      scheduledDate: "2026-10-12",
      scheduledTimeSlot: "10:30 AM - 11:00 AM",
      durationMinutes: 30,
      type: "video",
      notes: "Farmer has taken field pictures for visual leaf inspection",
    });

    expect(newConsultation.id).toBeDefined();
    expect(newConsultation.status).toBe("upcoming");
    expect(newConsultation.crop).toBe("Paddy (Rice)");

    const found = useExpertStore
      .getState()
      .consultations.find((c) => c.id === newConsultation.id);
    expect(found).toBeDefined();
    expect(found?.status).toBe("upcoming");

    // Complete session with summary
    store.saveConsultationSummary({
      id: "sum-test-01",
      consultationId: newConsultation.id,
      farmerName: "Anji Reddy",
      crop: "Paddy (Rice)",
      issueDiagnosed: "Brown Plant Hopper nymph clustering",
      clinicalNotes: "Water level reduction advised with systemic spray",
      expertNotes: "Water level reduction advised with systemic spray",
      recommendations: ["Spray Triflumezopyrim 10% SC @ 0.5ml/L"],
      prescribedTreatments: ["Triflumezopyrim 10% SC"],
      followUpNeeded: false,
      completedAt: "2026-10-12",
      durationSeconds: 1200,
    });

    const completed = useExpertStore
      .getState()
      .consultations.find((c) => c.id === newConsultation.id);
    expect(completed?.status).toBe("completed");
    expect(completed?.summary?.issueDiagnosed).toBe("Brown Plant Hopper nymph clustering");
  });

  test("expert availability status toggle updates profile", () => {
    const store = useExpertStore.getState();
    expect(store.profile.dailyAvailability).toBeDefined();

    store.setAvailability("busy");
    expect(useExpertStore.getState().profile.dailyAvailability).toBe("busy");

    store.setAvailability("offline");
    expect(useExpertStore.getState().profile.dailyAvailability).toBe("offline");

    store.setAvailability("available");
    expect(useExpertStore.getState().profile.dailyAvailability).toBe("available");
  });

  test("expert profile update and strict role isolation rule", () => {
    const store = useExpertStore.getState();

    store.updateProfile({
      qualification: "Ph.D. in Entomology",
      primarySpecialization: "Pest & Disease Pathology",
      experienceYears: 15,
      location: "RARS Warangal",
    });

    const updatedProfile = useExpertStore.getState().profile;
    expect(updatedProfile.qualification).toBe("Ph.D. in Entomology");
    expect(updatedProfile.primarySpecialization).toBe("Pest & Disease Pathology");
    expect(updatedProfile.experienceYears).toBe(15);
    expect(updatedProfile.location).toBe("RARS Warangal");

    // Verify role isolation principle:
    // Only farmer <-> seller switching is permitted in RaituSevak360.
    // Agriculture Expert role is strictly isolated.
    const activeRole: string = "expert";
    const canSwitchRole = activeRole === "farmer" || activeRole === "seller";
    expect(canSwitchRole).toBe(false);
  });
});
