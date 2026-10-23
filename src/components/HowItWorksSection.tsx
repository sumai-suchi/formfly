"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  useGSAP(
    () => {
      // Header Animation
      gsap.from(".how-it-works-header > *", {
        scrollTrigger: {
          trigger: ".how-it-works-header",
          start: "top 92%",
          once: true,
        },
        opacity: 0,
        y: 18,
        stagger: 0.05,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });

      // Step Cards Entrance
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: ".steps-container",
          start: "top 90%",
          once: true,
        },
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });

      // Animated Glowing Timeline Connector
      gsap.fromTo(
        ".timeline-glow-line",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".steps-container",
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const steps = [
    {
      number: "01",
      tag: "BUILD IN MINUTES",
      title: "Design Your Conversational Flow",
      description:
        "Draft your form just like writing a chat dialogue. Add text, validated email, multiple-choice, or yes/no questions with intuitive reordering.",
      highlight: "No complex bot nodes or coding needed.",
      visualBadge: "Question Engine",
    },
    {
      number: "02",
      tag: "THEME & BRAND",
      title: "Customize Personality & Styling",
      description:
        "Select your primary brand colors, widget launcher style (floating bubble or embedded page section), avatar, and welcome greeting message.",
      highlight: "Matches your website aesthetics perfectly.",
      visualBadge: "Widget Studio",
    },
    {
      number: "03",
      tag: "EMBED & COLLECT",
      title: "Drop Script & Watch Leads Convert",
      description:
        "Copy your single <script> tag into any HTML, Webflow, WordPress, or React app. Receive instant submissions on your dashboard in real-time.",
      highlight: "Lightweight, zero-cookie, lightning-fast.",
      visualBadge: "Real-Time Pipeline",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative overflow-hidden bg-[#090a0f] py-28 text-slate-100 border-t border-white/5"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[60px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="how-it-works-header mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            02 // THREE SIMPLE STEPS
          </div>

          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            From Blank Canvas to Live Widget{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-white bg-clip-text text-transparent">
              In Under 3 Minutes.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Eliminate complex funnel builders. FormFly makes authoring, styling, and deploying conversational forms as fast as sending a chat message.
          </p>
        </div>

        {/* Desktop Timeline Visual Line */}
        <div className="relative mt-20 steps-container">
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-white/10 z-0">
            <div className="timeline-glow-line h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const stepIndex = idx + 1;
              const isSelected = activeStep === stepIndex;

              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(stepIndex)}
                  className={`step-card cursor-pointer group relative rounded-2xl border p-7 backdrop-blur-sm transition-all duration-300 ${
                    isSelected
                      ? "border-indigo-500/60 bg-[#101322] shadow-2xl shadow-indigo-950/60 ring-1 ring-indigo-500/30"
                      : "border-white/10 bg-[#0d0f17]/90 hover:border-white/20 hover:bg-[#10131e]"
                  }`}
                >
                  {/* Step Number Marker */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-base font-extrabold font-mono transition-transform duration-300 group-hover:scale-105 ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40"
                          : "border border-white/10 bg-white/[0.04] text-slate-300"
                      }`}
                    >
                      {step.number}
                    </div>

                    <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                      {step.tag}
                    </span>
                  </div>

                  {/* Step Content */}
                  <h3 className="mt-6 text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-300">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{step.highlight}</span>
                  </div>

                  {/* Interactive Micro Mockup Box */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs">
                    {stepIndex === 1 && (
                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                          <span className="text-indigo-400"># Q1: Text Input</span>
                          <span className="text-emerald-400">Required</span>
                        </div>
                        <div className="text-slate-300 truncate">&ldquo;What is your full name?&rdquo;</div>
                        <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2 pt-1">
                          <span className="text-indigo-400"># Q2: Email Input</span>
                          <span className="text-emerald-400">Validated</span>
                        </div>
                        <div className="text-slate-300 truncate">&ldquo;Where can we email details?&rdquo;</div>
                      </div>
                    )}

                    {stepIndex === 2 && (
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Primary Theme</span>
                          <div className="flex items-center gap-1.5">
                            <span className="h-3.5 w-3.5 rounded-full bg-indigo-600 ring-2 ring-white/40" />
                            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                            <span className="h-3.5 w-3.5 rounded-full bg-purple-500" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Launcher Mode</span>
                          <span className="text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                            Floating Bubble
                          </span>
                        </div>
                        <div className="text-slate-400">
                          Avatar: <span className="text-slate-200">FormFly Bot (Default)</span>
                        </div>
                      </div>
                    )}

                    {stepIndex === 3 && (
                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center justify-between text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Webhook Dispatched
                          </span>
                          <span className="text-slate-500">Just now</span>
                        </div>
                        <div className="rounded bg-white/[0.04] p-2 text-slate-300 text-[10px] break-all">
                          {`POST /api/webhooks -> 200 OK`}
                        </div>
                        <div className="text-indigo-300 text-[10px]">
                          +1 Lead captured in database
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Strip */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
            </span>
            <span className="text-xs sm:text-sm text-slate-300">
              Ready to see how it works in real-time? Test our interactive widget simulator below.
            </span>
          </div>

          <a
            href="#demo"
            className="shrink-0 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1"
          >
            <span>Jump to Live Interactive Demo</span>
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
