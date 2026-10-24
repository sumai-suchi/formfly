"use client";

import { useState } from "react";
import Link from "next/link";
import { smoothScrollTo } from "@/lib/gsap";

export default function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    setIsSubscribed(true);
    setEmailInput("");
  };

  const scrollToTop = () => {
    smoothScrollTo("body", 0);
  };

  return (
    <footer className="relative overflow-hidden bg-[#07080c] border-t border-white/10 text-slate-300">
      {/* Background blueprint grid & radial glow */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[700px] rounded-full bg-indigo-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Newsletter (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-transform duration-200 group-hover:scale-105">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M16 10h.01" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FormFly</span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The conversational form engine that turns static input fields into high-converting chatbot dialogues. Embed anywhere in 60 seconds with a single script tag.
            </p>

            {/* Live Uptime Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.98% System Uptime • Operational</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Subscribe to Product Changelog
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 py-2 font-medium">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Thank you! You&apos;re subscribed to FormFly updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Product Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors">
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Form Studio
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  Analytics Radar
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                    NEW
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Developers & Integrations (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Developers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Single Script Tag
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors">
                  Code Generator
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Webhooks & API
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Next.js & React Guide
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Security & GDPR
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Community (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href="mailto:support@formfly.app"
                  className="hover:text-white transition-colors font-mono text-xs"
                >
                  support@formfly.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a
                  href="mailto:sales@formfly.app"
                  className="hover:text-white transition-colors font-mono text-xs"
                >
                  sales@formfly.app
                </a>
              </li>
            </ul>

            {/* Social Icons Strip */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                  title="GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                  title="X (Twitter)"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                  title="Discord"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & GSAP Scroll To Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>© 2026 FormFly Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="hidden sm:inline">Built for modern conversational web experiences.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-slate-400">
              Zero cookies • ISO 27001 Ready
            </span>

            {/* GSAP Smooth Scroll Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              <span>Back to top</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
