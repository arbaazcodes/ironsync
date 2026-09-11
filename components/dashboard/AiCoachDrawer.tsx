"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Flame,
  Dumbbell,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  "How do I break through a bench press plateau?",
  "Should I cut, bulk, or recomposition?",
  "How can I optimize sleep and recovery?",
  "What is the best pre-workout meal timing?",
  "How to properly brace during heavy squats?",
];

export function AiCoachDrawer({ isOpen, onClose }: AiCoachDrawerProps) {
  const { user, activePlan } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "coach",
      text: "### ⚡ IRONSYNC AI COACH INITIALIZED\nI am your dedicated biomechanics and performance nutrition advisor. Ask me anything about your form, progressive overload, calorie distribution, or recovery protocols.",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close on Escape & trap scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => drawerRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageToSend?: string) => {
    const query = (messageToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageToSend) setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: {
            planName: activePlan?.displayName || "Custom Athlete Plan",
            goal: activePlan?.goal || "Hypertrophy & Strength",
            calories: activePlan?.calories || 2400,
            protein: activePlan?.protein || 180,
            split: activePlan?.splitName || "Push / Pull / Legs",
            experienceLevel: activePlan?.experience || "Intermediate",
          },
        }),
      });

      const data = await response.json();
      const replyText = data?.reply || data?.error || "Coach engine unavailable. Please retry.";

      const coachMessage: Message = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, coachMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "coach",
          text: "Connection interrupted. Please verify network or reload.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "coach",
        text: "Session reset. Ready for tactical fitness and nutrition directives.",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-coach-title"
        className="relative w-full sm:max-w-xl h-[94vh] sm:h-full mt-auto sm:mt-0 bg-card border-t sm:border-t-0 sm:border-l border-border rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300 focus:outline-none"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-card">
          <div className="w-12 h-1.5 rounded-full bg-primary-dim/30" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface-elevated flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-[0_0_12px_rgba(255,30,30,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-coach-title" className="font-extrabold text-base sm:text-lg text-primary tracking-tight">
                  IRONSync AI Coach
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-primary-muted">
                Active Blueprint &bull; {activePlan?.calories || 2400} kcal &bull; {activePlan?.splitName || "PPL"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              title="Clear conversation"
              aria-label="Clear conversation"
              className="p-2 rounded-xl bg-surface hover:bg-surface-elevated text-primary-dim hover:text-primary border border-border transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close AI Coach"
              className="p-2 rounded-xl bg-surface hover:bg-surface-elevated text-primary-dim hover:text-primary border border-border transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 space-y-1.5 ${
                    isUser
                      ? "bg-accent/15 border border-accent/30 text-primary"
                      : "bg-surface-elevated border border-border text-primary"
                  }`}
                >
                  <div className="prose prose-invert prose-xs leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1 text-[10px] font-mono text-primary-dim border-t border-white/5">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="hover:text-primary flex items-center gap-1 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary-dim shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                <Bot className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border flex items-center gap-2 text-xs text-primary-muted font-mono">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                Analyzing biomechanics & nutrition...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-surface/50 border-t border-border overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
          {QUICK_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-[11px] font-mono text-primary-muted hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-accent" />
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={500}
                placeholder="Ask coach about form, macros, plateaus..."
                disabled={isLoading}
                className="w-full px-4 py-2.5 pr-14 rounded-xl bg-surface border border-border text-xs text-primary placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-primary-dim">
                {inputText.length}/500
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 h-auto text-xs font-mono shadow-accent-glow"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Send
            </Button>
          </form>

          <div className="flex items-center justify-between text-[10px] font-mono text-primary-dim px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-accent" />
              Evidence-based exercise science
            </span>
            <span>Esc to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
