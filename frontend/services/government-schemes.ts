import {
  GovernmentScheme,
  SchemeFilterType,
  SchemeEligibilityEvaluation,
} from "@/types/government-scheme";

/**
 * Verified Government Schemes Dataset
 * Sourced directly from official government portals:
 * - myScheme (https://www.myscheme.gov.in/)
 * - PM-KISAN (https://www.pmkisan.gov.in/)
 * - PMFBY (https://pmfby.gov.in/)
 * - Telangana Agriculture Portal (https://rythubandhu.telangana.gov.in/)
 * - TSSPDCL (https://www.tssspdcl.com/)
 * - PMKSY (https://pmksy.gov.in/)
 * - Maandhan (https://maandhan.in/)
 * - Agri Infra (https://agriinfra.dac.gov.in/)
 * - SMAM (https://agrimachinery.nic.in/)
 *
 * NOTE: RaituSevak360 provides this dataset for discovery only.
 * No government eligibility is fabricated or officially guaranteed by RaituSevak360.
 */
export const VERIFIED_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortName: "PM-KISAN",
    shortDescription:
      "Direct income support of ₹6,000 per year transferred into bank accounts of eligible landholder farmer families across India in three equal installments.",
    governmentLevel: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
    department: "Department of Agriculture & Farmers Welfare",
    stateName: "All India",
    status: "active",
    categories: ["Income Support", "Financial Assistance", "Direct Benefit Transfer"],
    crops: ["All Crops", "Paddy", "Cotton", "Wheat", "Maize", "Chilli", "Pulses"],
    benefit: {
      headline: "₹6,000 per year direct income support",
      description:
        "Financial benefit of ₹6,000 per annum payable in three equal four-monthly installments of ₹2,000 each, transferred directly into bank accounts through Aadhaar-seeded DBT.",
      amountOrSubsidy: "₹6,000 / year",
      paymentFrequency: "₹2,000 every 4 months (3 installments annually)",
    },
    eligibility: {
      targetBeneficiaries: [
        "Small and marginal landholder farmer families",
        "Farmer families owning cultivable land in their own names",
        "Valid land records matching government revenue database",
      ],
      landholdingRequirement:
        "Cultivable landholding in the name of the farmer family (as per official state land records).",
      locationState: "All Indian States and Union Territories",
      incomeOrExclusions: [
        "Institutional landholders are excluded",
        "Farmer families holding constitutional posts or former/present Ministers, MPs, MLAs are excluded",
        "Serving or retired officers and employees of Central/State Govt Ministries/Offices/PSUs (except Multi Tasking Staff / Class IV / Group D) are excluded",
        "All persons who paid Income Tax in the last assessment year are excluded",
        "Professionals like Doctors, Engineers, Lawyers, Chartered Accountants, and Architects are excluded",
      ],
      otherConditions: [
        "Mandatory Aadhaar seeding with bank account and active NPCI DBT status",
        "Completed mandatory e-KYC on the PM-KISAN portal (via OTP or Biometric CSC)",
        "Land record details verified on the State Agriculture / Revenue portal",
      ],
    },
    documents: [
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Must be linked to an active mobile number for OTP-based e-KYC",
      },
      {
        name: "Land Ownership Record (Pattadar Passbook / RoR / Khatauni)",
        mandatory: true,
        description: "Official land record showing cultivable land parcel in applicant's name",
      },
      {
        name: "Bank Account Passbook / Statement",
        mandatory: true,
        description: "Aadhaar-seeded bank account with active Direct Benefit Transfer (DBT)",
      },
      {
        name: "Active Mobile Number",
        mandatory: true,
        description: "Registered mobile for official installment SMS notifications and status checks",
      },
    ],
    importantDates: {
      applicationDeadline: "Continuous enrollment throughout the year",
      schemePeriod: "Annual cycle (April-July, August-November, December-March)",
      isOngoing: true,
      details: "Installments are disbursed every four months. e-KYC must remain up-to-date.",
    },
    howToApply: {
      summary:
        "Farmers can self-register online on the official PM-KISAN portal or visit a local Common Service Centre (CSC) / Village Agriculture Nodal Officer.",
      steps: [
        "Visit the official PM-KISAN portal (pmkisan.gov.in) and navigate to 'Farmers Corner'.",
        "Click on 'New Farmer Registration' and select Rural or Urban Farmer Registration.",
        "Enter your 12-digit Aadhaar number and registered mobile number, then submit the received OTP.",
        "Fill in personal details, select State, District, Sub-District, Block, and Village.",
        "Enter land record details (Survey/Khata number, Dag/Khasra number, land area in hectares).",
        "Upload the land ownership document and submit the self-registration form.",
      ],
      portalName: "PM-KISAN Official Government Portal",
      officialPortalUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
      note: "RaituSevak360 does NOT collect your Aadhaar or process applications. The application is submitted directly on the official government website.",
    },
    officialWebsite: "https://www.pmkisan.gov.in/",
    officialApplicationUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    helpline: {
      number: "155261",
      label: "PM-KISAN National Toll-Free Helpline (Alternative: 011-24300606, 1800-115-526)",
      hours: "Available 24x7 in multiple Indian languages",
    },
    source: {
      name: "PM-KISAN Official Portal & myScheme",
      url: "https://www.myscheme.gov.in/schemes/pm-kisan",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["Central", "Active", "Direct Benefit Transfer", "Income Support", "Landholder"],
    isPotentiallyEligible: true,
  },
  {
    id: "rythu-bandhu",
    name: "Rythu Bandhu Scheme (Farmers' Investment Support)",
    shortName: "Rythu Bandhu / Rythu Bharosa",
    shortDescription:
      "Direct financial investment support provided to landowning farmers in Telangana per acre per season to purchase agriculture inputs such as seeds, fertilizers, and field prep.",
    governmentLevel: "state",
    ministry: "Department of Agriculture, Government of Telangana",
    department: "Agriculture and Farmers Welfare Department",
    stateName: "Telangana",
    status: "active",
    categories: ["Input Subsidy", "State Welfare", "Direct Benefit Transfer"],
    crops: ["Paddy", "Cotton", "Chilli", "Maize", "Red Gram", "Groundnut", "All Crops"],
    benefit: {
      headline: "Per-acre seasonal input assistance",
      description:
        "Direct investment support provided per acre per crop season for Kharif (Vanakkalam) and Rabi (Yasangi) directly credited to the beneficiary's bank account.",
      amountOrSubsidy: "Direct Benefit Transfer per acre per season",
      paymentFrequency: "Two crop seasons annually (Kharif and Rabi)",
    },
    eligibility: {
      targetBeneficiaries: [
        "Resident farmers of Telangana State",
        "Owners of cultivable agricultural land registered in the Dharani land portal",
        "Holders of valid electronic Pattadar Passbooks (e-Passbooks)",
      ],
      landholdingRequirement:
        "Ownership of cultivable land in Telangana with updated digital revenue records.",
      locationState: "Telangana",
      incomeOrExclusions: [
        "Non-agricultural or commercial lands are excluded",
        "Government assigned or disputed lands subject to litigation until resolved",
        "Lands under non-cultivation categories as per village revenue adangal",
      ],
      otherConditions: [
        "Land details must be integrated with the Dharani Land Records Management System",
        "Valid active bank account linked with Pattadar Passbook number",
        "Verification by the local Agriculture Extension Officer (AEO)",
      ],
    },
    documents: [
      {
        name: "Pattadar Passbook / Dharani Title Deed",
        mandatory: true,
        description: "Official Telangana digital passbook issued by the Revenue Department",
      },
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Farmer Aadhaar card copy for beneficiary identity verification",
      },
      {
        name: "Bank Account Passbook",
        mandatory: true,
        description: "Bank account in applicant's name with IFSC and branch details",
      },
    ],
    importantDates: {
      applicationDeadline: "Seasonal schedule aligned with Kharif & Rabi sowing windows",
      schemePeriod: "Bi-annual (Kharif / Rabi)",
      isOngoing: true,
      details: "Disbursements occur prior to seasonal sowing. Visit official portal for current season cut-offs.",
    },
    howToApply: {
      summary:
        "Registered Pattadar passbook holders are enrolled automatically via Dharani integration. New landholders must present their passbook to the local Agriculture Extension Officer (AEO).",
      steps: [
        "Verify your land title deed record in the Telangana Dharani revenue portal.",
        "Ensure your bank account and Aadhaar are seeded with your Pattadar passbook record.",
        "Submit passbook copy and bank details to your village Agriculture Extension Officer (AEO).",
        "Track investment support disbursement status on the official Rythu Bandhu web portal.",
      ],
      portalName: "Telangana Rythu Bandhu Portal",
      officialPortalUrl: "https://rythubandhu.telangana.gov.in/",
      note: "No online application fees or intermediaries are required. Verification is conducted via village revenue and agriculture officers.",
    },
    officialWebsite: "https://rythubandhu.telangana.gov.in/",
    officialApplicationUrl: "https://rythubandhu.telangana.gov.in/",
    helpline: {
      number: "040-23383520",
      label: "Telangana Agriculture Commissionerate (Toll-Free Kisan Call Centre: 1800-180-1551)",
      hours: "10:00 AM - 5:30 PM on working days",
    },
    source: {
      name: "Government of Telangana Agriculture Department",
      url: "https://rythubandhu.telangana.gov.in/",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["State", "Active", "Telangana", "Input Subsidy", "Pattadar"],
    isPotentiallyEligible: true,
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    shortName: "PMFBY",
    shortDescription:
      "Comprehensive crop insurance coverage providing financial protection against yield loss caused by non-preventable natural calamities, pests, and adverse weather conditions.",
    governmentLevel: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
    department: "Department of Agriculture & Farmers Welfare",
    stateName: "All Participating States",
    status: "active",
    categories: ["Crop Insurance", "Risk Mitigation", "Disaster Relief"],
    crops: ["Paddy", "Cotton", "Groundnut", "Pulses", "Maize", "Chilli", "Horticulture"],
    benefit: {
      headline: "Comprehensive crop insurance with low farmer premium",
      description:
        "Uniformly low premium payable by farmers: max 2% for Kharif food/oilseeds, 1.5% for Rabi food/oilseeds, and 5% for annual commercial/horticultural crops. The remaining actuarial premium is heavily subsidized by Central and State Governments.",
      amountOrSubsidy: "Max 1.5% - 2% premium share by farmer",
      paymentFrequency: "Per Crop Season (Kharif / Rabi)",
    },
    eligibility: {
      targetBeneficiaries: [
        "All farmers growing notified crops in notified areas (both loanee and non-loanee farmers)",
        "Sharecroppers and tenant farmers with valid cultivation agreements or certificates",
        "Farmers who have sown or intend to sow the notified crop in the season",
      ],
      landholdingRequirement:
        "Cultivated land with verified land title record, Pattadar passbook, or valid tenant/sharecropper certificate.",
      locationState: "All Participating States / Union Territories",
      incomeOrExclusions: [
        "Crops not declared as 'notified' by the state government for the specific insurance unit are excluded",
        "Preventable risks like war, nuclear risks, malicious damage, or domestic animal grazing are excluded",
        "Applications submitted after the seasonal cut-off date are strictly rejected",
      ],
      otherConditions: [
        "Application must be submitted before the seasonal cut-off date (e.g., July 31 for Kharif, Dec 31 for Rabi)",
        "Sowing certificate or declaration must be provided for non-loanee farmers",
        "Localized calamity or post-harvest loss must be reported within 72 hours via the Crop Insurance App or helpline",
      ],
    },
    documents: [
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Identity verification of the cultivating farmer",
      },
      {
        name: "Land Record (Pattadar Passbook / RoR / 1-B / Tenancy Certificate)",
        mandatory: true,
        description: "Proof of land possession or verified tenant cultivation certificate",
      },
      {
        name: "Sowing Certificate / Crop Declaration",
        mandatory: true,
        description: "Issued by Village Revenue Officer (VRO), Agriculture Extension Officer (AEO), or self-attested declaration",
      },
      {
        name: "Bank Account Passbook / Cancelled Cheque",
        mandatory: true,
        description: "Bank account details where insurance claim settlement will be credited directly",
      },
    ],
    importantDates: {
      applicationDeadline: "July 31 for Kharif / Dec 31 for Rabi (Check state notification for active season)",
      schemePeriod: "Season-specific (Kharif / Rabi)",
      isOngoing: true,
      details: "Seasonal application windows are notified by State Governments before each crop season.",
    },
    howToApply: {
      summary:
        "Farmers can apply online directly on the National Crop Insurance Portal (pmfby.gov.in), through their lending bank branch, or at any Common Service Centre (CSC).",
      steps: [
        "Visit the official PMFBY National Crop Insurance Portal (pmfby.gov.in).",
        "Click on 'Farmer Corner' and choose 'Apply for Crop Insurance Yourself' (or log in via mobile OTP).",
        "Select State, Season, Year, and Scheme name.",
        "Enter Bank details (IFSC, Account number) and Land details (District, Mandal, Village, Survey Number).",
        "Select the notified crop sown and land area in hectares/acres.",
        "Upload required documents (Land record, Sowing certificate, Passbook copy) and pay the subsidized premium online.",
        "Download the official Insurance Policy receipt with Acknowledgement Number.",
      ],
      portalName: "National Crop Insurance Portal (PMFBY)",
      officialPortalUrl: "https://pmfby.gov.in/farmerRegistrationForm",
      note: "Crop damage from localized perils (hailstorm, inundation, landslide) must be reported within 72 hours through the official PMFBY Crop Insurance App or helpline 14447.",
    },
    officialWebsite: "https://pmfby.gov.in/",
    officialApplicationUrl: "https://pmfby.gov.in/farmerRegistrationForm",
    helpline: {
      number: "14447",
      label: "PMFBY National Toll-Free Helpline (Crop Insurance Kisan Call Centre)",
      hours: "Available 24x7 across India",
    },
    source: {
      name: "PMFBY National Portal & myScheme",
      url: "https://www.myscheme.gov.in/schemes/pmfby",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["Central", "Active", "Crop Insurance", "Risk Protection", "Subsidized Premium"],
    isPotentiallyEligible: true,
  },
  {
    id: "telangana-free-power",
    name: "Telangana 24×7 Free Agricultural Power Scheme",
    shortName: "24×7 Free Power Scheme",
    shortDescription:
      "Uninterrupted free three-phase electricity supplied round the clock to agricultural borewells and pump-sets for eligible farmers across Telangana.",
    governmentLevel: "state",
    ministry: "Energy Department, Government of Telangana",
    department: "TSSPDCL & TSNPDCL",
    stateName: "Telangana",
    status: "active",
    categories: ["Electricity Subsidy", "Irrigation Support", "State Welfare"],
    crops: ["All Crops", "Paddy", "Cotton", "Chilli", "Horticulture", "Maize"],
    benefit: {
      headline: "24×7 uninterrupted free agricultural power supply",
      description:
        "Free electricity provided to agricultural borewells and lift irrigation pump-sets, removing power tariff costs for farming operations across the state.",
      amountOrSubsidy: "100% Free Power (Zero electricity bill)",
      paymentFrequency: "Continuous round-the-clock service",
    },
    eligibility: {
      targetBeneficiaries: [
        "Farmers in Telangana owning agricultural land with authorized pump-sets / borewells",
        "Holders of valid LT-V Agricultural service electricity connection",
      ],
      landholdingRequirement:
        "Cultivable agricultural land with installed irrigation borewell / open well pump-set.",
      locationState: "Telangana",
      incomeOrExclusions: [
        "Commercial and industrial connections are strictly excluded from free agricultural tariff",
        "Unauthorized power tapping or misuse for non-agricultural purposes incurs disconnection and penalties",
      ],
      otherConditions: [
        "Connection must be registered under Category LT-V (Agricultural)",
        "Equipped with appropriate capacitor and starter as per Discom safety norms",
      ],
    },
    documents: [
      {
        name: "Pattadar Passbook / Land Record",
        mandatory: true,
        description: "Proof of agricultural land ownership in Telangana",
      },
      {
        name: "Electricity Service Connection Number (USC)",
        mandatory: true,
        description: "Existing agricultural service number (for verification / maintenance)",
      },
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Farmer identity verification",
      },
    ],
    importantDates: {
      applicationDeadline: "Continuous service throughout the year",
      schemePeriod: "Ongoing 24x7 service",
      isOngoing: true,
      details: "Existing connections receive free supply automatically. New connections processed per Discom timelines.",
    },
    howToApply: {
      summary:
        "Existing agricultural connections in Telangana are automatically eligible and billed under zero-tariff. New agricultural connections can be applied for via the official TSSPDCL/TSNPDCL portal or local Sub-Division office.",
      steps: [
        "Existing connections need no fresh application — zero-tariff is applied automatically by the Discom.",
        "For a new agricultural connection, visit the official TSSPDCL (tssspdcl.com) or TSNPDCL (tsnpdcl.in) portal.",
        "Navigate to 'LT New Connection' and choose Category LT-V (Agricultural).",
        "Upload Pattadar passbook, Aadhaar card, and borehole certificate.",
        "Pay the nominal registration / developmental fee as prescribed by the Electricity Regulatory Commission.",
      ],
      portalName: "Telangana Discoms Portal (TSSPDCL / TSNPDCL)",
      officialPortalUrl: "https://www.tssspdcl.com/",
      note: "Free power is strictly meant for agricultural pumpsets. Installation of energy-efficient pump-sets with capacitors is encouraged.",
    },
    officialWebsite: "https://www.tssspdcl.com/",
    officialApplicationUrl: "https://www.tssspdcl.com/",
    helpline: {
      number: "1912",
      label: "Telangana Power Customer Service Toll-Free Helpline (TSSPDCL/TSNPDCL)",
      hours: "Available 24x7 for power complaints and enquiries",
    },
    source: {
      name: "Government of Telangana Energy Dept & TSSPDCL",
      url: "https://www.tssspdcl.com/",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["State", "Active", "Telangana", "Free Electricity", "Irrigation"],
    isPotentiallyEligible: false,
  },
  {
    id: "pmksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) - Per Drop More Crop",
    shortName: "PMKSY (Per Drop More Crop)",
    shortDescription:
      "Capital subsidy on drip and sprinkler micro-irrigation systems to improve water-use efficiency, boost crop yields, and reduce fertilizer wash-off.",
    governmentLevel: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
    department: "Department of Agriculture & Farmers Welfare / Ministry of Jal Shakti",
    stateName: "All Participating States",
    status: "active",
    categories: ["Micro-Irrigation", "Subsidy", "Water Conservation"],
    crops: ["Horticulture", "Vegetables", "Cotton", "Sugarcane", "Chilli", "All Crops"],
    benefit: {
      headline: "Up to 55% - 90% capital subsidy on micro-irrigation equipment",
      description:
        "Financial assistance on drip and sprinkler systems: 55% subsidy for small and marginal farmers and 45% for other farmers under central norms, with state top-ups (up to 80-100% for SC/ST and small farmers in Telangana/AP).",
      amountOrSubsidy: "55% - 90% capital subsidy",
      paymentFrequency: "One-time capital subsidy per installation",
    },
    eligibility: {
      targetBeneficiaries: [
        "All categories of farmers owning cultivable agricultural land",
        "Farmers with an assured irrigation water source (borewell, open well, farm pond, lift irrigation)",
        "Priority given to small, marginal, women, and SC/ST farmers",
      ],
      landholdingRequirement:
        "Minimum 0.5 acre to maximum 5 hectares cultivable land suitable for micro-irrigation layout.",
      locationState: "All Indian States and Union Territories",
      incomeOrExclusions: [
        "Land parcels that have received micro-irrigation subsidy in the past 7-10 years (as per state lock-in period)",
        "Lands without an assured and functional water source",
      ],
      otherConditions: [
        "Micro-irrigation equipment must be procured from BIS-approved registered manufacturers",
        "Field inspection by the Horticulture/Agriculture Officer before and after system installation",
      ],
    },
    documents: [
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Farmer identity verification",
      },
      {
        name: "Pattadar Passbook / Land Record (RoR / 1-B)",
        mandatory: true,
        description: "Proof of land ownership and extent of cultivable area",
      },
      {
        name: "Water Source & Electricity Availability Certificate",
        mandatory: true,
        description: "Certificate of borewell/well and energized pumpset from local authority",
      },
      {
        name: "Bank Account Passbook",
        mandatory: true,
        description: "Bank details for Direct Benefit Transfer of eligible subsidy amount",
      },
    ],
    importantDates: {
      applicationDeadline: "Annual district target-based allocations (Check state portal for active window)",
      schemePeriod: "Annual financial year allocations",
      isOngoing: true,
      details: "Applications are processed on a first-come, first-served basis within allocated district budgets.",
    },
    howToApply: {
      summary:
        "Farmers apply online through their respective State Micro Irrigation Project portal (e.g., TSMIP in Telangana, APMIP in Andhra Pradesh) or visit the District Horticulture Office.",
      steps: [
        "Visit your State Micro Irrigation portal or the central PMKSY portal (pmksy.gov.in).",
        "Select your District, Mandal, Village, and enter Pattadar passbook details.",
        "Choose the preferred micro-irrigation system type (Drip Irrigation or Sprinkler) and crop details.",
        "Select an empanelled BIS-approved micro-irrigation manufacturing company.",
        "Submit required documents; the field officer inspects the site and prepares the hydraulic design estimate.",
        "Pay the farmer contribution share online or via demand draft; the system is installed and geo-tagged.",
      ],
      portalName: "PMKSY Official Portal / State Micro Irrigation Portals",
      officialPortalUrl: "https://pmksy.gov.in/",
      note: "Empanelled manufacturers provide 3-5 years of post-installation maintenance and warranty support.",
    },
    officialWebsite: "https://pmksy.gov.in/",
    officialApplicationUrl: "https://pmksy.gov.in/",
    helpline: {
      number: "011-23382012",
      label: "PMKSY Central Helpdesk (National Kisan Call Centre: 1800-180-1551)",
      hours: "9:30 AM - 6:00 PM on working days",
    },
    source: {
      name: "PMKSY Official Portal & myScheme",
      url: "https://www.myscheme.gov.in/schemes/pdmc",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["Central", "Active", "Drip Irrigation", "Sprinkler", "Subsidy", "Water Conservation"],
    isPotentiallyEligible: false,
  },
  {
    id: "pm-kmy",
    name: "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
    shortName: "PM-KMY",
    shortDescription:
      "Old-age voluntary pension scheme providing a guaranteed monthly pension of ₹3,000 to small and marginal farmers on attaining 60 years of age.",
    governmentLevel: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
    department: "Department of Agriculture & Farmers Welfare (with Life Insurance Corporation of India)",
    stateName: "All India",
    status: "active",
    categories: ["Pension", "Social Security", "Welfare"],
    crops: ["All Crops"],
    benefit: {
      headline: "Guaranteed ₹3,000 monthly pension on attaining 60 years",
      description:
        "Assured monthly pension of ₹3,000 upon reaching 60 years of age. Farmers contribute ₹55 to ₹200 per month depending on entry age (18-40 years), with a 100% equal matching contribution by the Central Government.",
      amountOrSubsidy: "₹3,000 / month pension",
      paymentFrequency: "Monthly pension after age 60",
    },
    eligibility: {
      targetBeneficiaries: [
        "Small and marginal farmers owning cultivable land up to 2 hectares (5 acres)",
        "Entry age between 18 and 40 years at the time of enrollment",
      ],
      landholdingRequirement:
        "Cultivable landholding up to 2 hectares (5 acres) in the state revenue records.",
      locationState: "All Indian States and Union Territories",
      incomeOrExclusions: [
        "Farmers covered under other statutory social security schemes (NPS, Employees' State Insurance, EPFO)",
        "Income tax payees in any previous assessment year are excluded",
        "Beneficiaries of Pradhan Mantri Shram Yogi Maandhan (PM-SYM) or PM-LVM are not eligible",
      ],
      otherConditions: [
        "Valid savings bank account with auto-debit mandate for monthly contribution",
        "Aadhaar authentication is mandatory",
      ],
    },
    documents: [
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Applicant Aadhaar verification",
      },
      {
        name: "Savings Bank Account Passbook",
        mandatory: true,
        description: "Bank passbook with IFSC code for auto-debit mandate",
      },
      {
        name: "Land Record Document (Pattadar Passbook / RoR)",
        mandatory: true,
        description: "Proof of cultivable landholding up to 2 hectares (5 acres)",
      },
    ],
    importantDates: {
      applicationDeadline: "Continuous enrollment open across all CSC centres",
      schemePeriod: "Lifelong pension after attaining age 60",
      isOngoing: true,
      details: "Enrollment is available throughout the year for farmers aged 18 to 40.",
    },
    howToApply: {
      summary:
        "Farmers can self-enroll online at the official Maandhan portal or visit any Common Service Centre (CSC) with their Aadhaar and bank passbook.",
      steps: [
        "Visit the nearest Common Service Centre (CSC) or open the official Maandhan portal (maandhan.in).",
        "Select 'Pradhan Mantri Kisan Maandhan Yojana'.",
        "Enter Aadhaar and mobile number to complete authentication.",
        "Provide bank account details and setup the monthly auto-debit mandate.",
        "Sign the auto-generated enrollment cum auto-debit form.",
        "Receive the unique Kisan Pension Card (KPC) number immediately upon verification.",
      ],
      portalName: "Official Maandhan Portal (Government of India / LIC)",
      officialPortalUrl: "https://maandhan.in/",
      note: "In case of subscriber's demise after age 60, the spouse is entitled to 50% family pension (₹1,500/month).",
    },
    officialWebsite: "https://maandhan.in/",
    officialApplicationUrl: "https://maandhan.in/",
    helpline: {
      number: "1800-267-6888",
      label: "Maandhan National Toll-Free Helpline (LIC Support Desk)",
      hours: "Available 24x7",
    },
    source: {
      name: "Maandhan Portal & myScheme",
      url: "https://www.myscheme.gov.in/schemes/pm-kmy",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["Central", "Active", "Pension", "Social Security", "Small & Marginal"],
    isPotentiallyEligible: false,
  },
  {
    id: "agri-infra-fund",
    name: "Agriculture Infrastructure Fund (AIF)",
    shortName: "Agri Infra Fund",
    shortDescription:
      "Medium to long-term debt financing facility providing 3% interest subvention for post-harvest management infrastructure and community farming assets.",
    governmentLevel: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
    department: "Department of Agriculture & Farmers Welfare",
    stateName: "All India",
    status: "active",
    categories: ["Post-Harvest", "Infrastructure", "Interest Subvention", "Credit Guarantee"],
    crops: ["All Agricultural Produce", "Horticulture", "Grains", "Oilseeds", "Pulses"],
    benefit: {
      headline: "3% per annum interest subvention on loans up to ₹2 Crores",
      description:
        "Interest subvention of 3% per annum on term loans up to ₹2 Crores for a maximum tenure of 7 years, along with credit guarantee coverage under CGTMSE for eligible projects.",
      amountOrSubsidy: "3% interest subsidy on loans up to ₹2 Cr",
      paymentFrequency: "Subvention credited for maximum 7 years",
    },
    eligibility: {
      targetBeneficiaries: [
        "Individual farmers, Agri-entrepreneurs, and Start-ups",
        "Farmer Producer Organizations (FPOs), Primary Agricultural Credit Societies (PACS)",
        "Self Help Groups (SHGs), Joint Liability Groups (JLGs)",
      ],
      landholdingRequirement:
        "Owned or registered long-lease land suitable for setting up post-harvest agricultural infrastructure.",
      locationState: "All Indian States and Union Territories",
      incomeOrExclusions: [
        "Ineligible non-agricultural commercial trading units without farm-gate post-harvest linkage",
        "Borrowers categorized as willful defaulters or NPAs by commercial banks",
      ],
      otherConditions: [
        "Project must focus on post-harvest management (cold storage, sorting/grading, ripening chambers, silos, warehouses, e-marketing platforms)",
        "Detailed Project Report (DPR) approved by participating commercial/cooperative lending bank",
      ],
    },
    documents: [
      {
        name: "Detailed Project Report (DPR)",
        mandatory: true,
        description: "Project feasibility report, cost estimates, and financial projections",
      },
      {
        name: "Land Ownership / Registered Lease Deed",
        mandatory: true,
        description: "Document showing clear title or long-term lease for the project site",
      },
      {
        name: "KYC Documents (Aadhaar, PAN Card)",
        mandatory: true,
        description: "Identity and tax identification documents of the applicant or entity",
      },
      {
        name: "Bank Account Details & Past Financial Statements",
        mandatory: true,
        description: "Lending bank account details and credit history",
      },
    ],
    importantDates: {
      applicationDeadline: "Scheme operational through Financial Year 2032-33",
      schemePeriod: "2020-21 to 2032-33",
      isOngoing: true,
      details: "Applications are received and processed continuously on the national portal.",
    },
    howToApply: {
      summary:
        "Applicants register and submit their project application online on the official Agriculture Infrastructure Fund portal (agriinfra.dac.gov.in).",
      steps: [
        "Visit the official AIF portal (agriinfra.dac.gov.in) and register as a Beneficiary.",
        "Fill out applicant details, entity type, and proposed post-harvest project category.",
        "Upload the Detailed Project Report (DPR), land documents, and cost estimates.",
        "Select your preferred participating commercial or cooperative lending bank.",
        "The application is reviewed by the Ministry Project Monitoring Unit and forwarded to the chosen bank for loan sanction.",
      ],
      portalName: "Agriculture Infrastructure Fund Official Portal",
      officialPortalUrl: "https://agriinfra.dac.gov.in/",
      note: "Interest subvention and credit guarantee fee benefits are routed directly through the lending bank upon loan disbursement.",
    },
    officialWebsite: "https://agriinfra.dac.gov.in/",
    officialApplicationUrl: "https://agriinfra.dac.gov.in/",
    helpline: {
      number: "011-23381012",
      label: "AIF National Project Monitoring Unit (PMU)",
      hours: "9:30 AM - 5:30 PM on working days",
    },
    source: {
      name: "Agri Infra DAC Portal & myScheme",
      url: "https://agriinfra.dac.gov.in/",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["Central", "Active", "Post-Harvest", "Cold Storage", "Interest Subsidy"],
    isPotentiallyEligible: false,
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    shortName: "SMAM Machinery Subsidy",
    shortDescription:
      "Capital subsidy of 40% to 50% for procurement of agricultural machinery, tractors, power tillers, rotavators, and establishment of Custom Hiring Centres.",
    governmentLevel: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
    department: "Department of Agriculture & Farmers Welfare",
    stateName: "All Participating States",
    status: "upcoming",
    categories: ["Farm Mechanization", "Equipment Subsidy", "Custom Hiring"],
    crops: ["All Crops", "Paddy", "Cotton", "Maize", "Groundnut", "Wheat"],
    benefit: {
      headline: "40% to 50% capital subsidy on farm equipment & machinery",
      description:
        "Subsidy of 40% to 50% on cost of approved agricultural implements (tractors, power tillers, rotavators, multi-crop threshers, happy seeders) for small, marginal, SC/ST, and women farmers.",
      amountOrSubsidy: "40% - 50% capital subsidy",
      paymentFrequency: "Per approved equipment purchase sanction",
    },
    eligibility: {
      targetBeneficiaries: [
        "Individual farmers with valid agricultural land title",
        "Special priority for small, marginal, SC, ST, and women farmers (eligible for highest 50% subsidy band)",
        "Farmer groups, FPOs, and village cooperatives establishing Custom Hiring Centres (CHCs)",
      ],
      landholdingRequirement:
        "Valid cultivable landholding recorded in the state revenue records.",
      locationState: "All Participating States and Union Territories",
      incomeOrExclusions: [
        "Applicants who have availed government subsidy for the same equipment type in the previous 5-7 years",
        "Purchases of non-approved or un-tested machinery models outside the approved DBT equipment catalog",
      ],
      otherConditions: [
        "Equipment must be purchased strictly after receipt of the official pre-sanction order",
        "Machinery must be inspected and geo-tagged by the Agriculture / Horticulture Engineering Department",
      ],
    },
    documents: [
      {
        name: "Aadhaar Card",
        mandatory: true,
        description: "Farmer identity verification",
      },
      {
        name: "Pattadar Passbook / Land Record (RoR / Khatauni)",
        mandatory: true,
        description: "Proof of agricultural land ownership",
      },
      {
        name: "Bank Account Passbook / Cancelled Cheque",
        mandatory: true,
        description: "Bank details for Direct Benefit Transfer of approved subsidy amount",
      },
      {
        name: "Caste / Category Certificate (if applicable)",
        mandatory: false,
        description: "Required to claim enhanced 50% subsidy rate for SC/ST categories",
      },
    ],
    importantDates: {
      applicationDeadline: "Next seasonal window opening soon (Check official portal for portal opening dates)",
      schemePeriod: "State-wise seasonal application windows",
      isOngoing: false,
      details: "State agriculture departments announce seasonal online registration windows on the portal.",
    },
    howToApply: {
      summary:
        "Farmers register on the DBT in Agriculture Mechanization portal (agrimachinery.nic.in), submit required documents, and select equipment model.",
      steps: [
        "Visit the official DBT in Agriculture Mechanization portal (agrimachinery.nic.in).",
        "Click on 'Registration' -> 'Farmer' and enter your Aadhaar and mobile number.",
        "Select your State, District, Mandal, Village, and enter land record details.",
        "Select the agricultural implement/equipment category and the authorized dealer/manufacturer.",
        "Wait for the Department of Agriculture to issue the Pre-Sanction Order.",
        "Purchase the approved machinery from the authorized dealer, complete field physical verification/geo-tagging, and subsidy is released via DBT.",
      ],
      portalName: "DBT in Agriculture Mechanization Official Portal",
      officialPortalUrl: "https://agrimachinery.nic.in/",
      note: "Do not purchase machinery before obtaining the pre-sanction order; un-approved purchases cannot be reimbursed.",
    },
    officialWebsite: "https://agrimachinery.nic.in/",
    officialApplicationUrl: "https://agrimachinery.nic.in/",
    helpline: {
      number: "011-23382012",
      label: "Mechanization & Technology Division Helpdesk (Kisan Call Centre: 1800-180-1551)",
      hours: "9:30 AM - 5:30 PM on working days",
    },
    source: {
      name: "agrimachinery.nic.in & myScheme",
      url: "https://agrimachinery.nic.in/",
      verifiedAt: "2026-03-15",
    },
    lastVerified: "March 2026",
    tags: ["Central", "Upcoming", "Machinery", "Equipment Subsidy", "Mechanization"],
    isPotentiallyEligible: false,
  },
];

