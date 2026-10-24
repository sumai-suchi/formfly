import { Metadata } from "next";
import Link from "next/link";
import HowItWorksSection from "@/components/HowItWorksSection";

export const metadata: Metadata = {
  title: "How It Works | FormFly",
  description:
    "See how FormFly transforms static data capture into fluid conversation. Create questions, customize widget styling, and drop a single script tag into any site in minutes.",
};

export default function HowItWorksPage() {
  const platforms = [
    { name: "Webflow", desc: "Paste snippet in Page Settings or Custom Code embed." },
    { name: "WordPress", desc: "Drop into Header/Footer scripts or any custom HTML widget." },
    { name: "Shopify", desc: "Add to theme.liquid before the closing </body> tag." },
    { name: "Next.js / React", desc: "Include via next/script or standard useEffect hook." },
    { name: "Framer", desc: "Insert into Custom Code head or page settings." },
    { name: "Plain HTML", desc: "Single script tag works out of the box with zero build step." },
  ];

  const faqs = [
    {
      q: "Will the FormFly widget slow down my website load time?",
      a: "Not at all. The FormFly widget script is under 3KB and loads asynchronously. It does not block page rendering, stylesheets, or Core Web Vitals.",
    },
    {
      q: "Can I use FormFly as a standalone landing page instead of a widget?",
      a: "Yes! Every form you create automatically gets a dedicated public URL (e.g. formfly.app/forms/your-form) that can be shared in emails, social bios, or linked directly.",
    },
    {
      q: "What types of input fields can I ask?",
      a: "You can ask free-form text, validated email addresses, multiple-choice option grids, yes/no binary switches, and customer satisfaction ratings.",
    },
    {
      q: "How do I receive user submissions?",
      a: "All completed submissions stream instantly to your FormFly dashboard. You can inspect individual answers, review response timelines, and export data in clean format.",
    },
  ];

  return (
    <div className="flex flex-col bg-[#090a0f] text-slate-100">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-transparent blur-[80px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-indigo-400">How It Works</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-mono font-medium text-purple-300 mb-5">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              02 // 3-STEP INTEGRATION ENGINE
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              From Blank Canvas to Live Form in{" "}
              <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-white bg-clip-text text-transparent">
                Less Than 3 Minutes.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              No complex chatbot decision-trees or tedious CSS styling. FormFly handles the micro-interactions, responsive sizing, and submission pipeline so you can focus on conversing with customers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all active:scale-95"
              >
                <span>Create Form Now</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all"
              >
                <span>Test Live Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive How It Works Section */}
      <HowItWorksSection />

      {/* Technical Deep Dive: 4 Pillars */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Step-by-Step Architecture
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Under the Hood of a FormFly Workflow
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Here is what happens from the moment you create a question to the moment a customer submits their answer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1 */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#0d0f17] relative">
              <div className="text-xs font-mono text-indigo-400 mb-2">PHASE 01 // BUILDER</div>
              <h3 className="text-xl font-bold text-white mb-3">Visual Dialogue Designer</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Compose questions just like you are drafting a conversation. Set custom placeholder prompts, mark questions as required, and add option tags with instant preview.
              </p>
              <div className="rounded-xl border border-white/5 bg-[#090a0f] p-4 text-xs font-mono text-slate-300 space-y-2">
                <div className="text-emerald-400">✓ Type: Short Text, Email, Choice, Yes/No</div>
                <div className="text-slate-400">✓ Reorder questions with one click</div>
                <div className="text-slate-400">✓ Real-time input preview in editor</div>
              </div>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#0d0f17] relative">
              <div className="text-xs font-mono text-purple-400 mb-2">PHASE 02 // PERSONALIZATION</div>
              <h3 className="text-xl font-bold text-white mb-3">Custom Theme & Branding</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Align the form widget with your company visual branding. Adjust launcher color, welcome message greeting, brand avatar, and launcher positioning.
              </p>
              <div className="rounded-xl border border-white/5 bg-[#090a0f] p-4 text-xs font-mono text-slate-300 space-y-2">
                <div className="text-purple-400">✓ Multiple color themes (Indigo, Emerald, Violet...)</div>
                <div className="text-slate-400">✓ Floating launcher or full standalone view</div>
                <div className="text-slate-400">✓ Mobile responsive viewport adaptation</div>
              </div>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#0d0f17] relative">
              <div className="text-xs font-mono text-emerald-400 mb-2">PHASE 03 // EMBEDDING</div>
              <h3 className="text-xl font-bold text-white mb-3">Single-Script Integration</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Embed your widget anywhere on the internet. Zero build steps, zero package installations. A clean vanilla JS script handles the iframe isolation and postMessage bridge.
              </p>
              <div className="rounded-xl border border-white/5 bg-[#090a0f] p-4 text-xs font-mono text-slate-400">
                <code className="text-indigo-300">&lt;script src=&quot;https://formfly.app/formfly-widget.js&quot; data-form-id=&quot;...&quot;&gt;&lt;/script&gt;</code>
              </div>
            </div>

            {/* Box 4 */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#0d0f17] relative">
              <div className="text-xs font-mono text-amber-400 mb-2">PHASE 04 // DATA PIPELINE</div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Submissions & Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Responses are encrypted in transit and securely stored in your PostgreSQL database. Review answers on your dedicated Submissions tab or export cleanly.
              </p>
              <div className="rounded-xl border border-white/5 bg-[#090a0f] p-4 text-xs font-mono text-slate-300 space-y-2">
                <div className="text-amber-400">✓ Instant submission webhook and storage</div>
                <div className="text-slate-400">✓ Granular answer inspection per user</div>
                <div className="text-slate-400">✓ Pagination & response status filtering</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms Grid */}
      <section className="py-20 border-t border-white/5 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Works Everywhere
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Seamless Integration Across All Major Platforms
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-[#0b0d14] hover:border-indigo-500/30 transition-colors"
              >
                <div className="text-base font-bold text-white">{p.name}</div>
                <div className="mt-2 text-xs text-slate-400 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/10 bg-[#0d0f17]/80 backdrop-blur-sm"
              >
                <h3 className="text-base font-semibold text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to See FormFly in Action on Your Site?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
            Design your first conversational dialogue today and boost your lead generation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              Start Free Today
            </Link>
            <Link
              href="/features"
              className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
