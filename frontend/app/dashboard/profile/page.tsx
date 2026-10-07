"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  ArrowLeftRight,
  Globe,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Tractor,
  UsersRound,
  Trees,
  Store,
  CreditCard,
  Package,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useSellerStore } from "@/store/seller-store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types";
import authService from "@/services/auth";
import RoleSwitchModal from "@/components/layout/RoleSwitchModal";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

const LANGUAGES = [
  { code: "te", label: "తెలుగు" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  const orders = useCartStore((state) => state.orders);
  const bookings = useCartStore((state) => state.bookings);
  const labourBookings = useCartStore((state) => state.labourBookings || []);
  const landRequests = useCartStore((state) => state.landRequests || []);
  const myWorkerProfile = useCartStore((state) => state.myWorkerProfile);
  const myLandListings = useCartStore((state) => state.myLandListings || []);

  const sellerProducts = useSellerStore((state) => state.products);
  const sellerLeads = useSellerStore((state) => state.buyLeads);
  const sellerVerification = useSellerStore((state) => state.verificationStatus);
  const sellerOnboardingData = useSellerStore((state) => state.onboardingData);
  const quotations = useSellerStore((state) => state.quotations || []);
  const pendingQuotationsCount = quotations.filter(
    (q) => q.status === "submitted" || q.status === "under_review"
  ).length;

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const normalizedKey = activeRole === "government" ? "govt" : activeRole;
  const roleTranslated = t(`roles.${normalizedKey}.title`);

  const displayName = user?.name || `${t("dashboard.defaultUser")} ${user?.mobile?.slice(-4) || ""}`;
  const displayMobile = user?.mobile ? `+91 ${user.mobile}` : t("profile.notProvided");
  const displayEmail = user?.email || t("profile.notProvided");

  // Only Farmer <-> Seller switching is permitted
  const canSwitchRole = activeRole === "farmer" || activeRole === "seller";
  const switchActionLabel =
    activeRole === "farmer"
      ? t("dashboard.switchToSeller")
      : t("dashboard.switchToFarmer");

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } catch {
      // Ignore
    }
    logout();
    router.replace("/login");
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 pb-16">
      {/* Top Breadcrumb Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Header Banner */}
      <div className="flex items-center gap-4 rounded-3xl bg-white p-5 border border-[#24833A]/20 shadow-2xs">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
          <User size={34} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {displayName}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
              <CheckCircle2 size={11} />
              {t("profile.verified")}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            {displayMobile}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-0.5 text-xs font-bold text-[#174D25]">
            <ShieldCheck size={13} className="text-[#24833A]" />
            <span>{roleTranslated}</span>
          </div>
        </div>
      </div>

      {/* Account Details Section */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
          {t("profile.accountDetails")}
        </h2>

        <div className="flex flex-col divide-y divide-gray-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.fullName")}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900">{displayName}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.mobileNumber")}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900">{displayMobile}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.emailAddress")}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-700">{displayEmail}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.accountStatus")}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={12} />
              {t("profile.verified")}
            </span>
          </div>
        </div>
      </div>

      {/* Role Management Card */}
      <div className="rounded-3xl border border-[#24833A]/20 bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
          {t("profile.roleManagement")}
        </h2>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {t("profile.activeRole")}:
              </span>
              <span className="text-xs font-bold text-[#174D25]">
                {roleTranslated}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {canSwitchRole
                ? t("profile.roleSwitchEligible")
                : t("profile.roleFixed")}
            </p>
          </div>

          {canSwitchRole ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSwitchModalOpen(true)}
              leftIcon={<ArrowLeftRight size={13} strokeWidth={2.4} />}
            >
              {switchActionLabel}
            </Button>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
              <Lock size={12} />
              <span>Fixed Role</span>
            </div>
          )}
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-[#24833A]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            {t("profile.language")}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`rounded-xl py-2.5 px-3 text-center text-xs font-semibold transition active:scale-95 ${
                language === lang.code
                  ? "bg-[#24833A] text-white shadow-xs"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role-Specific Activity Cards */}
      {activeRole === "seller" ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 pt-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Seller Store & Business Activity
            </h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
              {sellerVerification === "verified" ? "Verified Store" : "KYC Active"}
            </span>
          </div>

          {/* Customer Orders */}
          <Link
            id="profile-link-seller-orders"
            href="/dashboard/orders"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                <Package size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Customer Orders
                  </h3>
                  {orders.length > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-[#174D25]">
                      {orders.length} Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Manage incoming customer orders and dispatches
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">Manage →</span>
          </Link>

          {/* My Products */}
          <Link
            id="profile-link-seller-products"
            href="/dashboard/seller/products"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Store size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    My Products
                  </h3>
                  <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[10px] font-bold text-blue-800">
                    {sellerProducts.length} Listed
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Manage pricing, inventory and active product catalog
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">Manage →</span>
          </Link>

          {/* Buy Leads */}
          <Link
            id="profile-link-seller-leads"
            href="/dashboard/seller/leads"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Buy Leads & Inquiries
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2 py-0.2 text-[10px] font-bold text-amber-800">
                    {sellerLeads.length} Available
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Direct farm crop harvest leads & buyer quotations
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">View →</span>
          </Link>

          {/* Equipment Rental */}
          <Link
            id="profile-link-seller-equipment"
            href="/dashboard/seller/equipment"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Tractor size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Equipment Rental
                </h3>
                <p className="text-[11px] text-gray-500">
                  Tractors, harvesters & drone sprayers rental listings
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">Manage →</span>
          </Link>

          {/* Payments & Revenue */}
          <Link
            id="profile-link-seller-payments"
            href="/dashboard/seller/payments"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#174D25]">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Payments & Revenue
                </h3>
                <p className="text-[11px] text-gray-500">
                  Daily settlement history, bank transfers and earnings
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">View →</span>
          </Link>

          {/* Customer Management */}
          <Link
            id="profile-link-seller-customers"
            href="/dashboard/seller/customers"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  {t("seller.customers") || "Customer Profiles"}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {t("seller.customersDesc") || "Farmer buyer directory & order history"}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">View →</span>
          </Link>

          {/* Store Profile & Verification */}
          <Link
            id="profile-link-seller-kyc"
            href="/dashboard/seller/onboarding"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Store Profile & KYC
                </h3>
                <p className="text-[11px] text-gray-500">
                  {sellerOnboardingData.businessName || "Business verification documents & GST"}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#24833A]">Manage →</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Farm Services & Activity: Orders & Equipment Bookings */}
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 pt-1">
              Farm Services & Activity
            </h2>

            {/* My Orders Link */}
            <Link
              id="profile-link-my-orders"
              href="/dashboard/orders"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      My Orders
                    </h3>
                    {orders.length > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-[#174D25]">
                        {orders.length} Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Purchased seeds, fertilizers & farm inputs
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">View →</span>
            </Link>

            {/* Received Quotations Link */}
            <Link
              id="profile-link-received-quotations"
              href="/dashboard/quotations"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#174D25]">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      {t("seller.quotations.title") || "Received Quotations"}
                    </h3>
                    {pendingQuotationsCount > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.2 text-[10px] font-bold text-amber-800">
                        {pendingQuotationsCount} {t("seller.quotations.statusPending") || "Pending"}
                      </span>
                    ) : quotations.length > 0 ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-[#174D25]">
                        {quotations.length} Bids
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {t("seller.quotations.subtitle") ||
                      "Review and accept competitive bids from verified agricultural buyers"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">View →</span>
            </Link>

            {/* My Equipment Bookings Link */}
            <Link
              id="profile-link-my-bookings"
              href="/dashboard/bookings"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Tractor size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      My Equipment Bookings
                    </h3>
                    {bookings.length > 0 && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.2 text-[10px] font-bold text-amber-800">
                        {bookings.length} Booked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Tractor rentals, harvesters & drone sprayers
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">View →</span>
            </Link>

            {/* My Labour Bookings Link */}
            <Link
              id="profile-link-my-labour"
              href="/dashboard/labour?tab=bookings"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <UsersRound size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      My Labour Bookings
                    </h3>
                    {labourBookings.length > 0 && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[10px] font-bold text-blue-800">
                        {labourBookings.length} Scheduled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Harvest crews, sowing teams & sprayers
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">View →</span>
            </Link>

            {/* My Land Rental Requests Link */}
            <Link
              id="profile-link-my-land"
              href="/dashboard/farm?tab=requests"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#174D25]">
                  <Trees size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      My Land Rental Requests
                    </h3>
                    {landRequests.length > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-[#174D25]">
                        {landRequests.length} Proposals
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Rental proposals & agricultural lease records
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">View →</span>
            </Link>
          </div>

          {/* Provider Services & Listings (Two-Sided Agriculture Marketplace) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 pt-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Provider Services & Offerings
              </h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                Earn as Provider
              </span>
            </div>

            {/* My Labour Profile */}
            <Link
              id="profile-link-provider-labour"
              href="/dashboard/labour?tab=provider"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <UsersRound size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      My Labour Profile
                    </h3>
                    {myWorkerProfile ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-[#174D25]">
                        {myWorkerProfile.isActive !== false ? "● Active Listing" : "○ Paused"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.2 text-[10px] font-semibold text-gray-600">
                        Not Registered
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {myWorkerProfile
                      ? `My profile as agricultural worker • ₹${myWorkerProfile.dailyRate}/day`
                      : "Register as agricultural worker to receive field bookings"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">Manage →</span>
            </Link>

            {/* My Land Listings */}
            <Link
              id="profile-link-provider-land"
              href="/dashboard/farm?tab=provider"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#174D25]">
                  <Trees size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      My Land Listings
                    </h3>
                    {myLandListings.length > 0 ? (
                      <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[10px] font-bold text-blue-800">
                        {myLandListings.length} Listed
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.2 text-[10px] font-semibold text-gray-600">
                        0 Listed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {myLandListings.length > 0
                      ? "Farmland plots I am offering for lease"
                      : "List your surplus agricultural land to earn lease income"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#24833A]">Manage →</span>
            </Link>
          </div>
        </>
      )}

      {/* Quick Shortcuts */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
        <Link
          href="/dashboard/notifications"
          className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                {t("nav.notifications")}
              </h3>
              <p className="text-[11px] text-gray-500">
                View alerts and latest announcements
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#24833A]">Open</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                {t("nav.settings")}
              </h3>
              <p className="text-[11px] text-gray-500">
                Manage preferences & privacy
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500">Configure</span>
        </Link>
      </div>

      {/* Logout Action */}
      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={handleLogout}
        leftIcon={<LogOut size={16} />}
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        {t("common.logout")}
      </Button>

      {/* Role Switch Modal */}
      <RoleSwitchModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />
    </div>
  );
}
