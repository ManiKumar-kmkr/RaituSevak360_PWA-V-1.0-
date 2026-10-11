"use client";

import React, { useState, useMemo } from "react";
import {
  Megaphone,
  AlertTriangle,
  Calendar,
  Building2,
  Bell,
  FileText,
  CheckCircle2,
  Download,
  Search,
  ExternalLink,
  ShieldAlert,
  Plus,
  Clock,
  MapPin,
  Users,
  Archive,
  Edit3,
  X,
  Send,
  AlertOctagon,
  ArrowRight,
  Filter,
  Check,
  RotateCcw,
  History,
  Radio,
  Flame,
  CloudRain,
  Eye,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

export type AnnouncementStatus = "published" | "draft" | "scheduled" | "archived";
export type AnnouncementPriority = "normal" | "important" | "urgent" | "emergency";
export type AnnouncementCategory =
  | "Emergency Alert"
  | "Welfare Update"
  | "Crop Advisory"
  | "Government Notice"
  | "Weather Alert";

export type EmergencyType =
  | "Weather"
  | "Flood"
  | "Cyclone"
  | "Drought"
  | "Pest Outbreak"
  | "Disease Outbreak";

export type EmergencySeverity = "Warning" | "High" | "Critical";

export interface AnnouncementHistoryItem {
  action: "Created" | "Edited" | "Scheduled" | "Published" | "Archived" | "Restored";
  timestamp: string;
  actor: string;
  note?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: AnnouncementCategory;
  description: string;
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  targetAudience: "All Farmers" | "Selected Districts" | "Selected Mandals" | "Registered Beneficiaries";
  district: string;
  mandal?: string;
  publishDate: string;
  expiryDate?: string;
  lastUpdated: string;
  circularNo: string;
  isEmergency?: boolean;
  emergencyType?: EmergencyType;
  severity?: EmergencySeverity;
  history: AnnouncementHistoryItem[];
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ANN-2026-001",
    title: "Heavy Rainfall & High-Speed Gale Warning for Coastal AP",
    category: "Emergency Alert",
    description:
      "Deep depression in west-central Bay of Bengal intensifying into severe cyclonic system. Gusty winds of 65-80 km/h and intense downpours forecast across coastal districts. Cultivators are advised to immediately clear field drainage bunds and safeguard harvested grain bags.",
    status: "published",
    priority: "emergency",
    targetAudience: "Selected Districts",
    district: "Krishna, Guntur, West Godavari",
    mandal: "All coastal mandals",
    publishDate: "2026-10-08",
    expiryDate: "2026-10-12",
    lastUpdated: "Today, 08:30 AM",
    circularNo: "DIS-AP/MET-2026/410",
    isEmergency: true,
    emergencyType: "Cyclone",
    severity: "Critical",
    history: [
      {
        action: "Created",
        timestamp: "08 Oct 2026, 06:15 AM",
        actor: "State Disaster Management Liaison",
      },
      {
        action: "Published",
        timestamp: "08 Oct 2026, 07:00 AM",
        actor: "District Collectorate (Agri Emergency Cell)",
        note: "Broadcasted with High Alert priority to coastal Rythu Bharosa Kendras",
      },
    ],
  },
  {
    id: "ANN-2026-002",
    title: "Kharif 2026 PMFBY Crop Insurance Enrollment Deadline Extension",
    category: "Welfare Update",
    description:
      "Cut-off date for non-loanee and tenant farmers under the Pradhan Mantri Fasal Bima Yojana (PMFBY) extended up to 20 October 2026. Electronic verification of e-crop registration and premium collection enabled at all village Rythu Bharosa Kendras without penalty charges.",
    status: "published",
    priority: "important",
    targetAudience: "All Farmers",
    district: "All 26 Districts",
    publishDate: "2026-10-05",
    expiryDate: "2026-10-20",
    lastUpdated: "05 Oct 2026",
    circularNo: "AGRI/PMFBY-REV/2026/89",
    history: [
      {
        action: "Created",
        timestamp: "04 Oct 2026, 03:00 PM",
        actor: "Directorate of Agricultural Insurance",
      },
      {
        action: "Published",
        timestamp: "05 Oct 2026, 09:30 AM",
        actor: "Secretariat Agri Desk",
      },
    ],
  },
  {
    id: "ANN-2026-003",
    title: "Subsidized Micro-Irrigation & Drip Kit Application Verification",
    category: "Government Notice",
    description:
      "Verification window opened for Rythu Bharosa Kendras (RBKs) to process verified small & marginal farmer applications for 90% subsidy drip systems under the AP Micro Irrigation Project (APMIP). Field inspection tokens issued sequentially.",
    status: "published",
    priority: "normal",
    targetAudience: "Registered Beneficiaries",
    district: "Guntur, Kurnool, Prakasam",
    publishDate: "2026-10-02",
    expiryDate: "2026-10-25",
    lastUpdated: "02 Oct 2026",
    circularNo: "AGRI/IRR-SUB/2026/42",
    history: [
      {
        action: "Created",
        timestamp: "01 Oct 2026, 11:20 AM",
        actor: "APMIP Engineering Wing",
      },
      {
        action: "Published",
        timestamp: "02 Oct 2026, 10:00 AM",
        actor: "Horticulture Commissionerate",
      },
    ],
  },
  {
    id: "ANN-2026-004",
    title: "Pink Bollworm Larval Outbreak Alert & Pheromone Trap Directive",
    category: "Crop Advisory",
    description:
      "Mandatory installation of pheromone traps (5 traps per acre) across cotton-growing belts in Kurnool and Anantapur to detect PBW moth emergence before square formation. Bio-control trichocards distributed at 75% subsidized rate.",
    status: "scheduled",
    priority: "urgent",
    targetAudience: "Selected Districts",
    district: "Kurnool, Anantapur",
    mandal: "Adoni, Alur, Pattikonda",
    publishDate: "2026-10-15",
    expiryDate: "2026-11-15",
    lastUpdated: "06 Oct 2026",
    circularNo: "DPPQ/SURV/PBW-2026/18",
    history: [
      {
        action: "Created",
        timestamp: "06 Oct 2026, 02:40 PM",
        actor: "Directorate of Plant Protection",
      },
      {
        action: "Scheduled",
        timestamp: "06 Oct 2026, 04:00 PM",
        actor: "State IPM Coordinator",
        note: "Auto-broadcast scheduled for Kharif 45-day flowering mark",
      },
    ],
  },
  {
    id: "ANN-2026-005",
    title: "District Farmer Welfare & DBT Direct Settlement Schedule (Phase 2)",
    category: "Welfare Update",
    description:
      "Mandal revenue teams must finish land record aadhaar-linkage validations before 18 October 2026 to ensure uninterrupted credit flow to cultivators under Rythu Bharosa seasonal input assistance.",
    status: "draft",
    priority: "important",
    targetAudience: "All Farmers",
    district: "Guntur, Krishna",
    publishDate: "2026-10-18",
    expiryDate: "2026-10-30",
    lastUpdated: "07 Oct 2026",
    circularNo: "DRAFT-FIN/DBT/2026/102",
    history: [
      {
        action: "Created",
        timestamp: "07 Oct 2026, 05:10 PM",
        actor: "Finance Welfare Liaison",
        note: "Drafted pending final treasury sanction order",
      },
    ],
  },
  {
    id: "ANN-2026-006",
    title: "Brown Plant Hopper (BPH) Early Warning in Godavari Delta",
    category: "Crop Advisory",
    description:
      "Continuous overcast skies and high relative humidity have triggered nymph population build-up in paddy fields. Advise farmers to monitor water level, avoid excessive nitrogenous top-dressing, and create alleyways in fields.",
    status: "draft",
    priority: "normal",
    targetAudience: "Selected Mandals",
    district: "West Godavari",
    mandal: "Tanuku, Palakollu, Narsapur",
    publishDate: "2026-10-22",
    expiryDate: "2026-11-10",
    lastUpdated: "08 Oct 2026",
    circularNo: "DRAFT-AGRI/BPH/2026/04",
    history: [
      {
        action: "Created",
        timestamp: "08 Oct 2026, 11:30 AM",
        actor: "District Agronomist",
        note: "Awaiting final field count verification from Tanuku research station",
      },
    ],
  },
];

