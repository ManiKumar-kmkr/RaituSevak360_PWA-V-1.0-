import { useNgoStore, INITIAL_DEMO_NGOS } from "../store/ngo-store";
import en from "../locales/en.json";
import te from "../locales/te.json";
import hi from "../locales/hi.json";

describe("Government NGO Directory & Registration Review Suite", () => {
  beforeEach(() => {
    useNgoStore.getState().resetOrganizations();
  });

  describe("Demo Dataset Integrity & Privacy Safeguards", () => {
    test("loads initial demo NGOs with required fields and privacy safeguards", () => {
      const { organizations } = useNgoStore.getState();
      expect(organizations.length).toBeGreaterThanOrEqual(5);

      // Check representation of multiple verification statuses
      expect(organizations.some((o) => o.status === "verified")).toBe(true);
      expect(organizations.some((o) => o.status === "under_review")).toBe(true);
      expect(organizations.some((o) => o.status === "submitted")).toBe(true);
      expect(organizations.some((o) => o.status === "clarification_required")).toBe(true);
      expect(organizations.some((o) => o.status === "rejected")).toBe(true);

      organizations.forEach((org) => {
        // ID format check
        expect(org.id).toMatch(/^NGO-AP-2026-/);
        expect(org.name).toBeTruthy();
        expect(org.organizationType).toBeTruthy();
        expect(org.district).toBeTruthy();
        expect(org.registrationRef).toBeTruthy();
        expect(org.submissionDate).toBeTruthy();

        // Privacy and mock verification check (never real raw Aadhaar or private banking numbers)
        expect(org.representativeName).toContain("Demo");
        expect(org.officialEmail).toContain("demo");
        expect(org.officialPhone).toMatch(/^\+91/);

        // Document references check (3 documents per NGO)
        expect(org.documents.length).toBeGreaterThanOrEqual(3);
        org.documents.forEach((doc) => {
          expect(doc.id).toBeTruthy();
          expect(doc.name).toBeTruthy();
          expect(doc.referenceId).toBeTruthy();
          expect(doc.status).toBeTruthy();
        });

        // Timeline events check
        expect(org.timeline.length).toBeGreaterThan(0);
        org.timeline.forEach((event) => {
          expect(event.title).toBeTruthy();
          expect(event.date).toBeTruthy();
          expect(event.actor).toBeTruthy();
        });
      });
    });
  });

  describe("Review Workflow State Transitions", () => {
    test("marks a submitted or clarification_required organization as under review", () => {
      const target = useNgoStore
        .getState()
        .organizations.find((o) => o.status === "submitted");
      expect(target).toBeDefined();

      if (target) {
        useNgoStore
          .getState()
          .markUnderReview(target.id, "Audit desk assigned for accreditation inspection.", "Secretariat Reviewer");

        const updated = useNgoStore
          .getState()
          .organizations.find((o) => o.id === target.id);

        expect(updated?.status).toBe("under_review");
        expect(updated?.timeline.some((e) => e.title === "Marked Under Review")).toBe(true);
      }
    });

    test("requests clarification with mandatory reason and appends timeline event", () => {
      const target = useNgoStore
        .getState()
        .organizations.find((o) => o.status === "under_review");
      expect(target).toBeDefined();

      if (target) {
        const reason = "Audited balance sheet copy missing certified chartered accountant seal.";
        useNgoStore.getState().requestClarification(target.id, reason, "Senior Verification Officer");

        const updated = useNgoStore
          .getState()
          .organizations.find((o) => o.id === target.id);

        expect(updated?.status).toBe("clarification_required");
        expect(updated?.clarificationReason).toBe(reason);
        const lastTimeline = updated?.timeline[updated.timeline.length - 1];
        expect(lastTimeline?.title).toBe("Clarification Requested");
        expect(lastTimeline?.note).toBe(reason);
      }
    });

    test("verifies an organization with confirmation and notes", () => {
      const target = useNgoStore
        .getState()
        .organizations.find((o) => o.status === "under_review" || o.status === "submitted");
      expect(target).toBeDefined();

      if (target) {
        const note = "Statutory DARPAN unique ID and governing resolution verified against state records.";
        useNgoStore.getState().verifyOrganization(target.id, note, "District Agriculture Officer");

        const updated = useNgoStore
          .getState()
          .organizations.find((o) => o.id === target.id);

        expect(updated?.status).toBe("verified");
        expect(updated?.verifiedDate).toBeTruthy();
        expect(updated?.reviewerNotes).toBe(note);
        expect(updated?.documents.every((d) => d.status === "verified")).toBe(true);

        const lastTimeline = updated?.timeline[updated.timeline.length - 1];
        expect(lastTimeline?.title).toBe("Organization Verified");
      }
    });

    test("rejects an organization registration with non-empty reason", () => {
      const target = useNgoStore
        .getState()
        .organizations.find((o) => o.status === "submitted" || o.status === "under_review");
      expect(target).toBeDefined();

      if (target) {
        const reason = "Statutory societies registration invalid due to failure in annual return filings.";
        useNgoStore.getState().rejectOrganization(target.id, reason, "District Agriculture Officer");

        const updated = useNgoStore
          .getState()
          .organizations.find((o) => o.id === target.id);

        expect(updated?.status).toBe("rejected");
        expect(updated?.rejectedDate).toBeTruthy();
        expect(updated?.rejectionReason).toBe(reason);
        expect(updated?.documents.every((d) => d.status === "rejected")).toBe(true);

        const lastTimeline = updated?.timeline[updated.timeline.length - 1];
        expect(lastTimeline?.title).toBe("Registration Rejected");
        expect(lastTimeline?.note).toBe(reason);
      }
    });

    test("resets organizations back to baseline demo records", () => {
      useNgoStore.getState().verifyOrganization("NGO-AP-2026-002", "Verified during test", "Tester");
      expect(useNgoStore.getState().organizations.find((o) => o.id === "NGO-AP-2026-002")?.status).toBe("verified");

      useNgoStore.getState().resetOrganizations();
      expect(useNgoStore.getState().organizations.find((o) => o.id === "NGO-AP-2026-002")?.status).toBe("under_review");
    });
  });

  describe("Filtering and Search Logic", () => {
    test("filters organizations by organization type", () => {
      const { organizations } = useNgoStore.getState();
      const type = "Farmer Welfare Organization";
      const filtered = organizations.filter((o) => o.organizationType === type);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((o) => {
        expect(o.organizationType).toBe(type);
      });
    });

    test("filters organizations by district", () => {
      const { organizations } = useNgoStore.getState();
      const district = "Guntur";
      const filtered = organizations.filter((o) => o.district === district);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((o) => {
        expect(o.district).toBe(district);
      });
    });

    test("filters organizations by verification status", () => {
      const { organizations } = useNgoStore.getState();
      const verified = organizations.filter((o) => o.status === "verified");
      expect(verified.length).toBeGreaterThan(0);
      verified.forEach((o) => {
        expect(o.status).toBe("verified");
      });
    });

    test("searches by organization name, ID, or registration number", () => {
      const { organizations } = useNgoStore.getState();

      // By name keyword
      const byName = organizations.filter((o) =>
        o.name.toLowerCase().includes("krishi")
      );
      expect(byName.length).toBe(1);
      expect(byName[0].id).toBe("NGO-AP-2026-001");

      // By reference ID
      const byId = organizations.filter((o) =>
        o.id.toLowerCase().includes("ngo-ap-2026-003")
      );
      expect(byId.length).toBe(1);
      expect(byId[0].district).toBe("Kurnool");

      // By registration reference
      const byReg = organizations.filter((o) =>
        o.registrationRef.toLowerCase().includes("04812")
      );
      expect(byReg.length).toBe(1);
      expect(byReg[0].id).toBe("NGO-AP-2026-001");
    });
  });

  describe("Localization Parity across Languages", () => {
    test("verifies identical key structures across en, te, and hi for govtNgos", () => {
      const enKeys = Object.keys(en.govtNgos).sort();
      const teKeys = Object.keys(te.govtNgos).sort();
      const hiKeys = Object.keys(hi.govtNgos).sort();

      expect(enKeys.length).toBeGreaterThan(30);
      expect(teKeys).toEqual(enKeys);
      expect(hiKeys).toEqual(enKeys);

      // Verify essential keys
      expect(enKeys).toContain("directoryTitle");
      expect(enKeys).toContain("subtitle");
      expect(enKeys).toContain("quickServiceDesc");
      expect(enKeys).toContain("demoDisclaimer");
      expect(enKeys).toContain("totalOrganizations");
      expect(enKeys).toContain("registered");
      expect(enKeys).toContain("pendingReview");
      expect(enKeys).toContain("clarificationRequired");
      expect(enKeys).toContain("rejected");
      expect(enKeys).toContain("searchPlaceholder");
      expect(enKeys).toContain("clearFilters");
      expect(enKeys).toContain("backToDashboard");
      expect(enKeys).toContain("backToDirectory");
      expect(enKeys).toContain("markUnderReview");
      expect(enKeys).toContain("requestClarification");
      expect(enKeys).toContain("verifyOrganization");
      expect(enKeys).toContain("rejectRegistration");
      expect(enKeys).toContain("confirmVerificationTitle");
      expect(enKeys).toContain("rejectionModalTitle");
    });
  });
});
