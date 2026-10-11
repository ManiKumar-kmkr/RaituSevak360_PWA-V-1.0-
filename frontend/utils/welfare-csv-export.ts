import { WelfareProgrammeReport } from "@/types/welfare-report";

/**
 * Escapes a single CSV cell value according to RFC-4180 rules
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  // Check if string contains comma, quote, or newline
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates RFC-4180 compliant CSV string for filtered welfare programme reports
 * Excludes sensitive identity, bank, or private personal data
 */
export function generateWelfareReportsCsv(programmes: WelfareProgrammeReport[]): string {
  const headers = [
    "Programme Reference",
    "Programme Name",
    "Category",
    "Reporting Period",
    "Districts Covered",
    "Target Beneficiaries",
    "Registered Beneficiaries",
    "Approved Applications",
    "Benefits Distributed",
    "Pending Applications",
    "Allocated Budget (INR)",
    "Approved Budget (INR)",
    "Disbursed Budget (INR)",
    "Last Updated",
    "Data Source",
  ];

  const rows = programmes.map((p) => [
    p.id,
    p.name,
    p.categoryLabel,
    p.reportingPeriod,
    p.districtsCovered.join("; "),
    p.targetBeneficiaries,
    p.registeredBeneficiaries,
    p.approvedApplications,
    p.benefitsDistributed,
    p.pendingApplications,
    p.allocatedBudgetRupees,
    p.approvedBudgetRupees,
    p.disbursedBudgetRupees,
    p.lastUpdated,
    p.dataSource,
  ]);

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return csvLines.join("\r\n");
}

/**
 * Generates RFC-4180 compliant CSV string for detailed mandal breakdown of a programme
 */
export function generateMandalBreakdownCsv(programme: WelfareProgrammeReport): string {
  const headers = [
    "Programme Reference",
    "Programme Name",
    "District",
    "Mandal",
    "Target Beneficiaries",
    "Registered Beneficiaries",
    "Approved Applications",
    "Benefits Distributed",
    "Pending Applications",
  ];

  const rows = programme.mandalBreakdown.map((m) => [
    programme.id,
    programme.name,
    m.district,
    m.mandal,
    m.targetCount,
    m.registeredCount,
    m.approvedCount,
    m.distributedCount,
    m.pendingCount,
  ]);

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return csvLines.join("\r\n");
}

/**
 * Client-side file download trigger
 */
export function triggerCsvDownload(csvContent: string, fileName: string): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
