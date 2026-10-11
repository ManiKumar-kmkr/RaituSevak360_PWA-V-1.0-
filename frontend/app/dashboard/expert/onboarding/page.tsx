import React from "react";
import ExpertOnboardingWizard from "@/components/expert/ExpertOnboardingWizard";

export const metadata = {
  title: "Expert Onboarding | RaituSevak360",
  description: "Complete your Agriculture Expert profile and credentials on RaituSevak360",
};

export default function ExpertOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F4F8EE] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ExpertOnboardingWizard />
      </div>
    </div>
  );
}
