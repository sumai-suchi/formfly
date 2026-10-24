import { Metadata } from "next";
import Link from "next/link";
import FeaturesSection from "@/components/FeaturesSection";

export const metadata: Metadata = {
  title: "Features & Capabilities | FormFly",
  description:
    "Explore FormFly's conversational form features: one-question-at-a-time flows, instant responsive floating widgets, zero-code embedding, and real-time lead capture.",
};

export default function FeaturesPage() {
  const highlights = [
    {
      metric: "3.4x",
      label: "Higher Completion",
      detail: "Conversational step-by-step flow eliminates user overwhelm and form fatigue.",
    },
    {
      metric: "< 3KB",
      label: "Zero-Bloat Widget",
      detail: "Ultra-fast async script snippet with zero third-party dependencies.",
    },
    {
      metric: "60s",
      label: "Rapid Integration",
      detail: "Copy one script tag into HTML, Webflow, Shopify, WordPress, or React.",
    },
    {
      metric: "100%",
      label: "Cross-Device Ready",
      detail: "Flawless mobile, tablet, and desktop responsive floating popup or standalone view.",
    },
  ];

  const corePillars = [
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "One Question at a Time",
      desc: "By focusing the respondent's attention on a single active question, drop-off rates plunge and users glide effortlessly through the workflow.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Keyboard-First Ergonomics",
      desc: "Respondents can answer and submit using purely Enter, number shortcuts for multiple-choice, or Y/N for binary choices. Zero mouse friction.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Full Brand Customization",
      desc: "Personalize your widget colors, launcher position, brand avatar, and customized greeting message to reflect your identity seamlessly.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Built-In Data Validation",
      desc: "Real-time client and server validation for email formats, required text, and predefined choices before respondents can proceed.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Real-Time Submission Radar",
      desc: "View submissions as they arrive on your dashboard, filter by form or date, review granular answers, and export clean data in one click.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Drop-In Floating Widget",
      desc: "Include our high-performance snippet on any external website. A smart floating pill launches an unobtrusive conversational dialog anywhere.",
    },
  ];

  return (
    <div className="flex flex-col bg-[#090a0f] text-slate-100">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[80px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-indigo-400">Features</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-medium text-indigo-300 mb-5">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              01 // CORE PRODUCT CAPABILITIES
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Engineered for Conversation.{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-white bg-clip-text text-transparent">
                Tuned for Conversion.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Traditional web forms intimidate users with walls of repetitive inputs. FormFly replaces static friction with an intelligent, dynamic chat sequence that keeps completion rates peak.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all active:scale-95"
              >
                <span>Start Building Free</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all"
              >
                <span>Try Live Simulator</span>
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-indigo-500/30 transition-colors"
              >
                <div className="text-3xl font-extrabold text-white tracking-tight">{h.metric}</div>
                <div className="mt-1 text-sm font-semibold text-indigo-300">{h.label}</div>
                <div className="mt-2 text-xs text-slate-400 leading-relaxed">{h.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Interactive Bento Section */}
      <FeaturesSection />

      {/* Deep-Dive Pillar Grid */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Every detail crafted for frictionless data capture
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Explore the technical capabilities that make FormFly the most responsive conversational form framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corePillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl border border-white/10 bg-[#0d0f17] hover:border-indigo-500/40 hover:bg-[#111420] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs FormFly */}
      <section className="py-20 border-t border-white/5 bg-slate-950/40">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Comparison Matrix
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              FormFly vs. Traditional Web Forms
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0d14]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase font-mono text-slate-400">
                <tr>
                  <th className="px-6 py-4">Capability</th>
                  <th className="px-6 py-4 text-slate-400">Traditional Forms</th>
                  <th className="px-6 py-4 text-indigo-300 font-semibold">FormFly Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Visual Presentation</td>
                  <td className="px-6 py-4 text-slate-400">Static wall of 10+ open inputs</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">Focused 1 question at a time</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Average Completion Rate</td>
                  <td className="px-6 py-4 text-slate-400">~14% to 22%</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">~58% to 74% (3x higher)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Mobile Responsiveness</td>
                  <td className="px-6 py-4 text-slate-400">Pinch-to-zoom, misaligned touch targets</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">Native messenger style with quick taps</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Website Integration</td>
                  <td className="px-6 py-4 text-slate-400">Heavy iframes, bulky CSS clashes</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">Single script tag or floating widget</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Keyboard Interaction</td>
                  <td className="px-6 py-4 text-slate-400">Cumbersome tab-cycling</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">Full Enter & shortcut key support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Build Your First Conversational Form?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
            Get started right now. Create custom questions, customize your palette, and launch your widget in under 3 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              Launch Form Builder
            </Link>
            <Link
              href="/demo"
              className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              See Interactive Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
