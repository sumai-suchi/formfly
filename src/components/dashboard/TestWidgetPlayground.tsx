"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TestWidgetPlaygroundProps {
  formId: string;
  publicId: string;
  title: string;
  status: string;
  primaryColor: string;
}

export default function TestWidgetPlayground({
  formId,
  publicId,
  title,
  status,
  primaryColor,
}: TestWidgetPlaygroundProps) {
  const router = useRouter();

  const cleanupWidget = useCallback(() => {
    if (typeof window === "undefined") return;
    const formfly = (window as unknown as { FormFly?: { destroy?: (id?: string) => void } }).FormFly;
    if (formfly?.destroy) {
      formfly.destroy(publicId);
    }
    document
      .querySelectorAll(
        `[data-formfly-widget="${publicId}"], [data-formfly-widget-panel="${publicId}"], .ff-widget-container, .ff-widget-panel`
      )
      .forEach((el) => el.remove());
    const scriptEl = document.getElementById(`formfly-widget-script-${publicId}`);
    if (scriptEl) scriptEl.remove();
  }, [publicId]);

  useEffect(() => {
    // Dynamically inject the widget script on mount
    const scriptId = `formfly-widget-script-${publicId}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "/formfly-widget.js";
      script.setAttribute("data-form-id", publicId);
      script.setAttribute("data-theme", primaryColor);
      script.setAttribute("data-position", "bottom-right");
      script.setAttribute("data-btn-text", "Chat with us");
      script.async = true;
      document.body.appendChild(script);
    }

    // Cleanup when leaving the test playground
    return () => {
      cleanupWidget();
    };
  }, [publicId, primaryColor, cleanupWidget]);

  const handleBackToBuilder = () => {
    cleanupWidget();
    router.push(`/dashboard/form/${formId}/builder`);
  };

  const handleToggleWidget = () => {
    const formfly = (window as unknown as { FormFly?: { toggle?: (id?: string) => void } }).FormFly;
    if (formfly?.toggle) {
      formfly.toggle(publicId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* ── Test Banner Bar ─────────────────────────────────────────── */}
      <aside
        aria-label="Widget test playground toolbar"
        className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0d0f17]/95 px-4 py-2.5 backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToBuilder}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Builder
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white">Floating Widget Live Test</span>
            <span className="hidden sm:inline text-xs text-slate-400">• Form: “{title}”</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              status === "PUBLISHED"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
            }`}
          >
            {status}
          </span>

          <button
            type="button"
            onClick={handleToggleWidget}
            className="rounded-lg bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition cursor-pointer"
          >
            Test FormFly.toggle()
          </button>
        </div>
      </aside>

      {/* ── Simulated External Website Content ──────────────────────── */}
      <main className="flex-1 flex flex-col">
        {/* Mock Brand Header */}
        <header className="border-b border-white/5 bg-slate-900/40 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-sm">
                A
              </span>
              <span className="font-bold text-white tracking-tight">Acme Global Ltd</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
              <span className="hover:text-white transition cursor-pointer">Platform</span>
              <span className="hover:text-white transition cursor-pointer">Solutions</span>
              <span className="hover:text-white transition cursor-pointer">Enterprise</span>
              <span className="hover:text-white transition cursor-pointer">Pricing</span>
            </nav>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleWidget}
                className="rounded-lg border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 transition cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-6 py-16 sm:py-24 overflow-hidden text-center flex-1">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              External Website Simulation
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Test your FormFly floating chat widget in a real environment.
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Look at the bottom right corner of this page. The floating launcher bubble is active, responsive, and ready for you to test conversation, keyboard behavior, and closing.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleToggleWidget}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/25 hover:bg-indigo-500 transition cursor-pointer"
              >
                Open Form via JavaScript API
              </button>
            </div>
          </div>

          {/* Sample Grid of Features */}
          <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6">
              <h3 className="text-sm font-semibold text-white mb-2">100% Responsive</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adapts seamlessly across mobile phones (down to 320px), tablets, and desktop monitors without viewport clipping.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6">
              <h3 className="text-sm font-semibold text-white mb-2">Non-Intrusive Integration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Isolated with strict CSS containment and high z-index (2147483000) so it never collides with host website styles.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6">
              <h3 className="text-sm font-semibold text-white mb-2">Instant Event Handling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supports postMessage communication, Escape key closing, and custom JavaScript trigger APIs.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
