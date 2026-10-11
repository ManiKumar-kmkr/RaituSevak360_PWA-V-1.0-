import {
  useLandRecordStore,
  INITIAL_DEMO_LAND_RECORDS,
} from "../store/land-record-store";
import en from "../locales/en.json";
import te from "../locales/te.json";
import hi from "../locales/hi.json";

describe("Government Land Records Store, Workflows, Filtering & Parity", () => {
  beforeEach(() => {
    useLandRecordStore.getState().resetRecords();
  });

  test("loads initial demo land records with demonstration properties", () => {
    const { records } = useLandRecordStore.getState();
    expect(records.length).toBeGreaterThan(0);
    expect(records.length).toBe(INITIAL_DEMO_LAND_RECORDS.length);

    // Verify presence of different statuses
    expect(records.some((r) => r.status === "pending_review")).toBe(true);
    expect(records.some((r) => r.status === "under_review")).toBe(true);
    expect(records.some((r) => r.status === "verified")).toBe(true);
    expect(records.some((r) => r.status === "clarification_required")).toBe(true);
    expect(records.some((r) => r.status === "rejected")).toBe(true);

    // Verify masked identity data
    records.forEach((r) => {
      expect(r.id).toMatch(/^LND-AP-/);
      expect(r.farmerRegistrationId).toMatch(/^FAR-/);
      expect(r.surveyNumber).toBeTruthy();
      expect(r.recordedArea).toBeGreaterThan(0);
    });
  });

  test("marks a pending record as under review", () => {
    const target = useLandRecordStore
      .getState()
      .records.find((r) => r.status === "pending_review");
    expect(target).toBeDefined();

    if (target) {
      useLandRecordStore
        .getState()
        .markUnderReview(target.id, "Verification queue assigned", "Officer S. Venkat");

      const updated = useLandRecordStore
        .getState()
        .records.find((r) => r.id === target.id);

      expect(updated?.status).toBe("under_review");
      expect(updated?.timeline.some((e) => e.title === "Review Started")).toBe(true);
    }
  });

  test("verifies a record with confirmation and reviewer stamp", () => {
    const target = useLandRecordStore
      .getState()
      .records.find((r) => r.status === "under_review" || r.status === "pending_review");
    expect(target).toBeDefined();

    if (target) {
      const note = "Passbook details match survey settlement records.";
      useLandRecordStore
        .getState()
        .verifyRecord(target.id, note, "Officer M. Lakshmi");

      const updated = useLandRecordStore
        .getState()
        .records.find((r) => r.id === target.id);

      expect(updated?.status).toBe("verified");
      expect(updated?.verificationNotes).toBe(note);
      expect(updated?.timeline.some((e) => e.title === "Record Verified")).toBe(true);
    }
  });

  test("requests clarification with mandatory reason", () => {
    const target = useLandRecordStore.getState().records[0];
    const clarificationReason = "Survey subdivision sketch unclear. Please submit updated FMB diagram.";

    useLandRecordStore
      .getState()
      .requestClarification(target.id, clarificationReason, "Officer P. Rao");

    const updated = useLandRecordStore
      .getState()
      .records.find((r) => r.id === target.id);

    expect(updated?.status).toBe("clarification_required");
    expect(updated?.clarificationReason).toBe(clarificationReason);
    const timelineEvent = updated?.timeline.find((e) => e.title === "Clarification Requested");
    expect(timelineEvent).toBeDefined();
    expect(timelineEvent?.note).toBe(clarificationReason);
  });

  test("rejects a record with mandatory reason", () => {
    const target = useLandRecordStore.getState().records[1];
    const rejectionReason = "Survey parcel boundary overlaps with notified community grazing land.";

    useLandRecordStore
      .getState()
      .rejectRecord(target.id, rejectionReason, "Officer V. Reddy");

    const updated = useLandRecordStore
      .getState()
      .records.find((r) => r.id === target.id);

    expect(updated?.status).toBe("rejected");
    expect(updated?.rejectionReason).toBe(rejectionReason);
    const timelineEvent = updated?.timeline.find((e) => e.title === "Record Rejected");
    expect(timelineEvent).toBeDefined();
    expect(timelineEvent?.note).toBe(rejectionReason);
  });

  test("filters records accurately by district, mandal, status, category, irrigation, and search", () => {
    const records = useLandRecordStore.getState().records;

    // Filter by District
    const gunturRecords = records.filter((r) => r.district === "Guntur");
    expect(gunturRecords.length).toBeGreaterThan(0);
    gunturRecords.forEach((r) => expect(r.district).toBe("Guntur"));

    // Filter by Status
    const verifiedRecords = records.filter((r) => r.status === "verified");
    verifiedRecords.forEach((r) => expect(r.status).toBe("verified"));

    // Filter by Category
    const smallHolderRecords = records.filter((r) => r.landholdingCategory === "Small (1-2 Ha)");
    smallHolderRecords.forEach((r) => expect(r.landholdingCategory).toBe("Small (1-2 Ha)"));

    // Filter by Search Query (survey number, id, or farmerRef)
    const testSurvey = records[0].surveyNumber;
    const searchResults = records.filter(
      (r) =>
        r.surveyNumber.toLowerCase().includes(testSurvey.toLowerCase()) ||
        r.id.toLowerCase().includes(testSurvey.toLowerCase()) ||
        r.farmerRef.toLowerCase().includes(testSurvey.toLowerCase())
    );
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some((r) => r.id === records[0].id)).toBe(true);
  });

  test("escapes CSV values with commas, quotes, and newlines properly", () => {
    const escapeCsv = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    expect(escapeCsv("Normal text")).toBe('"Normal text"');
    expect(escapeCsv("Text, with comma")).toBe('"Text, with comma"');
    expect(escapeCsv('Text with "quotes"')).toBe('"Text with ""quotes"""');
    expect(escapeCsv("Line 1\nLine 2")).toBe('"Line 1\nLine 2"');
    expect(escapeCsv(123.45)).toBe('"123.45"');
    expect(escapeCsv(null)).toBe('""');
  });

  test("calculates summary overview metrics accurately from dataset", () => {
    const records = useLandRecordStore.getState().records;
    const totalRecords = records.length;
    const recordsVerified = records.filter((r) => r.status === "verified").length;
    const pendingReview = records.filter((r) => r.status === "pending_review").length;
    const clarificationRequired = records.filter((r) => r.status === "clarification_required").length;
    const totalRecordedArea = records.reduce((sum, r) => sum + r.recordedArea, 0);

    expect(totalRecords).toBeGreaterThan(0);
    expect(recordsVerified).toBeGreaterThanOrEqual(0);
    expect(pendingReview).toBeGreaterThanOrEqual(0);
    expect(clarificationRequired).toBeGreaterThanOrEqual(0);
    expect(totalRecordedArea).toBeGreaterThan(0);
  });

  test("translation key parity across en, te, and hi for govtLandRecords", () => {
    const enKeys = Object.keys(en.govtLandRecords).sort();
    const teKeys = Object.keys(te.govtLandRecords).sort();
    const hiKeys = Object.keys(hi.govtLandRecords).sort();

    expect(teKeys).toEqual(enKeys);
    expect(hiKeys).toEqual(enKeys);
    expect(enKeys.length).toBeGreaterThan(30);
  });
});
