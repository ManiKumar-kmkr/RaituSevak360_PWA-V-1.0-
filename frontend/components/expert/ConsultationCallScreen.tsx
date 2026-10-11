"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  User,
  Sprout,
  FileText,
  Clock,
  Sparkles,
  Maximize2,
  Volume2,
  ChevronUp,
  MessageSquare,
  X,
} from "lucide-react";
import { ExpertConsultation } from "@/types/expert";

interface ConsultationCallScreenProps {
  consultation: ExpertConsultation;
  onEndCall: (callDurationSeconds: number, liveNotes?: string) => void;
  onCancelCall?: () => void;
  onClose?: () => void;
}

export default function ConsultationCallScreen({
  consultation,
  onEndCall,
  onCancelCall,
  onClose,
}: ConsultationCallScreenProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">(
    "connecting"
  );
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  const handleExit = () => {
    if (callStatus === "connected") {
      setShowExitConfirm(true);
      return;
    }
    if (onClose) onClose();
    else if (onCancelCall) onCancelCall();
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    if (onClose) onClose();
    else if (onCancelCall) onCancelCall();
  };

  // Simulated connection delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus("connected");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Timer ticker when connected
  useEffect(() => {
    if (callStatus !== "connected") return;
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndPrompt = () => {
    setShowEndConfirm(true);
  };

  const handleConfirmEnd = () => {
    setShowEndConfirm(false);
    setCallStatus("ended");
    setTimeout(() => {
      onEndCall(Math.max(duration, 45), callNotes.trim() || undefined);
    }, 500);
  };

  const handleSaveNotes = () => {
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2000);
    setIsNotesOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top Call Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#24833A] text-white font-bold text-sm shadow-xs">
            {consultation.farmerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{consultation.farmerName}</h2>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                {consultation.crop}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {consultation.topic}
            </p>
          </div>
        </div>

        {/* Live Call Duration / Status */}
        <div className="flex items-center gap-2">
          {callStatus === "connecting" ? (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-slate-800/90 px-3 py-1 text-xs font-mono font-bold text-emerald-400 border border-slate-700">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{formatTimer(duration)}</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-xl">
            <ShieldCheck size={13} className="text-[#24833A]" />
            <span>Encrypted Room</span>
          </div>

          <button
            type="button"
            onClick={handleExit}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Leave / Minimize Call"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="relative flex-1 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4 overflow-hidden">
        {/* Remote Farmer Feed Simulation */}
        <div className="relative w-full h-full max-w-4xl max-h-[72vh] rounded-3xl border border-slate-800 bg-slate-900/90 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          {callStatus === "connecting" ? (
            <div className="flex flex-col items-center gap-4 text-center p-6">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A]">
                <User size={40} />
                <span className="absolute inset-0 rounded-full border-2 border-[#24833A] animate-ping" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Calling {consultation.farmerName}...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connecting to field in {consultation.village}, {consultation.district}
                </p>
              </div>
            </div>
          ) : (
            /* Connected Video Simulation */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Farmer Camera Feed Placeholder Graphic */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-emerald-950/80 text-emerald-400 border-2 border-emerald-500/40 shadow-inner">
                  <User size={56} />
                  {/* Subtle Audio Waveform Rings */}
                  <span className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-pulse" />
                  <span className="absolute -inset-5 rounded-full border border-emerald-500/10" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-white">{consultation.farmerName}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800 mt-1">
                    <Sprout size={11} />
                    <span>In Field: {consultation.crop}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Video Stream Info Pill */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs text-slate-300 border border-slate-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Farmer Audio/Video Active • 720p HD</span>
              </div>
            </div>
          )}

          {/* Expert Self-View Picture-in-Picture (PiP) */}
          <div className="absolute top-4 right-4 h-28 w-24 sm:h-36 sm:w-28 rounded-2xl border-2 border-slate-700 bg-slate-800/90 shadow-xl overflow-hidden flex flex-col items-center justify-center z-10">
            {isCameraOff ? (
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <VideoOff size={18} />
                <span className="text-[9px] font-bold">Cam Off</span>
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center p-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24833A] text-white font-bold text-xs">
                  DR
                </div>
                <span className="mt-1 text-[9px] font-bold text-emerald-300 truncate max-w-full">
                  You (Expert)
                </span>
                <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
        </div>

        {/* Quick Consultation Notes Floating Drawer */}
        {isNotesOpen && (
          <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-88 rounded-2xl bg-slate-900/95 backdrop-blur-lg border border-slate-700 p-4 shadow-2xl z-30 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <FileText size={13} />
                <span>Live Consultation Notes</span>
              </span>
              <button
                type="button"
                onClick={() => setIsNotesOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close notes"
              >
                <X size={14} />
              </button>
            </div>
            <textarea
              rows={4}
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Jot down symptoms, pest count, recommended chemicals, spray schedule..."
              className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-white border border-slate-800 focus:outline-none focus:border-emerald-500 resize-none placeholder:text-slate-500"
            />
            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400">
                Transfers to summary form automatically
              </span>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1 rounded-lg bg-[#24833A] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#174D25] transition cursor-pointer"
              >
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Call Controls Bar */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 px-4 py-4 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-20">
        {/* Mute Microphone Button */}
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition active:scale-90 cursor-pointer ${
            isMuted
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
          }`}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
          aria-label={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Toggle Camera Button */}
        <button
          type="button"
          onClick={() => setIsCameraOff((prev) => !prev)}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition active:scale-90 cursor-pointer ${
            isCameraOff
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
          }`}
          title={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
          aria-label={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        {/* Notes Toggle Button */}
        <button
          type="button"
          onClick={() => setIsNotesOpen((prev) => !prev)}
          className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition active:scale-90 cursor-pointer ${
            isNotesOpen
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
          }`}
          title="Agronomy Notes"
          aria-label="Toggle Agronomy Notes"
        >
          <FileText size={20} />
          {callNotes.trim().length > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* END CALL BUTTON (Destructive Red with Confirmation Prompt) */}
        <button
          type="button"
          onClick={handleEndPrompt}
          className="flex h-12 px-6 items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-900/40 transition active:scale-95 cursor-pointer"
          aria-label="End consultation call"
        >
          <PhoneOff size={18} />
          <span>End Call</span>
        </button>
      </div>

      {/* END CALL SAFETY CONFIRMATION MODAL */}
      {showEndConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-center shadow-2xl animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 mb-3 border border-rose-500/40">
              <PhoneOff size={26} />
            </div>
            <h3 className="text-base font-bold text-white">Conclude Consultation?</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              This will conclude the live call with <strong>{consultation.farmerName}</strong> after{" "}
              <strong>{formatTimer(duration)}</strong> and transition to the Advisory Summary.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
              >
                Keep Talking
              </button>
              <button
                type="button"
                onClick={handleConfirmEnd}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition cursor-pointer"
              >
                Conclude & Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE / EXIT CALL CONFIRMATION MODAL */}
      {showExitConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-center shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white">Leave active consultation?</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              The tele-consultation session with <strong>{consultation.farmerName}</strong> is still connected. Do you want to leave this session?
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
              >
                Continue Call
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="flex-1 rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition cursor-pointer"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
