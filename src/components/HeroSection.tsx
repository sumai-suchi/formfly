"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP, smoothScrollTo } from "@/lib/gsap";

type QuestionStep = 0 | 1 | 2 | 3;

export default function HeroSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const widgetCardRef = useRef<HTMLDivElement | null>(null);

  // Interactive state for the live chatbot widget demo inside the hero
  const [currentStep, setCurrentStep] = useState<QuestionStep>(1);
  const [userEmail, setUserEmail] = useState("");
  const [formType, setFormType] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", clearProps: "all" },
      });

      tl.from(".hero-badge", {
        opacity: 0,
        y: -10,
        duration: 0.3,
      })
        .from(
          ".hero-heading-line",
          {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.35,
          },
          "-=0.15"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 12,
            duration: 0.3,
          },
          "-=0.2"
        )
        .from(
          ".hero-cta-btn",
          {
            opacity: 0,
            y: 10,
            stagger: 0.05,
            duration: 0.25,
          },
          "-=0.15"
        )
        .from(
          ".hero-feature-item",
          {
            opacity: 0,
            y: 10,
            stagger: 0.04,
            duration: 0.25,
          },
          "-=0.15"
        )
        .from(
          widgetCardRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.35,
          },
          "-=0.15"
        );
    },
    { scope: containerRef }
  );

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !userEmail.includes("@")) return;
    setCurrentStep(2);
  };

  const handleTypeSelect = (type: string) => {
    setFormType(type);
    setCurrentStep(3);
  };

  const handleYesNoSelect = () => {
    setIsCompleted(true);
  };

  const handleResetDemo = () => {
    setCurrentStep(1);
    setUserEmail("");
    setFormType(null);
    setIsCompleted(false);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#090a0f] text-slate-100 pt-16 pb-28"
    >
      {/* Background blueprint grid & subtle lighting */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
      <div className="pointer-events-none absolute inset-0 glow-spotlight" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090a0f] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top Badge */}
        <div className="flex justify-center">
          <div className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>CONVERSATIONAL FORM PLATFORM</span>
            <span className="text-white/20">•</span>
            <span className="text-slate-300">EMBEDDABLE CHATBOT WIDGET</span>
          </div>
        </div>

        {/* Hero Title & Pitch */}
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            <span className="hero-heading-line block">Turn Traditional Forms</span>
            <span className="hero-heading-line block bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
              Into Interactive Chatbots.
            </span>
          </h1>

          <p className="hero-description mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-400">
            Build clean forms with text, email, multiple-choice, and yes/no questions. Deliver them one question at a time in an interactive chatbot widget that embeds on any website via a simple script or public URL.
          </p>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="hero-cta-btn group relative inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-500 active:scale-95"
            >
              <span>Create Form Now</span>
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <button
              onClick={() => {
                smoothScrollTo("#demo", 70);
              }}
              className="hero-cta-btn inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20 hover:text-white cursor-pointer"
            >
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>Test Interactive Demo</span>
            </button>
          </div>

          {/* Feature Pillars Strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-white/10 py-4 text-left">
            <div className="hero-feature-item">
              <div className="text-xs font-mono text-indigo-400">01 / QUESTIONS</div>
              <div className="text-sm font-medium text-slate-200 mt-1">One-at-a-time Flow</div>
            </div>
            <div className="hero-feature-item border-l border-white/10 pl-4">
              <div className="text-xs font-mono text-indigo-400">02 / INPUTS</div>
              <div className="text-sm font-medium text-slate-200 mt-1">Text, Email, Choice, Yes/No</div>
            </div>
            <div className="hero-feature-item border-l border-white/10 pl-4">
              <div className="text-xs font-mono text-indigo-400">03 / EMBED</div>
              <div className="text-sm font-medium text-slate-200 mt-1">Single JS Script Tag</div>
            </div>
            <div className="hero-feature-item border-l border-white/10 pl-4">
              <div className="text-xs font-mono text-indigo-400">04 / RESPONSES</div>
              <div className="text-sm font-medium text-slate-200 mt-1">Real-Time Submissions</div>
            </div>
          </div>
        </div>

        {/* Live Chatbot Widget Interactive Demo */}
        <div
          id="demo-widget"
          ref={widgetCardRef}
          className="relative mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl shadow-indigo-950/40 backdrop-blur-md overflow-hidden"
        >
          {/* Widget Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Lead Qualification Form</div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live Chatbot Widget
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                {showEmbedCode ? "Hide Snippet" : "<script> Embed"}
              </button>
              <button
                type="button"
                onClick={handleResetDemo}
                title="Restart Demo"
                className="rounded-md border border-white/10 bg-white/[0.04] p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Embed Snippet Bar (Expandable) */}
          {showEmbedCode && (
            <div className="border-b border-white/10 bg-black/70 px-5 py-3 font-mono text-[11px] text-slate-300">
              <div className="text-slate-400 text-[10px] mb-1">
                {"// Copy & paste into any external HTML page:"}
              </div>
              <code className="text-indigo-300 block select-all">
                {`<script src="https://formfly.app/formfly-widget.js" data-form-id="form_8291"></script>`}
              </code>
            </div>
          )}

          {/* Chat Stream Body */}
          <div className="p-6 space-y-4 min-h-[340px]">
            {/* Initial Welcome Message */}
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 text-[11px] font-mono">
                FF
              </div>
              <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
                Welcome to FormFly! Let us show you how questions are presented one at a time.
              </div>
            </div>

            {/* Step 1: Email Question */}
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 text-[11px] font-mono">
                FF
              </div>
              <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
                <span className="block text-[11px] font-mono text-indigo-400 mb-1">
                  Question 1 / 3: Email Input
                </span>
                What is your work email address?
              </div>
            </div>

            {/* User Submitted Step 1 */}
            {currentStep > 1 && (
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm bg-indigo-600 px-4 py-2 text-xs sm:text-sm text-white">
                  {userEmail}
                </div>
              </div>
            )}

            {/* Step 2: Multiple Choice Question */}
            {currentStep >= 2 && (
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 text-[11px] font-mono">
                  FF
                </div>
                <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
                  <span className="block text-[11px] font-mono text-indigo-400 mb-1">
                    Question 2 / 3: Multiple Choice
                  </span>
                  What kind of form do you want to create?
                </div>
              </div>
            )}

            {/* User Submitted Step 2 */}
            {currentStep > 2 && formType && (
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm bg-indigo-600 px-4 py-2 text-xs sm:text-sm text-white">
                  {formType}
                </div>
              </div>
            )}

            {/* Step 3: Yes/No Question */}
            {currentStep >= 3 && !isCompleted && (
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 text-[11px] font-mono">
                  FF
                </div>
                <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
                  <span className="block text-[11px] font-mono text-indigo-400 mb-1">
                    Question 3 / 3: Yes / No
                  </span>
                  Would you like to embed this as a floating widget on your site?
                </div>
              </div>
            )}

            {/* Completion Screen */}
            {isCompleted && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-white">Submission Complete!</div>
                <div className="text-xs text-slate-300 mt-1">
                  Responses are instantly stored in the database and visible on your dashboard.
                </div>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="mt-3 text-xs font-medium text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Restart Demo Flow
                </button>
              </div>
            )}
          </div>

          {/* Interactive Form Input Area based on current question */}
          {!isCompleted && (
            <div className="border-t border-white/10 bg-black/40 p-4">
              {currentStep === 1 && (
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email (e.g. alex@company.com)..."
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-2">
                  {["Lead Generation", "Customer Feedback", "Event Registration", "Contact Form"].map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleTypeSelect(option)}
                        className="rounded-lg border border-white/15 bg-white/[0.04] p-2.5 text-left text-xs font-medium text-slate-200 hover:border-indigo-500 hover:bg-indigo-600/10 hover:text-white transition-all cursor-pointer"
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleYesNoSelect}
                    className="flex-1 rounded-lg border border-indigo-500/40 bg-indigo-600/20 py-2.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleYesNoSelect}
                    className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Widget Footer Status */}
          <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-5 py-2.5 text-[11px] font-mono text-slate-400">
            <span>Question {currentStep} of 3</span>
            <span>Public URL & Embed Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
