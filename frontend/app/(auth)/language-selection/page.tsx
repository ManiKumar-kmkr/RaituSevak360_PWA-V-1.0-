"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageOption } from "@/types";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import LanguageCard from "@/components/auth/LanguageCard";
import PrimaryButton from "@/components/auth/PrimaryButton";

const LANGUAGES: LanguageOption[] = [
  { code: "te", name: "Telugu", nativeName: "తెలుగు", englishLabel: "Telugu" },
  { code: "en", name: "English", nativeName: "English", englishLabel: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", englishLabel: "Hindi" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", englishLabel: "Tamil" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", englishLabel: "Kannada" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", englishLabel: "Marathi" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", englishLabel: "Bengali" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", englishLabel: "Gujarati" },
];

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const [selected, setSelected] = useState<string>(language || "te");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectLanguage = (code: string) => {
    setSelected(code);
    setLanguage(code); // Update global store immediately
  };

  const handleContinue = () => {
    if (!selected) return;
    setIsSubmitting(true);
    setLanguage(selected);
    router.push("/welcome");
  };

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between">
        {/* Header Section */}
        <div className="pt-1">
          <AuthHeader
            title={t("language.chooseTitle")}
            subtitle={t("language.chooseSubtitle")}
            showBack={true}
            backHref="/splash"
            showBrand={true}
            brandText={t("common.appName")}
          />

          {/* 2-Column Languages Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-3.5">
            {LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.code}
                code={lang.code}
                nativeName={lang.nativeName}
                englishLabel={lang.englishLabel}
                isSelected={selected === lang.code}
                onSelect={handleSelectLanguage}
              />
            ))}
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className="mt-8 pb-2">
          <PrimaryButton
            type="button"
            onClick={handleContinue}
            isLoading={isSubmitting}
            disabled={!selected}
          >
            {t("language.continueButton")}
          </PrimaryButton>
        </div>
      </div>
    </AuthPageLayout>
  );
}