export const governmentSchemesService = {
  /**
   * Retrieves verified government schemes with optional filtering and search
   */
  getSchemes: async (filters?: {
    filter?: SchemeFilterType;
    search?: string;
  }): Promise<GovernmentScheme[]> => {
    let result = [...VERIFIED_GOVERNMENT_SCHEMES];

    // Filter by Tab/Chip: All, Active, Upcoming, Central, State
    if (filters?.filter && filters.filter !== "all") {
      switch (filters.filter) {
        case "active":
          result = result.filter((s) => s.status === "active");
          break;
        case "upcoming":
          result = result.filter((s) => s.status === "upcoming");
          break;
        case "central":
          result = result.filter((s) => s.governmentLevel === "central");
          break;
        case "state":
          result = result.filter((s) => s.governmentLevel === "state");
          break;
        default:
          break;
      }
    }

    // Search against scheme name, ministry/department, crop/category, state/central, and keywords
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((s) => {
        const inName = s.name.toLowerCase().includes(q) || (s.shortName?.toLowerCase().includes(q) ?? false);
        const inMinistry = s.ministry.toLowerCase().includes(q) || (s.department?.toLowerCase().includes(q) ?? false);
        const inDescription = s.shortDescription.toLowerCase().includes(q);
        const inCrops = s.crops.some((c) => c.toLowerCase().includes(q));
        const inCategories = s.categories.some((cat) => cat.toLowerCase().includes(q));
        const inLevel = s.governmentLevel.toLowerCase().includes(q);
        const inState = s.stateName ? s.stateName.toLowerCase().includes(q) : false;
        const inTags = s.tags.some((tag) => tag.toLowerCase().includes(q));
        return inName || inMinistry || inDescription || inCrops || inCategories || inLevel || inState || inTags;
      });
    }

    return result;
  },

  /**
   * Retrieves a single scheme by its unique ID
   */
  getSchemeById: async (id: string): Promise<GovernmentScheme | undefined> => {
    return VERIFIED_GOVERNMENT_SCHEMES.find((s) => s.id === id);
  },

  /**
   * Informational Profile-Based Eligibility Helper.
   * Compares farmer profile information against criteria and returns a helpful assessment.
   * Strictly disclaims that RaituSevak360 does not determine official eligibility.
   */
  checkEligibility: async (
    schemeId: string,
    userContext?: {
      hasLand?: boolean;
      state?: string;
      isFarmer?: boolean;
      crops?: string[];
    }
  ): Promise<SchemeEligibilityEvaluation> => {
    const scheme = VERIFIED_GOVERNMENT_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) {
      throw new Error(`Scheme with ID ${schemeId} not found.`);
    }

    const matchedCriteria: string[] = [];
    const pendingReviewCriteria: string[] = [];

    // Evaluates farmer profile indicators informationally
    const isFarmer = userContext?.isFarmer !== false;
    const hasLand = userContext?.hasLand !== false;
    const userState = userContext?.state || "Telangana";

    if (isFarmer) {
      matchedCriteria.push("Identified as an active agricultural farmer in RaituSevak360");
    }

    if (hasLand) {
      matchedCriteria.push("Reported agricultural landholder profile");
    } else {
      pendingReviewCriteria.push("Requires landholder passbook or verified tenancy documentation");
    }

    if (scheme.governmentLevel === "central") {
      matchedCriteria.push("Central scheme applies to Indian farmers across states");
    } else if (scheme.stateName && userState.toLowerCase().includes("telangana")) {
      matchedCriteria.push(`Location matched for ${scheme.stateName} state scheme`);
    } else {
      pendingReviewCriteria.push(`State-specific eligibility requires residence in ${scheme.stateName || "notified state"}`);
    }

    // Additional official conditions that need direct government verification
    scheme.eligibility.otherConditions.forEach((cond) => {
      pendingReviewCriteria.push(`Requires official verification: ${cond}`);
    });

    const isPotentiallyEligible = matchedCriteria.length >= 2 && scheme.status === "active";

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      isPotentiallyEligible,
      matchedCriteria,
      pendingReviewCriteria,
      summary: isPotentiallyEligible
        ? "Based on your local RaituSevak360 profile, you appear to meet initial baseline criteria."
        : "Additional documentation or official state verification is required.",
      disclaimer:
        "INFORMATIONAL NOTICE: This evaluation is an automated helper based on your RaituSevak360 profile information. RaituSevak360 is NOT a government agency and does not issue official government determinations. Final eligibility, sanction, and subsidy disbursal are determined exclusively by the concerned Government Department or Ministry upon official application.",
    };
  },

  /**
   * Count of schemes the user may be potentially eligible for (matching Figma banner: 3)
   */
  getPotentialEligibleCount: async (): Promise<number> => {
    return VERIFIED_GOVERNMENT_SCHEMES.filter((s) => s.isPotentiallyEligible).length;
  },
};

export default governmentSchemesService;