export default function GovtAnnouncementsHub() {
  const { t } = useTranslation();

  // Core State
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);

  // Confirmations
  const [confirmPublishTarget, setConfirmPublishTarget] = useState<AnnouncementItem | null>(null);
  const [confirmCriticalAlertData, setConfirmCriticalAlertData] = useState<any | null>(null);
  const [confirmArchiveTarget, setConfirmArchiveTarget] = useState<AnnouncementItem | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Standard Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<AnnouncementCategory>("Government Notice");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<AnnouncementPriority>("normal");
  const [formTargetAudience, setFormTargetAudience] = useState<
    "All Farmers" | "Selected Districts" | "Selected Mandals" | "Registered Beneficiaries"
  >("All Farmers");
  const [formDistrict, setFormDistrict] = useState("All 26 Districts");
  const [formMandal, setFormMandal] = useState("");
  const [formPublishDate, setFormPublishDate] = useState(new Date().toISOString().slice(0, 10));
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Emergency Form State
  const [emTitle, setEmTitle] = useState("");
  const [emType, setEmType] = useState<EmergencyType>("Weather");
  const [emDistricts, setEmDistricts] = useState("Krishna, Guntur, West Godavari");
  const [emMandals, setEmMandals] = useState("All Coastal Mandals");
  const [emSeverity, setEmSeverity] = useState<EmergencySeverity>("Warning");
  const [emMessage, setEmMessage] = useState("");
  const [emStartTime, setEmStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [emEndTime, setEmEndTime] = useState("");
  const [emError, setEmError] = useState<string | null>(null);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const published = announcements.filter((a) => a.status === "published").length;
    const drafts = announcements.filter((a) => a.status === "draft").length;
    const scheduled = announcements.filter((a) => a.status === "scheduled").length;
    const emergency = announcements.filter(
      (a) => a.status === "published" && (a.isEmergency || a.priority === "emergency" || a.category === "Emergency Alert")
    ).length;
    return { published, drafts, scheduled, emergency };
  }, [announcements]);

  // Filtered List
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      // Exclude archived by default unless specifically selected
      if (statusFilter === "all" && item.status === "archived") return false;
      if (statusFilter !== "all") {
        if (statusFilter === "emergency") {
          const isEm = item.isEmergency || item.priority === "emergency" || item.category === "Emergency Alert";
          if (!isEm) return false;
        } else if (item.status !== statusFilter) {
          return false;
        }
      }

      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.circularNo.toLowerCase().includes(q) ||
          (item.mandal && item.mandal.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [announcements, statusFilter, categoryFilter, searchQuery]);

  // Open Edit Form
  const handleOpenEdit = (ann: AnnouncementItem) => {
    setEditingItem(ann);
    setFormTitle(ann.title);
    setFormCategory(ann.category);
    setFormDescription(ann.description);
    setFormPriority(ann.priority);
    setFormTargetAudience(ann.targetAudience);
    setFormDistrict(ann.district);
    setFormMandal(ann.mandal || "");
    setFormPublishDate(ann.publishDate);
    setFormExpiryDate(ann.expiryDate || "");
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("Government Notice");
    setFormDescription("");
    setFormPriority("normal");
    setFormTargetAudience("All Farmers");
    setFormDistrict("All 26 Districts");
    setFormMandal("");
    setFormPublishDate(new Date().toISOString().slice(0, 10));
    setFormExpiryDate("");
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Open Emergency Form
  const handleOpenEmergency = () => {
    setEmTitle("");
    setEmType("Weather");
    setEmDistricts("Krishna, Guntur, West Godavari");
    setEmMandals("Coastal Mandals");
    setEmSeverity("High");
    setEmMessage("");
    setEmStartTime(new Date().toISOString().slice(0, 16));
    setEmEndTime("");
    setEmError(null);
    setIsEmergencyModalOpen(true);
  };

  // Validate Standard Form
  const validateForm = (): boolean => {
    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return false;
    }
    if (!formCategory) {
      setFormError("Category is required.");
      return false;
    }
    if (!formDescription.trim()) {
      setFormError("Description is required.");
      return false;
    }
    if (!formPublishDate) {
      setFormError("Publish date is required.");
      return false;
    }
    if (formExpiryDate && formPublishDate && formExpiryDate < formPublishDate) {
      setFormError("Expiry date cannot be before publish date.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Save as Draft
  const handleSaveDraft = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (editingItem) {
      // Update existing item
      const updated: AnnouncementItem = {
        ...editingItem,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        priority: formPriority,
        targetAudience: formTargetAudience,
        district: formDistrict.trim(),
        mandal: formMandal.trim() || undefined,
        publishDate: formPublishDate,
        expiryDate: formExpiryDate.trim() || undefined,
        status: "draft",
        lastUpdated: "Just now",
        history: [
          {
            action: "Edited",
            timestamp: `${todayStr}, ${timeNow}`,
            actor: "Government Desk",
            note: "Updated and saved as Draft",
          },
          ...editingItem.history,
        ],
      };
      setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (selectedAnnouncement?.id === updated.id) setSelectedAnnouncement(updated);
      showToast("Draft updated successfully.");
    } else {
      // Create new draft
      const newDraft: AnnouncementItem = {
        id: `ANN-${new Date().getFullYear()}-${String(announcements.length + 1).padStart(3, "0")}`,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        priority: formPriority,
        targetAudience: formTargetAudience,
        district: formDistrict.trim(),
        mandal: formMandal.trim() || undefined,
        publishDate: formPublishDate,
        expiryDate: formExpiryDate.trim() || undefined,
        status: "draft",
        lastUpdated: "Just now",
        circularNo: `DRAFT-CIR/${new Date().getFullYear()}/${String(announcements.length + 1).padStart(3, "0")}`,
        history: [
          {
            action: "Created",
            timestamp: `${todayStr}, ${timeNow}`,
            actor: "Government Desk",
            note: "Saved as Draft",
          },
        ],
      };
      setAnnouncements((prev) => [newDraft, ...prev]);
      showToast("New draft saved successfully.");
    }

    setIsFormModalOpen(false);
  };

  // Trigger Publish or Schedule from Standard Form
  const handleFormPublishOrSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const isFuture = formPublishDate > todayStr;

    const targetItem: AnnouncementItem = {
      id: editingItem ? editingItem.id : `ANN-${new Date().getFullYear()}-${String(announcements.length + 1).padStart(3, "0")}`,
      title: formTitle.trim(),
      category: formCategory,
      description: formDescription.trim(),
      priority: formPriority,
      targetAudience: formTargetAudience,
      district: formDistrict.trim(),
      mandal: formMandal.trim() || undefined,
      publishDate: formPublishDate,
      expiryDate: formExpiryDate.trim() || undefined,
      status: isFuture ? "scheduled" : "published",
      lastUpdated: "Just now",
      circularNo: editingItem
        ? editingItem.circularNo.startsWith("DRAFT")
          ? `CIR-AGRI/${new Date().getFullYear()}/${String(announcements.length + 1).padStart(3, "0")}`
          : editingItem.circularNo
        : `CIR-AGRI/${new Date().getFullYear()}/${String(announcements.length + 1).padStart(3, "0")}`,
      history: editingItem ? editingItem.history : [],
    };

    if (isFuture) {
      // Direct Schedule
      const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const scheduledItem: AnnouncementItem = {
        ...targetItem,
        status: "scheduled",
        history: [
          {
            action: "Scheduled",
            timestamp: `${todayStr}, ${timeNow}`,
            actor: "Government Desk",
            note: `Scheduled to go live on ${formPublishDate}`,
          },
          ...targetItem.history,
        ],
      };

      if (editingItem) {
        setAnnouncements((prev) => prev.map((a) => (a.id === scheduledItem.id ? scheduledItem : a)));
      } else {
        setAnnouncements((prev) => [scheduledItem, ...prev]);
      }
      if (selectedAnnouncement?.id === scheduledItem.id) setSelectedAnnouncement(scheduledItem);
      setIsFormModalOpen(false);
      showToast(`Announcement scheduled to publish on ${formPublishDate}.`);
    } else {
      // Needs Confirmation
      setIsFormModalOpen(false);
      setConfirmPublishTarget(targetItem);
    }
  };

  // Confirm Publish
  const handleConfirmPublish = () => {
    if (!confirmPublishTarget) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const publishedItem: AnnouncementItem = {
      ...confirmPublishTarget,
      status: "published",
      publishDate: todayStr,
      lastUpdated: "Just now",
      history: [
        {
          action: "Published",
          timestamp: `${todayStr}, ${timeNow}`,
          actor: "Government Desk",
          note: "Official broadcast published live to farmers",
        },
        ...confirmPublishTarget.history,
      ],
    };

    const exists = announcements.some((a) => a.id === publishedItem.id);
    if (exists) {
      setAnnouncements((prev) => prev.map((a) => (a.id === publishedItem.id ? publishedItem : a)));
    } else {
      setAnnouncements((prev) => [publishedItem, ...prev]);
    }
    if (selectedAnnouncement?.id === publishedItem.id) setSelectedAnnouncement(publishedItem);

    setConfirmPublishTarget(null);
    showToast(`Official Announcement "${publishedItem.title}" published live!`);
  };

  // Emergency Alert Submission
  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emTitle.trim()) {
      setEmError("Emergency alert title is required.");
      return;
    }
    if (!emMessage.trim()) {
      setEmError("Emergency message is required.");
      return;
    }
    setEmError(null);

    const alertData = {
      title: emTitle.trim(),
      emergencyType: emType,
      affectedDistricts: emDistricts.trim(),
      affectedMandals: emMandals.trim(),
      severity: emSeverity,
      message: emMessage.trim(),
      startTime: emStartTime,
      endTime: emEndTime.trim(),
    };

    if (emSeverity === "Critical") {
      // Requires Critical Confirmation
      setIsEmergencyModalOpen(false);
      setConfirmCriticalAlertData(alertData);
    } else {
      publishEmergencyAlert(alertData);
      setIsEmergencyModalOpen(false);
    }
  };

  const publishEmergencyAlert = (data: any) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newEmergencyItem: AnnouncementItem = {
      id: `ANN-EMG-${new Date().getFullYear()}-${String(announcements.length + 1).padStart(3, "0")}`,
      title: data.title,
      category: "Emergency Alert",
      description: data.message,
      priority: data.severity === "Critical" ? "emergency" : "urgent",
      targetAudience: "Selected Districts",
      district: data.affectedDistricts,
      mandal: data.affectedMandals,
      publishDate: todayStr,
      expiryDate: data.endTime ? data.endTime.slice(0, 10) : undefined,
      lastUpdated: "Just now",
      circularNo: `DIS-EMG/${new Date().getFullYear()}/${String(announcements.length + 1).padStart(3, "0")}`,
      isEmergency: true,
      emergencyType: data.emergencyType,
      severity: data.severity,
      status: "published",
      history: [
        {
          action: "Created",
          timestamp: `${todayStr}, ${timeNow}`,
          actor: "State Emergency Desk",
        },
        {
          action: "Published",
          timestamp: `${todayStr}, ${timeNow}`,
          actor: "Disaster Response Command",
          note: `Broadcasted as ${data.severity} emergency alert across ${data.affectedDistricts}`,
        },
      ],
    };

    setAnnouncements((prev) => [newEmergencyItem, ...prev]);
    showToast(`Emergency alert broadcasted with ${data.severity} priority.`);
  };

  // Archive Item
  const handleConfirmArchive = () => {
    if (!confirmArchiveTarget) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const archivedItem: AnnouncementItem = {
      ...confirmArchiveTarget,
      status: "archived",
      lastUpdated: "Just now",
      history: [
        {
          action: "Archived",
          timestamp: `${todayStr}, ${timeNow}`,
          actor: "Government Desk",
          note: "Archived from active broadcast stream",
        },
        ...confirmArchiveTarget.history,
      ],
    };

    setAnnouncements((prev) => prev.map((a) => (a.id === archivedItem.id ? archivedItem : a)));
    if (selectedAnnouncement?.id === archivedItem.id) setSelectedAnnouncement(archivedItem);
    setConfirmArchiveTarget(null);
    showToast("Announcement moved to archive.");
  };

  // Restore Archived Item
  const handleRestoreArchived = (ann: AnnouncementItem) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const restored: AnnouncementItem = {
      ...ann,
      status: "draft",
      lastUpdated: "Just now",
      history: [
        {
          action: "Restored",
          timestamp: `${todayStr}, ${timeNow}`,
          actor: "Government Desk",
          note: "Restored from archive to Draft state",
        },
        ...ann.history,
      ],
    };

    setAnnouncements((prev) => prev.map((a) => (a.id === restored.id ? restored : a)));
    if (selectedAnnouncement?.id === restored.id) setSelectedAnnouncement(restored);
    showToast("Announcement restored to Draft status.");
  };

  // Render Status Badge
  const renderStatusBadge = (status: AnnouncementStatus, isEm?: boolean, severity?: EmergencySeverity) => {
    if (isEm && severity === "Critical") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-300">
          <Flame size={12} className="text-rose-600" />
          Critical Alert
        </span>
      );
    }
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#174D25] border border-emerald-200">
            <Radio size={12} className="text-[#24833A]" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
            <FileText size={12} className="text-amber-600" />
            Draft
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-200">
            <Clock size={12} className="text-blue-600" />
            Scheduled
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-700 border border-gray-200">
            <Archive size={12} className="text-gray-500" />
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  // Render Priority Badge
  const renderPriorityBadge = (priority: AnnouncementPriority) => {
    switch (priority) {
      case "emergency":
        return (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
            Emergency
          </span>
        );
      case "urgent":
        return (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            Urgent
          </span>
        );
      case "important":
        return (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            Important
          </span>
        );
      case "normal":
      default:
        return (
          <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-200">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-20">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-xs font-bold text-[#174D25] shadow-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#24833A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STRICT BACK NAVIGATION: EXACTLY ONE VISIBLE BACK CONTROL */}
      {selectedAnnouncement ? (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-announcement-back-to-list"
            onClick={() => setSelectedAnnouncement(null)}
            label={t("govtAnnouncements.backToAnnouncements") || "Back to Announcements"}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-announcement-back-to-dashboard"
            href="/dashboard"
            label={t("common.backToDashboard") || "Back to Dashboard"}
          />
        </div>
      )}

      {/* =========================================================
          VIEW A: ANNOUNCEMENT DETAILS
      ========================================================= */}
      {selectedAnnouncement ? (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
                    selectedAnnouncement.isEmergency
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-[#E4F0DD] text-[#24833A]"
                  }`}
                >
                  {selectedAnnouncement.isEmergency ? (
                    <Flame size={28} strokeWidth={2.4} />
                  ) : (
                    <Megaphone size={28} strokeWidth={2.4} />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {selectedAnnouncement.circularNo}
                    </span>
                    {renderStatusBadge(
                      selectedAnnouncement.status,
                      selectedAnnouncement.isEmergency,
                      selectedAnnouncement.severity
                    )}
                    {renderPriorityBadge(selectedAnnouncement.priority)}
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700">
                      {selectedAnnouncement.category}
                    </span>
                  </div>
                  <h1 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {selectedAnnouncement.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                    <MapPin size={14} className="text-[#24833A]" />
                    <span>Coverage: {selectedAnnouncement.district}</span>
                    {selectedAnnouncement.mandal && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{selectedAnnouncement.mandal}</span>
                      </>
                    )}
                    <span className="text-gray-300">•</span>
                    <Clock size={14} className="text-gray-400" />
                    <span>Updated {selectedAnnouncement.lastUpdated}</span>
                  </p>
                </div>
              </div>

              {/* Contextual Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {selectedAnnouncement.status === "draft" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(selectedAnnouncement)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Draft</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmPublishTarget(selectedAnnouncement)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                    >
                      <Send size={14} />
                      <span>Publish Announcement</span>
                    </button>
                  </>
                )}

                {selectedAnnouncement.status === "scheduled" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(selectedAnnouncement)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Schedule</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmPublishTarget(selectedAnnouncement)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                    >
                      <Send size={14} />
                      <span>Publish Now</span>
                    </button>
                  </>
                )}

                {selectedAnnouncement.status === "published" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(selectedAnnouncement)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Circular</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmArchiveTarget(selectedAnnouncement)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                    >
                      <Archive size={14} />
                      <span>Archive</span>
                    </button>
                  </>
                )}

                {selectedAnnouncement.status === "archived" && (
                  <button
                    type="button"
                    onClick={() => handleRestoreArchived(selectedAnnouncement)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#24833A] bg-[#F4FBF5] px-3.5 py-2 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD] transition cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Restore to Draft</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description & Target Audience Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <FileText size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">Official Notice Body</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                {selectedAnnouncement.description}
              </p>

              {selectedAnnouncement.isEmergency && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-900">
                  <span className="font-bold block uppercase tracking-wide text-rose-700">
                    Emergency Biosecurity Directive:
                  </span>
                  <p className="mt-1 font-medium leading-relaxed">
                    Severity rated as <strong>{selectedAnnouncement.severity}</strong>. Broadcasted to field agriculture teams, RBK village kiosks, and farmer SMS dispatch nodes.
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <Users size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">Targeting & Validity</h2>
              </div>
              <div className="flex flex-col gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Target Audience</span>
                  <p className="font-semibold text-gray-800">{selectedAnnouncement.targetAudience}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">District Coverage</span>
                  <p className="font-semibold text-gray-800">{selectedAnnouncement.district}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Publish Date</span>
                  <p className="font-semibold text-gray-800">{selectedAnnouncement.publishDate}</p>
                </div>
                {selectedAnnouncement.expiryDate && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Expiry Date</span>
                    <p className="font-semibold text-gray-800">{selectedAnnouncement.expiryDate}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Priority Level</span>
                  <p className="font-semibold text-gray-800 capitalize">{selectedAnnouncement.priority}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline / History */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <History size={18} className="text-[#24833A]" />
              <h2 className="text-sm font-bold text-gray-900">Announcement Activity Timeline</h2>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              {selectedAnnouncement.history.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A] font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900">{h.action}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 font-medium">{h.timestamp}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[#174D25] font-semibold">by {h.actor}</span>
                    </div>
                    {h.note && <p className="text-gray-600 mt-0.5 leading-relaxed">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW B: MAIN ANNOUNCEMENT MANAGEMENT WORKSPACE
        ========================================================= */
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                <Megaphone size={26} strokeWidth={2.4} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t("govtAnnouncements.title") || "Government Announcements"}
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                    Official Broadcast
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {t("govtAnnouncements.subtitle") ||
                    "Publish official notices, welfare updates, crop advisories and emergency alerts."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                id="btn-open-emergency-modal"
                onClick={handleOpenEmergency}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-700 shadow-xs hover:bg-rose-100 transition cursor-pointer"
              >
                <Flame size={15} />
                <span>Emergency Alert</span>
              </button>

              <button
                type="button"
                id="btn-open-create-announcement"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] transition cursor-pointer"
              >
                <Plus size={16} />
                <span>Create Announcement</span>
              </button>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Published</span>
                <Radio size={16} className="text-[#24833A]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#174D25]">{summaryMetrics.published}</p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">Live official notices</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Drafts</span>
                <FileText size={16} className="text-amber-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-800">{summaryMetrics.drafts}</p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">Pending review / approval</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Scheduled</span>
                <Clock size={16} className="text-blue-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-blue-900">{summaryMetrics.scheduled}</p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">Future broadcast date</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Emergency Alerts</span>
                <Flame size={16} className="text-rose-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-rose-700">{summaryMetrics.emergency}</p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">High-priority alerts active</p>
            </div>
          </div>

          {/* Interactive Filters & Search */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
            {/* Search and Category Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search announcements by title, circular no, or district..."
                  className="h-11 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-xs focus:border-[#24833A] focus:outline-none"
                />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 focus:border-[#24833A] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Emergency Alert">Emergency Alert</option>
                  <option value="Welfare Update">Welfare Update</option>
                  <option value="Crop Advisory">Crop Advisory</option>
                  <option value="Government Notice">Government Notice</option>
                  <option value="Weather Alert">Weather Alert</option>
                </select>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-gray-400 mr-1">Status:</span>
              {(
                [
                  { id: "all", label: "All Active" },
                  { id: "published", label: "Published" },
                  { id: "draft", label: "Drafts" },
                  { id: "scheduled", label: "Scheduled" },
                  { id: "emergency", label: "Emergency" },
                  { id: "archived", label: "Archived" },
                ] as const
              ).map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Announcements List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-600">
                Official Bulletins ({filteredAnnouncements.length})
              </span>
              <span className="text-[11px] text-gray-400">Click any notice to view full details & timeline</span>
            </div>

            {filteredAnnouncements.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-2xs">
                <Megaphone size={32} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm font-bold text-gray-700">No announcements match your search filters.</p>
                <p className="text-xs text-gray-400 mt-1">Try resetting the status or category filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="mt-3 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#174D25]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnnouncement(ann)}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border p-4 shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs cursor-pointer group bg-white ${
                      ann.isEmergency ? "border-rose-200 bg-rose-50/20" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${
                          ann.isEmergency
                            ? "bg-rose-100 text-rose-700"
                            : ann.status === "draft"
                            ? "bg-amber-50 text-amber-700"
                            : ann.status === "scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-[#F4FBF5] text-[#24833A]"
                        }`}
                      >
                        {ann.isEmergency ? <Flame size={22} /> : <Megaphone size={22} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-gray-400">{ann.circularNo}</span>
                          {renderStatusBadge(ann.status, ann.isEmergency, ann.severity)}
                          {renderPriorityBadge(ann.priority)}
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                            {ann.category}
                          </span>
                        </div>

                        <h2 className="mt-1 text-sm font-bold text-gray-900 group-hover:text-[#24833A] transition">
                          {ann.title}
                        </h2>

                        <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {ann.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-[#24833A]" /> {ann.district}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>Audience: {ann.targetAudience}</span>
                          <span className="text-gray-300">•</span>
                          <span>
                            {ann.status === "scheduled" ? "Scheduled:" : "Published:"} {ann.publishDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 block font-medium">Last Updated</span>
                        <span className="text-xs font-semibold text-gray-700">{ann.lastUpdated}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnnouncement(ann);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 group-hover:bg-[#E4F0DD] group-hover:text-[#24833A] transition"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: CREATE / EDIT ANNOUNCEMENT MODAL
      ========================================================= */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {editingItem
                    ? editingItem.status === "published"
                      ? "Edit Published Circular"
                      : "Edit Announcement Draft"
                    : "Create Official Announcement"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {editingItem?.status === "published"
                    ? "Editing active broadcast — changes will immediately update the official circular."
                    : "Compose circular for welfare schemes, advisories, or government notices."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormPublishOrSchedule} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Kharif 2026 Micro-Irrigation Drip Subsidy Window"
                  className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-[#24833A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AnnouncementCategory)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="Government Notice">Government Notice</option>
                    <option value="Welfare Update">Welfare Update</option>
                    <option value="Crop Advisory">Crop Advisory</option>
                    <option value="Weather Alert">Weather Alert</option>
                    <option value="Emergency Alert">Emergency Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as AnnouncementPriority)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Announcement Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter complete circular text, instructions for beneficiaries, eligibility conditions, and application windows..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#24833A] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={formTargetAudience}
                    onChange={(e) => setFormTargetAudience(e.target.value as any)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="All Farmers">All Farmers</option>
                    <option value="Selected Districts">Selected Districts</option>
                    <option value="Selected Mandals">Selected Mandals</option>
                    <option value="Registered Beneficiaries">Registered Beneficiaries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District Coverage</label>
                  <input
                    type="text"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    placeholder="e.g. All 26 Districts or Guntur, Krishna"
                    className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-[#24833A] focus:outline-none"
                  />
                </div>
              </div>

              {(formTargetAudience === "Selected Mandals" || formDistrict !== "All 26 Districts") && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Specific Mandals (Optional)</label>
                  <input
                    type="text"
                    value={formMandal}
                    onChange={(e) => setFormMandal(e.target.value)}
                    placeholder="e.g. Tenali, Mangalagiri, Amaravati"
                    className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-[#24833A] focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Publish Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formPublishDate}
                    onChange={(e) => setFormPublishDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs focus:border-[#24833A] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {formPublishDate > new Date().toISOString().slice(0, 10)
                      ? "Future date: will be saved as Scheduled"
                      : "Today/Past date: will be published live"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs focus:border-[#24833A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveDraft()}
                    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                  >
                    Save Draft
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
                  >
                    {formPublishDate > new Date().toISOString().slice(0, 10)
                      ? "Schedule Announcement"
                      : "Publish Announcement"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: DEDICATED EMERGENCY ALERT MODAL
      ========================================================= */}
      {isEmergencyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsEmergencyModalOpen(false)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-rose-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <Flame size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Broadcast Agricultural Emergency Alert
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold">
                    Instant biosecurity, pest outbreak, cyclone, or weather flash broadcast
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            {emError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{emError}</span>
              </div>
            )}

            <form onSubmit={handleEmergencySubmit} className="mt-4 flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Alert Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={emTitle}
                  onChange={(e) => setEmTitle(e.target.value)}
                  placeholder="e.g. Cyclone Flash Alert: Coastal Harvest Protection"
                  className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Type</label>
                  <select
                    value={emType}
                    onChange={(e) => setEmType(e.target.value as EmergencyType)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-rose-600 focus:outline-none"
                  >
                    <option value="Weather">Weather Alert</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Flood">Flood</option>
                    <option value="Drought">Drought</option>
                    <option value="Pest Outbreak">Pest Outbreak</option>
                    <option value="Disease Outbreak">Disease Outbreak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Severity Rating</label>
                  <select
                    value={emSeverity}
                    onChange={(e) => setEmSeverity(e.target.value as EmergencySeverity)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-rose-600 focus:outline-none"
                  >
                    <option value="Warning">Warning (Standard Field Advisory)</option>
                    <option value="High">High (Immediate Action Required)</option>
                    <option value="Critical">Critical (Disaster Flash Alert)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Affected Districts</label>
                  <input
                    type="text"
                    required
                    value={emDistricts}
                    onChange={(e) => setEmDistricts(e.target.value)}
                    placeholder="e.g. Krishna, Guntur, West Godavari"
                    className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Affected Mandals</label>
                  <input
                    type="text"
                    value={emMandals}
                    onChange={(e) => setEmMandals(e.target.value)}
                    placeholder="e.g. All Coastal Belts"
                    className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Urgent Advisory Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={emMessage}
                  onChange={(e) => setEmMessage(e.target.value)}
                  placeholder="State clear, actionable steps for farmers (e.g. drain water, stop chemical sprays, shift livestock to higher ground)..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-rose-600 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={emStartTime}
                    onChange={(e) => setEmStartTime(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End / Resolution Time</label>
                  <input
                    type="datetime-local"
                    value={emEndTime}
                    onChange={(e) => setEmEndTime(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
                >
                  {emSeverity === "Critical" ? "Proceed to Critical Broadcast" : "Publish Emergency Alert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: CONFIRM PUBLISH DIALOG
      ========================================================= */}
      {confirmPublishTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setConfirmPublishTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Publish this announcement?</h3>
                <p className="text-xs text-gray-500">Official circular will go live immediately.</p>
              </div>
            </div>

            <div className="my-4 rounded-2xl bg-gray-50 p-4 border border-gray-100 text-xs flex flex-col gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Title:</span>
                <p className="font-bold text-gray-900 mt-0.5">{confirmPublishTarget.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Category:</span>
                  <p className="font-semibold text-gray-700">{confirmPublishTarget.category}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Audience:</span>
                  <p className="font-semibold text-gray-700">{confirmPublishTarget.targetAudience}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Publish Date:</span>
                <p className="font-semibold text-[#174D25]">{new Date().toISOString().slice(0, 10)} (Today)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPublishTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-publish-action"
                onClick={handleConfirmPublish}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
              >
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: CRITICAL EMERGENCY CONFIRMATION MODAL
      ========================================================= */}
      {confirmCriticalAlertData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setConfirmCriticalAlertData(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-rose-300 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <AlertOctagon size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Critical Emergency Warning</h3>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                  State Disaster Broadcast
                </span>
              </div>
            </div>

            <div className="my-4 rounded-2xl bg-rose-50/80 p-4 border border-rose-200 text-xs text-rose-950 flex flex-col gap-2">
              <p className="font-bold leading-relaxed">
                This alert will be marked as Critical and displayed prominently to the selected audience.
              </p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                High-priority notifications will be triggered across district portals, Rythu Bharosa Kendras, and agricultural emergency hotlines.
              </p>
              <div className="pt-2 border-t border-rose-200/80 mt-1">
                <span className="text-[10px] font-bold uppercase text-rose-600 block">Alert Title:</span>
                <p className="font-bold text-gray-900 mt-0.5">{confirmCriticalAlertData.title}</p>
                <span className="text-[10px] font-bold uppercase text-rose-600 block mt-1.5">Affected Coverage:</span>
                <p className="font-medium text-gray-800">{confirmCriticalAlertData.affectedDistricts}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCriticalAlertData(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-publish-critical-alert"
                onClick={() => {
                  publishEmergencyAlert(confirmCriticalAlertData);
                  setConfirmCriticalAlertData(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
              >
                Publish Critical Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 5: ARCHIVE CONFIRMATION MODAL
      ========================================================= */}
      {confirmArchiveTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setConfirmArchiveTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Archive size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Archive this announcement?</h3>
                <p className="text-xs text-gray-500">Notice will be hidden from the active broadcast stream.</p>
              </div>
            </div>

            <p className="my-4 text-xs text-gray-600 leading-relaxed">
              Are you sure you want to archive <strong>&ldquo;{confirmArchiveTarget.title}&rdquo;</strong>? It will remain stored in local records and can be restored at any time.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmArchiveTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                className="rounded-xl bg-gray-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-black cursor-pointer"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
