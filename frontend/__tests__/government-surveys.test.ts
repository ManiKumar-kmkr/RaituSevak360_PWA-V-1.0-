import { useSurveyStore, INITIAL_DEMO_SURVEYS } from "../store/survey-store";

describe("Government Digital Field Surveys Store", () => {
  beforeEach(() => {
    useSurveyStore.getState().resetSurveys();
  });

  test("loads initial demo surveys", () => {
    const { surveys } = useSurveyStore.getState();
    expect(surveys.length).toBeGreaterThan(0);
    expect(surveys.some((s) => s.status === "in_progress")).toBe(true);
    expect(surveys.some((s) => s.status === "submitted")).toBe(true);
    expect(surveys.some((s) => s.status === "needs_review")).toBe(true);
  });

  test("creates a new draft survey", () => {
    const newSurvey = useSurveyStore.getState().addSurvey({
      title: "Rayalaseema Micro Irrigation Audit",
      type: "Soil and Irrigation Assessment",
      district: "Anantapur",
      mandal: "Kadiri",
      village: "Alampur",
      surveyDate: "2026-10-15",
      assignedOfficer: "Dr. K. S. Rao (ADO)",
      description: "Drip lateral inspection for horticulture plots",
      targetFarms: 12,
      priority: "Normal",
      status: "draft",
    });

    expect(newSurvey.id).toContain("SRV-2026-");
    expect(newSurvey.status).toBe("draft");
    expect(newSurvey.fieldEntries).toHaveLength(0);

    const { surveys } = useSurveyStore.getState();
    expect(surveys.some((s) => s.id === newSurvey.id)).toBe(true);
  });

  test("records a field visit entry and increments entries list", () => {
    const survey = useSurveyStore.getState().surveys[0];
    const initialCount = survey.fieldEntries.length;

    useSurveyStore.getState().addFieldEntry(survey.id, {
      farmerName: "C. Ramaiah (ID: FAR-9999)",
      farmerId: "FAR-9999",
      village: "Angalakuduru",
      crop: "Red Chilli",
      observedCondition: "Good",
      irrigationStatus: "Borewell / Drip",
      pestObservations: "No severe pest detected; healthy foliage",
      recommendedFollowUp: "Routine weeding and bio-fertilizer spray",
      visitDate: "2026-10-09",
    });

    const updatedSurvey = useSurveyStore
      .getState()
      .surveys.find((s) => s.id === survey.id);

    expect(updatedSurvey?.fieldEntries.length).toBe(initialCount + 1);
    expect(
      updatedSurvey?.fieldEntries.some(
        (e) => e.farmerName === "C. Ramaiah (ID: FAR-9999)"
      )
    ).toBe(true);
  });

  test("transitions survey lifecycle status", () => {
    const survey = useSurveyStore.getState().surveys.find((s) => s.status === "in_progress");
    expect(survey).toBeDefined();

    if (survey) {
      useSurveyStore.getState().transitionStatus(survey.id, "submitted", "Completed all visits.");
      let current = useSurveyStore.getState().surveys.find((s) => s.id === survey.id);
      expect(current?.status).toBe("submitted");

      useSurveyStore.getState().transitionStatus(survey.id, "needs_review", "Spot audit needed.");
      current = useSurveyStore.getState().surveys.find((s) => s.id === survey.id);
      expect(current?.status).toBe("needs_review");
    }
  });

  test("requests correction and records reason", () => {
    const survey = useSurveyStore.getState().surveys.find((s) => s.status === "needs_review");
    expect(survey).toBeDefined();

    if (survey) {
      useSurveyStore.getState().requestCorrection(
        survey.id,
        "GPS geotags missing for plots 2 and 3."
      );
      const current = useSurveyStore.getState().surveys.find((s) => s.id === survey.id);
      expect(current?.correctionReason).toBe("GPS geotags missing for plots 2 and 3.");
    }
  });

  test("marks survey reviewed with reviewer notes", () => {
    const survey = useSurveyStore.getState().surveys.find((s) => s.status === "needs_review");
    expect(survey).toBeDefined();

    if (survey) {
      useSurveyStore.getState().markReviewed(
        survey.id,
        "All plot records verified and countersigned."
      );
      const current = useSurveyStore.getState().surveys.find((s) => s.id === survey.id);
      expect(current?.status).toBe("reviewed");
      expect(current?.reviewerNotes).toBe("All plot records verified and countersigned.");
    }
  });
});
