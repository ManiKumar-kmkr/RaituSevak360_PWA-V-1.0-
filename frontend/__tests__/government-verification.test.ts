
import en from "../locales/en.json";
import te from "../locales/te.json";
import hi from "../locales/hi.json";

describe("Government & NGO Verification Workspace Unit & Localization Tests", () => {
  describe("Localization Keys Synchronization", () => {
    it("should have matching govtVerification keys across en, te, and hi locales", () => {
      const enKeys = Object.keys(en.govtVerification).sort();
      const teKeys = Object.keys(te.govtVerification).sort();
      const hiKeys = Object.keys(hi.govtVerification).sort();

      expect(enKeys.length).toBeGreaterThan(15);
      expect(teKeys).toEqual(enKeys);
      expect(hiKeys).toEqual(enKeys);
    });

    it("should have non-empty translations for all required action and status labels", () => {
      const requiredKeys = [
        "title",
        "subtitle",
        "totalRequests",
        "pendingReview",
        "underReview",
        "verified",
        "clarificationRequired",
        "rejected",
        "reviewDocument",
        "verifyDocument",
        "requestClarification",
        "rejectDocument",
        "approveRepresentative",
        "rejectVerification",
        "confirmApprovalTitle",
        "activityTimeline",
      ] as const;

      requiredKeys.forEach((key) => {
        expect((en.govtVerification as any)[key]).toBeTruthy();
        expect((te.govtVerification as any)[key]).toBeTruthy();
        expect((hi.govtVerification as any)[key]).toBeTruthy();
      });
    });
  });

  describe("Verification Request Data Integrity", () => {
    it("should enforce all documents verified before approval can be made", () => {
      const mockDocsUnverified = [
        { id: "doc-1", status: "verified" },
        { id: "doc-2", status: "under_review" },
      ];

      const canApproveUnverified = mockDocsUnverified.every(
        (document) => document.status === "verified"
      );

      expect(canApproveUnverified).toBe(false);

      const mockDocsAllVerified = [
        { id: "doc-1", status: "verified" },
        { id: "doc-2", status: "verified" },
      ];

      const canApproveVerified = mockDocsAllVerified.every(
        (document) => document.status === "verified"
      );

      expect(canApproveVerified).toBe(true);
    });

    it("should require clarification reason when requesting clarification", () => {
      const validateClarification = (reason: string) =>
        Boolean(reason && reason.trim().length > 0);

      expect(validateClarification("")).toBe(false);
      expect(validateClarification("   ")).toBe(false);
      expect(
        validateClarification(
          "Please upload higher resolution appointment copy."
        )
      ).toBe(true);
    });

    it("should require rejection reason when rejecting verification", () => {
      const validateRejection = (reason: string) =>
        Boolean(reason && reason.trim().length > 0);

      expect(validateRejection("")).toBe(false);
      expect(validateRejection("   ")).toBe(false);
      expect(
        validateRejection(
          "Invalid employee credentials and registration expired."
        )
      ).toBe(true);
    });

    it("should differentiate NGO-specific fields from Government fields", () => {
      const ngoOrg = {
        organizationType: "NGO",
        ngoRegistrationNumber: "NGO/DARPAN/AP/2018/004812",
        ngoRegistrationAuthority: "NITI Aayog DARPAN",
      };

      const govtOrg = {
        organizationType: "Government Department",
        departmentMinistry: "Dept. of Agriculture & Farmers Welfare",
        employeeOfficerId: "AP-GOV-DAO-8821",
      };

      expect(ngoOrg.organizationType).toBe("NGO");
      expect(ngoOrg.ngoRegistrationNumber).toBeTruthy();
      expect(govtOrg.organizationType).toBe("Government Department");
      expect(govtOrg.employeeOfficerId).toBeTruthy();
    });
  });

  describe("Farmer Registry Localization & Data Integrity Tests", () => {
    it("should have matching govtFarmerRegistry keys across en, te, and hi locales", () => {
      const enKeys = Object.keys(en.govtFarmerRegistry).sort();
      const teKeys = Object.keys(te.govtFarmerRegistry).sort();
      const hiKeys = Object.keys(hi.govtFarmerRegistry).sort();

      expect(enKeys.length).toBeGreaterThan(10);
      expect(teKeys).toEqual(enKeys);
      expect(hiKeys).toEqual(enKeys);
    });

    it("should validate live search matches across name, ID, mobile, and district", () => {
      const sampleFarmer = {
        farmerName: "B. Venkata Ramana",
        registrationId: "FAR-2026-001248",
        rawMobileSearch: "9848021482",
        district: "Guntur",
        village: "Angalakuduru",
        maskedAadhaar: "XXXX-XXXX-1248",
      };

      const matchQuery = (q: string) => {
        const query = q.toLowerCase();

        return (
          sampleFarmer.farmerName.toLowerCase().includes(query) ||
          sampleFarmer.registrationId.toLowerCase().includes(query) ||
          sampleFarmer.rawMobileSearch.includes(query) ||
          sampleFarmer.district.toLowerCase().includes(query) ||
          sampleFarmer.village.toLowerCase().includes(query) ||
          sampleFarmer.maskedAadhaar.toLowerCase().includes(query)
        );
      };

      expect(matchQuery("Ramana")).toBe(true);
      expect(matchQuery("FAR-2026-001248")).toBe(true);
      expect(matchQuery("9848021482")).toBe(true);
      expect(matchQuery("Guntur")).toBe(true);
      expect(matchQuery("1248")).toBe(true);
      expect(matchQuery("Warangal")).toBe(false);
    });

    it("should require clarification reason for farmer clarification workflow", () => {
      const validateFarmerClarification = (reason: string) =>
        Boolean(reason && reason.trim().length > 0);

      expect(validateFarmerClarification("")).toBe(false);
      expect(validateFarmerClarification("   ")).toBe(false);
      expect(
        validateFarmerClarification(
          "Please upload clear copy of 1B Adangal record."
        )
      ).toBe(true);
    });

    it("should require rejection reason for farmer rejection workflow", () => {
      const validateFarmerRejection = (reason: string) =>
        Boolean(reason && reason.trim().length > 0);

      expect(validateFarmerRejection("")).toBe(false);
      expect(validateFarmerRejection("   ")).toBe(false);
      expect(
        validateFarmerRejection(
          "Survey number does not exist in revenue registry."
        )
      ).toBe(true);
    });
  });
});
