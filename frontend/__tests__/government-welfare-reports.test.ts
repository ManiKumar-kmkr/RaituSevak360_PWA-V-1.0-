import {
  DEMO_WELFARE_PROGRAMMES,
  DISTRICT_MANDALS_MAP,
  ALL_DISTRICTS,
  calculateWelfareMetrics,
  filterWelfareProgrammes,
  formatIndianRupees,
  formatExactRupees,
} from "../services/welfare-reports-data";
import {
  escapeCsvCell,
  generateWelfareReportsCsv,
  generateMandalBreakdownCsv,
} from "../utils/welfare-csv-export";
import en from "../locales/en.json";
import te from "../locales/te.json";
import hi from "../locales/hi.json";

describe("Government Welfare Impact Reports Suite", () => {
  describe("Demo Dataset Integrity & Privacy Safeguards", () => {
    test("loads initial demo welfare programmes with expected properties", () => {
      expect(DEMO_WELFARE_PROGRAMMES.length).toBeGreaterThanOrEqual(5);

      DEMO_WELFARE_PROGRAMMES.forEach((p) => {
        expect(p.id).toMatch(/^WLF-AP-/);
        expect(p.name).toBeTruthy();
        expect(p.category).toBeTruthy();
        expect(p.targetBeneficiaries).toBeGreaterThan(0);
        expect(p.approvedApplications).toBeGreaterThan(0);
        expect(p.benefitsDistributed).toBeGreaterThan(0);
        // Distribution must not exceed approvals
        expect(p.benefitsDistributed).toBeLessThanOrEqual(p.approvedApplications);
        expect(p.districtsCovered.length).toBeGreaterThan(0);
        expect(p.mandalBreakdown.length).toBeGreaterThan(0);
        expect(p.allocatedBudgetRupees).toBeGreaterThan(0);
        expect(p.approvedBudgetRupees).toBeLessThanOrEqual(p.allocatedBudgetRupees);
        expect(p.disbursedBudgetRupees).toBeLessThanOrEqual(p.approvedBudgetRupees);
      });
    });

    test("contains NO sensitive identity or bank data in sample beneficiaries", () => {
      DEMO_WELFARE_PROGRAMMES.forEach((p) => {
        p.sampleBeneficiaries.forEach((b) => {
          // Check beneficiary reference format
          expect(b.referenceId).toMatch(/^BEN-AP-2026-/);
          // Check masked alias format (never raw real name or 12-digit Aadhaar)
          expect(b.farmerAlias).toContain("Demo");
          expect(b.farmerAlias).not.toMatch(/^\d{12}$/);
          // No bank account pattern (e.g., 9-18 continuous digits)
          expect(b.farmerAlias).not.toMatch(/\d{9,18}/);
        });
      });
    });

    test("mandals match their assigned districts", () => {
      DEMO_WELFARE_PROGRAMMES.forEach((p) => {
        p.mandalBreakdown.forEach((m) => {
          const validMandals = DISTRICT_MANDALS_MAP[m.district];
          expect(validMandals).toBeDefined();
          expect(validMandals).toContain(m.mandal);
        });
      });
    });
  });

  describe("Metrics Calculations & Currency Formatting", () => {
    test("calculates consistent aggregate metrics from demo programmes", () => {
      const metrics = calculateWelfareMetrics(DEMO_WELFARE_PROGRAMMES);

      expect(metrics.programmesMonitored).toBe(DEMO_WELFARE_PROGRAMMES.length);
      expect(metrics.districtsCovered).toBe(ALL_DISTRICTS.length);
      expect(metrics.registeredBeneficiaries).toBeGreaterThan(0);
      expect(metrics.benefitsApproved).toBeGreaterThan(0);
      expect(metrics.benefitsDistributed).toBeGreaterThan(0);
      expect(metrics.pendingApplications).toBeGreaterThan(0);

      // Verify distributed does not exceed approved
      expect(metrics.benefitsDistributed).toBeLessThanOrEqual(metrics.benefitsApproved);

      // Verify rupee totals
      expect(metrics.totalAllocatedBudget).toBeGreaterThan(0);
      expect(metrics.totalApprovedBudget).toBeLessThanOrEqual(metrics.totalAllocatedBudget);
      expect(metrics.totalDisbursedBudget).toBeLessThanOrEqual(metrics.totalApprovedBudget);
    });

    test("formats Indian rupees correctly for crores, lakhs, and exact amounts", () => {
      expect(formatIndianRupees(15000000)).toBe("₹1.50 Cr");
      expect(formatIndianRupees(185000000)).toBe("₹18.50 Cr");
      expect(formatIndianRupees(450000)).toBe("₹4.50 L");
      expect(formatIndianRupees(25000)).toBe("₹25,000");

      expect(formatExactRupees(10000)).toBe("₹10,000");
      expect(formatExactRupees(1234567)).toBe("₹12,34,567");
    });
  });

  describe("Programme Filtering and Search Logic", () => {
    test("filters programmes by district", () => {
      const gunturFiltered = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "",
        selectedDistrict: "Guntur",
        selectedMandal: "all",
        selectedProgramme: "all",
        selectedPeriod: "all",
        selectedStatus: "all",
      });

      expect(gunturFiltered.length).toBeGreaterThan(0);
      gunturFiltered.forEach((p) => {
        expect(p.districtsCovered).toContain("Guntur");
      });
    });

    test("filters programmes by mandal", () => {
      const tenaliFiltered = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "",
        selectedDistrict: "Guntur",
        selectedMandal: "Tenali",
        selectedProgramme: "all",
        selectedPeriod: "all",
        selectedStatus: "all",
      });

      expect(tenaliFiltered.length).toBeGreaterThan(0);
      tenaliFiltered.forEach((p) => {
        expect(p.mandalBreakdown.some((m) => m.mandal === "Tenali")).toBe(true);
      });
    });

    test("filters programmes by specific programme ID", () => {
      const targetId = "WLF-AP-FFA-01";
      const singleFiltered = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "",
        selectedDistrict: "all",
        selectedMandal: "all",
        selectedProgramme: targetId,
        selectedPeriod: "all",
        selectedStatus: "all",
      });

      expect(singleFiltered.length).toBe(1);
      expect(singleFiltered[0].id).toBe(targetId);
    });

    test("filters programmes by reporting period", () => {
      const periodFiltered = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "",
        selectedDistrict: "all",
        selectedMandal: "all",
        selectedProgramme: "all",
        selectedPeriod: "Kharif 2026",
        selectedStatus: "all",
      });

      expect(periodFiltered.length).toBeGreaterThan(0);
      periodFiltered.forEach((p) => {
        expect(p.reportingPeriod).toBe("Kharif 2026");
      });
    });

    test("searches by programme name, reference, district, and beneficiary reference", () => {
      // By shortcode/ref
      const refMatches = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "FFA-2026",
        selectedDistrict: "all",
        selectedMandal: "all",
        selectedProgramme: "all",
        selectedPeriod: "all",
        selectedStatus: "all",
      });
      expect(refMatches.length).toBe(1);

      // By Beneficiary Reference
      const benMatches = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "BEN-AP-2026-0101",
        selectedDistrict: "all",
        selectedMandal: "all",
        selectedProgramme: "all",
        selectedPeriod: "all",
        selectedStatus: "all",
      });
      expect(benMatches.length).toBe(1);
      expect(benMatches[0].id).toBe("WLF-AP-FFA-01");
    });

    test("returns empty list for non-matching query", () => {
      const emptyMatches = filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, {
        searchQuery: "NONEXISTENT_QUERY_9999",
        selectedDistrict: "all",
        selectedMandal: "all",
        selectedProgramme: "all",
        selectedPeriod: "all",
        selectedStatus: "all",
      });
      expect(emptyMatches.length).toBe(0);
    });
  });

  describe("CSV Generation and Escaping (RFC-4180)", () => {
    test("escapes commas, quotes, and newlines correctly", () => {
      expect(escapeCsvCell("simple")).toBe("simple");
      expect(escapeCsvCell("hello, world")).toBe('"hello, world"');
      expect(escapeCsvCell('quote "test"')).toBe('"quote ""test"""');
      expect(escapeCsvCell("line1\nline2")).toBe('"line1\nline2"');
      expect(escapeCsvCell(null)).toBe("");
      expect(escapeCsvCell(undefined)).toBe("");
    });

    test("generates RFC-4180 compliant CSV string for programmes", () => {
      const csv = generateWelfareReportsCsv(DEMO_WELFARE_PROGRAMMES.slice(0, 2));
      const lines = csv.split("\r\n");

      // Verify header line
      expect(lines[0]).toContain("Programme Reference");
      expect(lines[0]).toContain("Programme Name");
      expect(lines[0]).toContain("Approved Applications");
      expect(lines[0]).toContain("Benefits Distributed");

      // Verify data lines
      expect(lines.length).toBe(3); // header + 2 rows
      expect(lines[1]).toContain("WLF-AP-FFA-01");
    });

    test("generates mandal breakdown CSV for a programme", () => {
      const p = DEMO_WELFARE_PROGRAMMES[0];
      const csv = generateMandalBreakdownCsv(p);
      const lines = csv.split("\r\n");

      expect(lines[0]).toContain("Programme Reference");
      expect(lines[0]).toContain("District");
      expect(lines[0]).toContain("Mandal");
      expect(lines.length).toBe(p.mandalBreakdown.length + 1);
    });
  });

  describe("Localization Key Parity", () => {
    test("verifies identical key structures across en, te, and hi for govtWelfareReports", () => {
      const enKeys = Object.keys(en.govtWelfareReports).sort();
      const teKeys = Object.keys(te.govtWelfareReports).sort();
      const hiKeys = Object.keys(hi.govtWelfareReports).sort();

      expect(enKeys.length).toBeGreaterThan(25);
      expect(teKeys).toEqual(enKeys);
      expect(hiKeys).toEqual(enKeys);

      // Check essential required translation keys exist
      expect(enKeys).toContain("title");
      expect(enKeys).toContain("subtitle");
      expect(enKeys).toContain("quickServiceDesc");
      expect(enKeys).toContain("demoDisclaimer");
      expect(enKeys).toContain("registeredBeneficiaries");
      expect(enKeys).toContain("benefitsApproved");
      expect(enKeys).toContain("benefitsDistributed");
      expect(enKeys).toContain("pendingApplications");
      expect(enKeys).toContain("districtsCovered");
      expect(enKeys).toContain("programmesMonitored");
      expect(enKeys).toContain("clearFilters");
      expect(enKeys).toContain("exportCsv");
      expect(enKeys).toContain("backToDashboard");
      expect(enKeys).toContain("backToReports");
    });
  });
});
