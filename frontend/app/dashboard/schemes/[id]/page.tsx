"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Landmark, AlertCircle } from "lucide-react";
import { GovernmentScheme } from "@/types/government-scheme";
import { governmentSchemesService, VERIFIED_GOVERNMENT_SCHEMES } from "@/services/government-schemes";
import { useTranslation } from "@/hooks/useTranslation";
import SchemeDetailView from "@/components/schemes/SchemeDetailView";

export default function SchemeDynamicDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const schemeId = params?.id as string;

  const initialScheme = schemeId
    ? VERIFIED_GOVERNMENT_SCHEMES.find((s) => s.id === schemeId) || null
    : null;

  const [scheme, setScheme] = useState<GovernmentScheme | null>(initialScheme);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    let isMounted = true;
    if (schemeId) {
      setIsLoading(true);
      governmentSchemesService
        .getSchemeById(schemeId)
        .then((data) => {
          if (isMounted) {
            setScheme(data || null);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [schemeId]);

  const handleBack = () => {
    router.push("/dashboard/schemes");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        <p className="mt-3 text-xs font-semibold text-gray-500">
          {t("schemes.loadingSchemes") || "Loading verified government schemes..."}
        </p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-2xs mt-8">
        <AlertCircle size={36} className="text-amber-500 mb-3" />
        <h1 className="text-base font-bold text-gray-900">
          Scheme Not Found
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          The requested government scheme could not be found or may have been updated.
        </p>
        <Link
          href="/dashboard/schemes"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e6f31] transition"
        >
          <ArrowLeft size={14} />
          <span>{t("schemes.backToSchemes") || "Back to Schemes"}</span>
        </Link>
      </div>
    );
  }

  return <SchemeDetailView scheme={scheme} onBack={handleBack} />;
}
