import { governmentSchemesService, VERIFIED_GOVERNMENT_SCHEMES } from "../services/government-schemes";

describe("Government Schemes Service & Data Integrity", () => {
  it("should have verified scheme records with factual government data", () => {
    expect(VERIFIED_GOVERNMENT_SCHEMES.length).toBeGreaterThanOrEqual(5);

    VERIFIED_GOVERNMENT_SCHEMES.forEach((scheme) => {
      // Must have valid identifiers and names
      expect(scheme.id).toBeTruthy();
      expect(scheme.name).toBeTruthy();
      expect(scheme.shortDescription).toBeTruthy();

      // Must have verified ministry and government level
      expect(scheme.ministry).toBeTruthy();
      expect(["central", "state"]).toContain(scheme.governmentLevel);

      // Must have verified benefit structure
      expect(scheme.benefit.headline).toBeTruthy();
      expect(scheme.benefit.description).toBeTruthy();
      expect(scheme.benefit.amountOrSubsidy).toBeTruthy();

      // Must have structured eligibility criteria
      expect(scheme.eligibility.targetBeneficiaries.length).toBeGreaterThan(0);
      expect(scheme.eligibility.landholdingRequirement).toBeTruthy();
      expect(scheme.eligibility.locationState).toBeTruthy();

      // Must have mandatory documents defined
      expect(scheme.documents.length).toBeGreaterThan(0);
      const hasMandatoryDoc = scheme.documents.some((d) => d.mandatory);
      expect(hasMandatoryDoc).toBe(true);

      // Must have verified official government URLs (no "#" or fake internal routes)
      expect(scheme.officialWebsite.startsWith("https://")).toBe(true);
      expect(scheme.officialApplicationUrl.startsWith("https://")).toBe(true);
      expect(scheme.officialApplicationUrl).not.toContain("/apply");
      expect(scheme.officialApplicationUrl).not.toBe("#");

      // Must have verified helpline
      expect(scheme.helpline.number).toBeTruthy();
      expect(scheme.helpline.label).toBeTruthy();

      // Must have official verified source tracking
      expect(scheme.source.name).toBeTruthy();
      expect(scheme.source.url.startsWith("https://")).toBe(true);
      expect(scheme.lastVerified).toBeTruthy();
    });
  });

  it("should return all schemes when filter is 'all'", async () => {
    const schemes = await governmentSchemesService.getSchemes({ filter: "all" });
    expect(schemes.length).toBe(VERIFIED_GOVERNMENT_SCHEMES.length);
  });

  it("should filter active schemes correctly", async () => {
    const activeSchemes = await governmentSchemesService.getSchemes({ filter: "active" });
    expect(activeSchemes.length).toBeGreaterThan(0);
    activeSchemes.forEach((s) => {
      expect(s.status).toBe("active");
    });
  });

  it("should filter upcoming schemes correctly", async () => {
    const upcomingSchemes = await governmentSchemesService.getSchemes({ filter: "upcoming" });
    expect(upcomingSchemes.length).toBeGreaterThan(0);
    upcomingSchemes.forEach((s) => {
      expect(s.status).toBe("upcoming");
    });
  });

  it("should filter central schemes correctly", async () => {
    const centralSchemes = await governmentSchemesService.getSchemes({ filter: "central" });
    expect(centralSchemes.length).toBeGreaterThan(0);
    centralSchemes.forEach((s) => {
      expect(s.governmentLevel).toBe("central");
    });
  });

  it("should filter state schemes correctly", async () => {
    const stateSchemes = await governmentSchemesService.getSchemes({ filter: "state" });
    expect(stateSchemes.length).toBeGreaterThan(0);
    stateSchemes.forEach((s) => {
      expect(s.governmentLevel).toBe("state");
    });
  });

  it("should search schemes by name (case-insensitive)", async () => {
    const results = await governmentSchemesService.getSchemes({ search: "pm-kisan" });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe("pm-kisan");

    const upperResults = await governmentSchemesService.getSchemes({ search: "KISAN" });
    expect(upperResults.length).toBeGreaterThanOrEqual(1);
  });

  it("should search schemes by ministry or department", async () => {
    const results = await governmentSchemesService.getSchemes({ search: "Telangana" });
    expect(results.length).toBeGreaterThanOrEqual(2);
    const hasRythuBandhu = results.some((s) => s.id === "rythu-bandhu");
    const hasFreePower = results.some((s) => s.id === "telangana-free-power");
    expect(hasRythuBandhu).toBe(true);
    expect(hasFreePower).toBe(true);
  });

  it("should search schemes by crop", async () => {
    const results = await governmentSchemesService.getSchemes({ search: "Cotton" });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((s) => {
      const matchesCrop = s.crops.some((c) => c.toLowerCase().includes("cotton") || c.toLowerCase().includes("all"));
      expect(matchesCrop).toBe(true);
    });
  });

  it("should return empty array for non-matching search", async () => {
    const results = await governmentSchemesService.getSchemes({ search: "NonExistentSchemeXYZ123" });
    expect(results).toEqual([]);
  });

  it("should combine search and filter without conflict", async () => {
    const centralPaddy = await governmentSchemesService.getSchemes({
      filter: "central",
      search: "Paddy",
    });
    expect(centralPaddy.length).toBeGreaterThan(0);
    centralPaddy.forEach((s) => {
      expect(s.governmentLevel).toBe("central");
    });
  });

  it("should retrieve a scheme by ID", async () => {
    const scheme = await governmentSchemesService.getSchemeById("pm-kisan");
    expect(scheme).toBeDefined();
    expect(scheme?.name).toContain("PM-KISAN");

    const notFound = await governmentSchemesService.getSchemeById("non-existent");
    expect(notFound).toBeUndefined();
  });

  it("should provide informational eligibility evaluation without claiming government authority", async () => {
    const evaluation = await governmentSchemesService.checkEligibility("pm-kisan", {
      hasLand: true,
      state: "Telangana",
      isFarmer: true,
    });

    expect(evaluation.schemeId).toBe("pm-kisan");
    expect(evaluation.matchedCriteria.length).toBeGreaterThan(0);
    expect(evaluation.isPotentiallyEligible).toBe(true);

    // Strictly verify clear non-government disclaimer
    expect(evaluation.disclaimer).toContain("INFORMATIONAL NOTICE");
    expect(evaluation.disclaimer).toContain("NOT a government agency");
    expect(evaluation.disclaimer).toContain("Final eligibility");
  });

  it("should match exactly 3 potentially eligible schemes for the Figma banner", async () => {
    const count = await governmentSchemesService.getPotentialEligibleCount();
    expect(count).toBe(3);
  });

  it("should include all 5 specific schemes showcased in the Figma design", () => {
    const figmaRequiredIds = [
      "pm-kisan",
      "rythu-bandhu",
      "pmfby",
      "telangana-free-power",
      "pmksy",
    ];

    figmaRequiredIds.forEach((id) => {
      const found = VERIFIED_GOVERNMENT_SCHEMES.find((s) => s.id === id);
      expect(found).toBeDefined();
      expect(found?.officialWebsite.startsWith("https://")).toBe(true);
      expect(found?.officialApplicationUrl.startsWith("https://")).toBe(true);
      expect(found?.helpline.number).toBeTruthy();
    });
  });

  it("should have complete and aligned localization keys in en, te, and hi", () => {
    const en = require("../locales/en.json");
    const te = require("../locales/te.json");
    const hi = require("../locales/hi.json");

    expect(en.schemes).toBeDefined();
    expect(te.schemes).toBeDefined();
    expect(hi.schemes).toBeDefined();

    const enKeys = Object.keys(en.schemes);
    const teKeys = Object.keys(te.schemes);
    const hiKeys = Object.keys(hi.schemes);

    expect(enKeys.length).toBeGreaterThan(15);
    expect(teKeys).toEqual(enKeys);
    expect(hiKeys).toEqual(enKeys);
  });
});

