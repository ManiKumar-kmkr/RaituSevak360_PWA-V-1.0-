"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Send,
  Sparkles,
  ArrowLeft,
  Camera,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Sprout,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ChatMessage,
  FarmProfileInput,
  CropRecommendationItem,
} from "@/types/ai";
import aiAdvisorService, {
  QUICK_PROMPTS,
  FIGMA_CROP_RECOMMENDATIONS,
} from "@/services/ai";
import AdvisoryCard from "@/components/ai/AdvisoryCard";
import BackButton from "@/components/ui/BackButton";
import CropProfileSetup from "@/components/ai/CropProfileSetup";
import CropRecommendations from "@/components/ai/CropRecommendations";

const DEFAULT_FARM_PROFILE: FarmProfileInput = {
  soilType: "black",
  landArea: 5.5,
  farmingSeason: "kharif",
  waterAvailability: "both",
  budgetMin: 15000,
  budgetMax: 25000,
  cropPreferences: ["rice", "cotton"],
};

export default function AIAdvisorPage() {
  const { t, language } = useTranslation();
  const searchParams = useSearchParams();

  // Active view: "chat" (AI Agronomy Chat) or "crop-advisor" (AI Crop Advisor Flow)
  const initialTab = searchParams.get("tab") === "crop-advisor" ? "crop-advisor" : "chat";
  const [activeTab, setActiveTab] = useState<"chat" | "crop-advisor">(initialTab);
  const [cropAdvisorStep, setCropAdvisorStep] = useState<1 | 2>(1);

  // Chat states
  const [inputQuery, setInputQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Crop Advisor states - preserved across steps
  const [farmProfile, setFarmProfile] = useState<FarmProfileInput>(DEFAULT_FARM_PROFILE);
  const [recommendations, setRecommendations] = useState<CropRecommendationItem[]>(
    FIGMA_CROP_RECOMMENDATIONS
  );
  const [isCalculatingRecs, setIsCalculatingRecs] = useState(false);
  const [advisorError, setAdvisorError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message with current localized string
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 1) {
        return prev;
      }
      return [
        {
          id: "msg-welcome",
          sender: "ai",
          text: t("aiAdvisor.welcomeMessage"),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ];
    });
  }, [language, t]);

  // Smooth scroll to bottom on new message in chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [messages, isAnalyzing, activeTab]);

  // Handle image attachment
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Simulate voice query toggle
  const toggleVoiceQuery = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInputQuery(
          language === "te"
            ? "వరిలో కాండం తొలుచు పురుగు నివారణ ఏమిటి?"
            : language === "hi"
              ? "धान में तना छेदक कीट की रोकथाम कैसे करें?"
              : "How to manage stem borer in paddy crop?"
        );
        setIsListening(false);
      }, 1800);
    }
  };

  // Handle Chat Query Submission
  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputQuery.trim();
    const imageToSend = selectedImage;

    if (!textToSend && !imageToSend) return;

    const userTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text:
        textToSend || (imageToSend ? "Uploaded leaf photo for diagnostic scan" : ""),
      timestamp: userTimestamp,
      imageUrl: imageToSend || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Call AI service abstraction
    setIsAnalyzing(true);
    try {
      const result = await aiAdvisorService.askAdvisor(textToSend, Boolean(imageToSend));
      const aiTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: t(result.responseTextKey),
        timestamp: aiTimestamp,
        advisory: result.advisory,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Unable to process query at this time. Please check your connection or try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Crop Advisor Form Submission
  const handleGetRecommendations = async (profile: FarmProfileInput) => {
    // Prevent duplicate submissions
    if (isCalculatingRecs) return;

    setIsCalculatingRecs(true);
    setAdvisorError(null);
    setFarmProfile(profile);

    try {
      const results = await aiAdvisorService.getCropRecommendations(profile);

      // Make sure we received usable recommendation data
      if (!results || results.length === 0) {
        throw new Error("No crop recommendations were returned.");
      }

      setRecommendations(results);
      setCropAdvisorStep(2);

      // Scroll the actual document to the top after Step 2 renders
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
    } catch (error) {
      console.error("AI Crop Advisor recommendation error:", error);

      // Keep the user on Step 1 when the recommendation service fails.
      // Do not silently pretend that real recommendations were generated.
      setRecommendations([]);

      setAdvisorError(
        "We couldn't generate recommendations right now. Please check your details and try again."
      );
    } finally {
      setIsCalculatingRecs(false);
    }
  };
  // Return from Step 2 to Step 1 preserving user profile
  const handleModifyProfile = () => {
    setCropAdvisorStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-28 sm:pb-16">
      {/* 1. TOP BREADCRUMB & BACK LINK */}
      <div className="flex items-center justify-between">
        <BackButton
          id="btn-back-dashboard"
          href="/dashboard"
          label={t("aiAdvisor.backToDashboard")}
        />

        {/* Current Active Language Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F6F3] border border-[#DCE7DD] px-3 py-1 text-xs font-bold text-[#17321F]">
          <Globe size={13} className="text-[#24833A]" />
          <span className="uppercase">
            {language === "te" ? "తెలుగు" : language === "hi" ? "हिंदी" : "English"}
          </span>
        </div>
      </div>

      {/* 2. HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 rounded-3xl bg-white p-5 sm:p-6 border border-[#DCE7DD] shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#174D25] border border-[#86EFAC]/60 shadow-xs">
            <Bot size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-[#17321F]">
                {t("aiAdvisor.title")}
              </h1>
              <span className="rounded-full bg-[#EAF7EE] border border-[#86EFAC] px-2.5 py-0.5 text-[10px] font-bold text-[#16803A]">
                {t("aiAdvisor.liveBadge")}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#5F6F64] font-medium leading-relaxed max-w-lg">
              {t("aiAdvisor.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* 3. SEGMENTED TABS: AI Agronomy Chat vs AI Crop Advisor */}
      <div className="flex rounded-2xl bg-[#EAF7EE] p-1 border border-[#DCE7DD]">
        <button
          id="tab-agronomy-chat"
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === "chat"
              ? "bg-[#174D25] text-white shadow-xs"
              : "text-[#17321F] hover:bg-white/60"
            }`}
        >
          <Bot size={15} />
          <span>{t("aiAdvisor.tabs.chat")}</span>
        </button>

        <button
          id="tab-crop-advisor"
          type="button"
          onClick={() => {
            setActiveTab("crop-advisor");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === "crop-advisor"
              ? "bg-[#174D25] text-white shadow-xs"
              : "text-[#17321F] hover:bg-white/60"
            }`}
        >
          <Sprout size={15} />
          <span>{t("aiAdvisor.tabs.cropAdvisor")}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: AI AGRONOMY CHAT INTERFACE (PRESERVED & FULLY SCROLLABLE)         */}
      {/* ========================================================================= */}
      {activeTab === "chat" && (
        <div className="flex flex-col gap-4">
          {/* A1. AI Crop Advisor Workflow Prompt Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#EAF7EE] to-[#F7F9F6] border border-[#86EFAC]/70 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#174D25] text-white shadow-xs">
                <Sprout size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#17321F]">
                  {t("aiAdvisor.cropAdvisorBannerTitle")}
                </h3>
                <p className="mt-0.5 text-xs text-[#5F6F64] font-medium leading-relaxed max-w-md">
                  {t("aiAdvisor.cropAdvisorBannerSubtitle")}
                </p>
              </div>
            </div>

            <button
              id="btn-start-farm-profile"
              type="button"
              onClick={() => {
                setActiveTab("crop-advisor");
                setCropAdvisorStep(1);
              }}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#174D25] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#24833A] transition active:scale-95 cursor-pointer"
            >
              <span>{t("aiAdvisor.startFarmProfile")}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* A2. QUICK PROMPT SUGGESTION PILLS (Horizontal Scroll) */}
          <div className="rounded-2xl border border-[#DCE7DD] bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#17321F] mb-2.5">
              <Sparkles size={14} className="text-[#24833A]" />
              <span>{t("aiAdvisor.quickPromptsTitle")}</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={prompt.id}
                  id={`btn-quick-prompt-${idx + 1}`}
                  type="button"
                  onClick={() => handleSend(prompt.queryText)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#DCE7DD] bg-[#F7F9F6] px-3 py-1.5 text-xs font-semibold text-[#17321F] transition hover:border-[#24833A] hover:bg-[#EAF7EE] active:scale-95 cursor-pointer"
                >
                  <Sprout size={13} className="text-[#24833A]" />
                  <span>{t(prompt.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* A3. CHAT CONVERSATION CONTAINER */}
          {/* Scroll fix: natural document flow, allowing full vertical page scrolling */}
          <div className="rounded-3xl border border-[#DCE7DD] bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            {/* Conversation list */}
            <div className="flex flex-col gap-4 min-h-[320px] pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[95%] sm:max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${msg.sender === "user"
                        ? "bg-[#174D25] text-white shadow-xs"
                        : "bg-[#EAF7EE] text-[#174D25] border border-[#86EFAC]/70"
                      }`}
                  >
                    {msg.sender === "user" ? "You" : <Bot size={16} />}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`rounded-2xl p-3.5 text-xs leading-relaxed ${msg.sender === "user"
                        ? "bg-[#174D25] text-white shadow-xs"
                        : "bg-[#F7F9F6] text-[#17321F] border border-[#DCE7DD]"
                      }`}
                  >
                    {/* Uploaded Image Preview if attached */}
                    {msg.imageUrl && (
                      <div className="mb-2.5 overflow-hidden rounded-xl border border-white/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.imageUrl}
                          alt="Crop leaf sample"
                          className="max-h-48 w-auto object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <p className="font-normal whitespace-pre-wrap">{msg.text}</p>

                    {/* Embedded Structured Advisory Card */}
                    {msg.advisory && <AdvisoryCard advisory={msg.advisory} />}

                    <span
                      className={`mt-1.5 block text-[10px] font-medium ${msg.sender === "user" ? "text-emerald-200" : "text-[#5F6F64]"
                        }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing / Analyzing Loader */}
              {isAnalyzing && (
                <div className="flex items-start gap-2.5 self-start max-w-[85%] animate-pulse">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#174D25] border border-[#86EFAC]/70">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-2xl bg-[#F7F9F6] border border-[#DCE7DD] p-3.5 text-xs text-[#5F6F64] flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[#16803A] animate-ping" />
                    <span>{t("aiAdvisor.analyzing")}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* A4. INTERACTIVE INPUT BAR */}
            <div className="pt-3 border-t border-[#DCE7DD]">
              {/* Selected Image Preview Pill */}
              {selectedImage && (
                <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-[#EAF7EE] border border-[#86EFAC] px-3 py-1.5 text-xs text-[#174D25]">
                  <ImageIcon size={14} />
                  <span className="font-bold">Leaf photo attached</span>
                  <button
                    id="btn-remove-image"
                    type="button"
                    onClick={removeImage}
                    className="text-[#991B1B] hover:text-[#DC2626] ml-1 cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Voice query indicator banner if active */}
              {isListening && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-[#FFF7E6] border border-[#FDE68A] px-3 py-2 text-xs font-bold text-[#B45309] animate-pulse">
                  <Mic size={14} className="text-[#DC2626]" />
                  <span>{t("aiAdvisor.listening")}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                {/* Hidden File Input */}
                <input
                  id="input-photo-file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {/* Camera / Photo Upload Button */}
                <button
                  id="btn-upload-photo"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] text-[#5F6F64] transition hover:bg-[#EAF7EE] hover:text-[#174D25] active:scale-95 cursor-pointer"
                  title={t("aiAdvisor.uploadPhoto")}
                  aria-label={t("aiAdvisor.uploadPhoto")}
                >
                  <Camera size={18} />
                </button>

                {/* Voice Mic Button */}
                <button
                  id="btn-voice-query"
                  type="button"
                  onClick={toggleVoiceQuery}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition active:scale-95 cursor-pointer ${isListening
                      ? "border-[#DC2626] bg-[#FEE2E2] text-[#DC2626]"
                      : "border-[#DCE7DD] bg-[#F7F9F6] text-[#5F6F64] hover:bg-[#EAF7EE] hover:text-[#174D25]"
                    }`}
                  title={t("aiAdvisor.voiceQuery")}
                  aria-label={t("aiAdvisor.voiceQuery")}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Text Input */}
                <input
                  id="input-query-text"
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={t("aiAdvisor.inputPlaceholder")}
                  className="flex-1 rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] px-4 py-2.5 text-xs text-[#17321F] placeholder-[#5F6F64] focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                />

                {/* Send Button */}
                <button
                  id="btn-send-query"
                  type="submit"
                  disabled={(!inputQuery.trim() && !selectedImage) || isAnalyzing}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#174D25] text-white shadow-xs transition hover:bg-[#24833A] active:scale-95 disabled:opacity-40 cursor-pointer"
                  title={t("aiAdvisor.send")}
                  aria-label={t("aiAdvisor.send")}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: AI CROP ADVISOR WORKFLOW (FIGMA SCREENS 1 & 2)                    */}
      {/* ========================================================================= */}
      {activeTab === "crop-advisor" && (
        <div className="flex flex-col gap-4">
          {cropAdvisorStep === 1 && (
            <CropProfileSetup
              initialProfile={farmProfile}
              onGetRecommendations={handleGetRecommendations}
              isLoading={isCalculatingRecs}
              error={advisorError}
            />
          )}

          {cropAdvisorStep === 2 && (
            <CropRecommendations
              recommendations={recommendations}
              onModifyProfile={handleModifyProfile}
              onSwitchToChat={() => setActiveTab("chat")}
            />
          )}
        </div>
      )}
    </div>
  );
}
