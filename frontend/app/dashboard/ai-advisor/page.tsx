"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, Sprout, ShieldCheck, HelpCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";

export default function AIAdvisorPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; time: string }>
  >([
    {
      sender: "ai",
      text: "Namaste! I am your RaituSevak AI Agronomy Advisor. Ask me anything about crop diseases, pest solutions, weather-sensitive irrigation, or organic fertilizers in your regional language.",
      time: "Just now",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery("");

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: "Just now" },
      {
        sender: "ai",
        text: `Analysis for "${userText}": Based on current regional conditions and soil humidity, ensure proper drainage in low-lying crop zones and apply recommended neem oil spray (5ml/L) early morning for natural pest resistance.`,
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Bot size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                AI Agronomy Advisor
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                24/7 Live
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Regional multilingual crop diagnostics and scientific farm advice
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col h-[420px] justify-between">
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-[#24833A] text-white"
                    : "bg-[#E4F0DD] text-[#24833A]"
                }`}
              >
                {msg.sender === "user" ? "You" : <Bot size={16} />}
              </div>
              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#24833A] text-white"
                    : "bg-gray-50 text-gray-800 border border-gray-100"
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`mt-1 block text-[10px] ${
                    msg.sender === "user" ? "text-emerald-100" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSend} className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type your crop or farming question here..."
            className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#24833A] text-white shadow-xs transition hover:bg-[#1e6e30] disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
