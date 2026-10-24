import { Metadata } from "next";
import Link from "next/link";
import ChatbotDemoSection from "@/components/ChatbotDemoSection";

export const metadata: Metadata = {
  title: "Live Interactive Demo | FormFly",
  description:
    "Test drive FormFly's conversational form engine in a live interactive simulator. Switch between SaaS lead gen, feedback surveys, and event RSVP templates.",
};

export default function DemoPage() {
  const keyboardShortcuts = [
    { key: "Enter ↵", desc: "Submit active response and advance to next question" },
    { key: "1 – 4", desc: "Select corresponding option in multiple-choice cards" },
    { key: "Y / N", desc: "Quick answer for Yes/No boolean questions" },
    { key: "Tab", desc: "Focus input field smoothly without using the mouse" },
  ];

  const templatesInfo = [
    {
      title: "SaaS Lead Qualification",
      badge: "High Intent",
      desc: "Ask work email, team size, and booking interest. Filters unqualified visitors automatically.",
    },
    {
      title: "Customer CSAT & Feedback",
      badge: "User Insights",
      desc: "Measure satisfaction with star/numeric rating, gather open suggestions, and request follow-up interviews.",
    },
    {
      title: "Webinar & Event RSVP",
      badge: "Event Registrations",
      desc: "Collect attendee name, breakout session preferences, and calendar invite addresses without overwhelming users.",
    },
  ];

  return (
    <div className="flex flex-col bg-[#090a0f] text-slate-100">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-20 border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/25 via-emerald-600/15 to-transparent blur-[80px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-indigo-400">Live Demo</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300 mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              03 // INTERACTIVE SIMULATION
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Experience FormFly Through Your{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-indigo-300 to-white bg-clip-text text-transparent">
                User&apos;s Eyes.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Select any of the live templates below to test interactive responses, keyboard shortcuts, validation states, and embed snippet generation in real-time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all active:scale-95"
              >
                <span>Build My Own Form</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all"
              >
                <span>View All Features</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Demo Simulator */}
      <ChatbotDemoSection />

      {/* Keyboard Ergonomics & Efficiency Guide */}
      <section className="py-20 border-t border-white/5 relative bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Keyboard-First UX
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Effortless Navigation Shortcuts
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              FormFly forms can be completed in seconds without touching the trackpad or mouse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyboardShortcuts.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-[#0d0f17] flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-mono font-bold text-indigo-300 mb-3 shadow-sm">
                    {s.key}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-built Templates Highlights */}
      <section className="py-20 border-t border-white/5 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Ready-Made Templates
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Pre-configured Flows for Instant Deployment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templatesInfo.map((tpl, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl border border-white/10 bg-[#0d0f17] hover:border-indigo-500/30 transition-all"
              >
                <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {tpl.badge}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{tpl.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">{tpl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Loved the Experience? Create Yours Now.
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
            Build your own conversational form in under 60 seconds and embed it anywhere with a single script tag.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              Open Form Builder
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
