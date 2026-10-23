"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function FeaturesSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<"conversational" | "traditional">("conversational");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useGSAP(
    () => {
      // Animate Section Header
      gsap.from(".features-header > *", {
        scrollTrigger: {
          trigger: ".features-header",
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

      // Animate Bento Cards with smooth staggered entrance
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".feature-grid",
          start: "top 90%",
          once: true,
        },
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });

      // Subtle pulse on badge indicators
      gsap.to(".live-pulse", {
        scale: 1.25,
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(
      '<script src="https://formfly.app/widget.js" data-form-id="form_8291"></script>'
    );
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative overflow-hidden bg-[#090a0f] py-28 text-slate-100 border-t border-white/5"
    >
      {/* Blueprint grid accent & glow */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
      <div className="pointer-events-none absolute top-1/2 -left-48 h-96 w-96 rounded-full bg-indigo-600/10 blur-[60px]" />
      <div className="pointer-events-none absolute top-1/3 -right-48 h-96 w-96 rounded-full bg-purple-600/10 blur-[60px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="features-header mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-indigo-300">
            <span className="live-pulse h-2 w-2 rounded-full bg-indigo-400" />
            01 // CAPABILITIES & ADVANTAGES
          </div>

          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Engineered For Conversation.{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-white bg-clip-text text-transparent">
              Tuned For 3x Conversion.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Standard forms cause up to 75% user drop-off. FormFly reimagines data collection as an intuitive, fluid dialogue that keeps respondents engaged until the last question.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="feature-grid mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1: One Question At a Time (Spans 2 cols on lg) */}
          <div className="feature-card lg:col-span-2 group relative rounded-2xl border border-white/10 bg-[#0d0f17]/90 p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#10131e]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  Cognitive Ergonomics
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  One Question at a Time Flow
                </h3>
              </div>
              {/* Interactive comparison toggle */}
              <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("conversational")}
                  className={`rounded-md px-3 py-1 font-medium transition-all ${
                    activeTab === "conversational"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  FormFly Flow
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("traditional")}
                  className={`rounded-md px-3 py-1 font-medium transition-all ${
                    activeTab === "traditional"
                      ? "bg-rose-600/80 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Legacy Static Form
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              By isolating each question into focused conversational steps, respondents never feel overwhelmed by long, daunting lists of input fields.
            </p>

            {/* Interactive Flow Visualizer */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-5">
              {activeTab === "conversational" ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-mono">
                    <span>STEP 02 OF 03 • PROGRESS: 66%</span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      89.4% Completion Rate
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  </div>
                  {/* Chat simulated prompt */}
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-4">
                    <p className="text-sm font-medium text-slate-200">
                      What is the primary objective of your next form campaign?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-md border border-indigo-500/40 bg-indigo-600/30 px-3 py-1 text-xs text-indigo-200">
                        Lead Qualification
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                        Product Feedback
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                        Event RSVP
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 opacity-60">
                  <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
                    <span>14 MANDATORY FIELDS REMAINING</span>
                    <span>74.2% Drop-off Rate</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="rounded border border-dashed border-white/10 p-2">First Name *</div>
                    <div className="rounded border border-dashed border-white/10 p-2">Last Name *</div>
                    <div className="rounded border border-dashed border-white/10 p-2">Work Email *</div>
                    <div className="rounded border border-dashed border-white/10 p-2">Company Size *</div>
                  </div>
                  <p className="text-xs text-rose-300/80 italic">
                    Visitors abandon forms before submitting due to visual clutter and cognitive fatigue.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bento Card 2: Versatile Question Types */}
          <div className="feature-card group relative rounded-2xl border border-white/10 bg-[#0d0f17]/90 p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#10131e]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Versatile Input Types
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Tailor each response format with zero coding. Support every major input pattern natively.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                ✉️ Email w/ Validation
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                💬 Short & Long Text
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                🔘 Multiple Choice Pills
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                ⚡ Yes / No Switches
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                ⭐ Star & CSAT Ratings
              </span>
            </div>
          </div>

          {/* Bento Card 3: 1-Line Embed Anywhere */}
          <div className="feature-card group relative rounded-2xl border border-white/10 bg-[#0d0f17]/90 p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#10131e]">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                &lt; 15KB BUNDLE
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Instant Script Embed
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Paste one script tag into HTML, Next.js, WordPress, Webflow, or Shopify. Works standalone or as a floating launcher.
            </p>

            {/* Code Box */}
            <div className="mt-5 rounded-lg border border-white/10 bg-black/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>embed-snippet.html</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedSnippet ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <code className="block text-[11px] font-mono text-indigo-300 break-all select-all">
                {`<script src="https://formfly.app/widget.js" data-form-id="form_8291"></script>`}
              </code>
            </div>
          </div>

          {/* Bento Card 4: Smart Logic & Routing (Spans 2 cols on lg) */}
          <div className="feature-card lg:col-span-2 group relative rounded-2xl border border-white/10 bg-[#0d0f17]/90 p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#10131e]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div>
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                  Adaptive Logic
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Intelligent Conditional Branching
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                Zero Code Needed
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Dynamically branch questions based on user answers. Ask follow-up details only when needed, routing high-value leads straight to booking links.
            </p>

            {/* Visual Node Tree */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                <span className="text-[10px] font-mono text-indigo-400">TRIGGER QUESTION</span>
                <p className="mt-1 text-xs font-semibold text-slate-200">
                  &ldquo;What is your team size?&rdquo;
                </p>
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5">
                <span className="text-[10px] font-mono text-emerald-400">BRANCH A: &gt; 50 SEATS</span>
                <p className="mt-1 text-xs font-medium text-slate-300">
                  → Route to Enterprise Sales Calendar
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                <span className="text-[10px] font-mono text-amber-400">BRANCH B: &lt; 50 SEATS</span>
                <p className="mt-1 text-xs font-medium text-slate-300">
                  → Route to Self-Serve Signup Link
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 5: Real-time Analytics */}
          <div className="feature-card group relative rounded-2xl border border-white/10 bg-[#0d0f17]/90 p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#10131e]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Real-Time Submissions
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Every completed form updates your live dashboard immediately with zero delay.
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 text-xs">
                <span className="text-slate-400">Average completion time</span>
                <span className="font-mono text-emerald-400 font-semibold">42 seconds</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 text-xs">
                <span className="text-slate-400">Drop-off reduction</span>
                <span className="font-mono text-indigo-400 font-semibold">-58%</span>
              </div>
            </div>
          </div>

          {/* Bento Card 6: Brand Customization */}
          <div className="feature-card group relative rounded-2xl border border-white/10 bg-[#0d0f17]/90 p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#10131e]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a7 7 0 0 0 7 7c0 2-2 3-2 3s-1 1-1 3" />
                <path d="M12 18h.01" />
              </svg>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Custom Brand Themes
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Customize colors, avatars, greeting messages, and styles to blend seamlessly with your brand.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-indigo-600 ring-2 ring-indigo-400/50" />
              <span className="h-5 w-5 rounded-full bg-purple-600 opacity-60" />
              <span className="h-5 w-5 rounded-full bg-emerald-600 opacity-60" />
              <span className="h-5 w-5 rounded-full bg-rose-600 opacity-60" />
              <span className="ml-2 text-xs font-mono text-slate-400">Light / Dark themes</span>
            </div>
          </div>

        </div>

        {/* Bottom Feature Assurance Bar */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-extrabold text-white">⚡ &lt; 50ms</div>
              <div className="mt-1 text-xs text-slate-400">Widget Load Latency</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400">100%</div>
              <div className="mt-1 text-xs text-slate-400">Mobile & Keyboard Friendly</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-indigo-400">Zero</div>
              <div className="mt-1 text-xs text-slate-400">Third-Party Tracking Cookies</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-400">99.99%</div>
              <div className="mt-1 text-xs text-slate-400">SLA Guaranteed Uptime</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
