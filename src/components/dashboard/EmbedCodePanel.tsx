"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PublishedForm {
  id: string;
  publicId: string;
  title: string;
  primaryColor?: string;
}

export default function EmbedCodePanel({ forms }: { forms: PublishedForm[] }) {
  const [selectedId, setSelectedId] = useState(forms[0]?.id ?? "");
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState<"snippet" | "url" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [btnText, setBtnText] = useState("Chat with us");
  const [iconOnly, setIconOnly] = useState(false);
  const [customColor, setCustomColor] = useState<string | null>(null);

  const selectedForm = forms.find((form) => form.id === selectedId);
  const themeColor = customColor ?? selectedForm?.primaryColor ?? "#4f46e5";

  useEffect(() => {
    const timer = window.setTimeout(() => setBaseUrl(window.location.origin), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const publicUrl = selectedForm ? `${origin}/forms/${selectedForm.publicId}` : "";
  const testWidgetUrl = selectedForm ? `/forms/${selectedForm.publicId}/test-widget` : "";

  // Build snippet
  const snippetAttrs = [
    `src="${origin || "https://your-domain.com"}/formfly-widget.js"`,
    `data-form-id="${selectedForm?.publicId ?? ""}"`,
  ];
  if (themeColor && themeColor !== "#4f46e5") {
    snippetAttrs.push(`data-theme="${themeColor}"`);
  }
  if (position !== "bottom-right") {
    snippetAttrs.push(`data-position="${position}"`);
  }
  if (btnText && btnText !== "Chat with us" && !iconOnly) {
    snippetAttrs.push(`data-btn-text="${btnText}"`);
  }
  if (iconOnly) {
    snippetAttrs.push(`data-icon-only="true"`);
  }
  snippetAttrs.push("async");

  const snippet = selectedForm
    ? `<script \n  ${snippetAttrs.join("\n  ")}>\n</script>`
    : "";

  const copyText = async (value: string, kind: "snippet" | "url") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  if (forms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-14 text-center">
        <h2 className="text-sm font-semibold text-white">Publish a form to embed it</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Published forms appear here with a public link and a floating chat widget snippet ready for external sites.
        </p>
        <Link
          href="/dashboard/forms"
          className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
        >
          Open My Forms
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Form Selector */}
      <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6">
        <label htmlFor="embed-form" className="mb-2 block text-xs font-medium text-slate-400">
          Select Published Form
        </label>
        <select
          id="embed-form"
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            setCopied(null);
            setPreviewOpen(false);
          }}
          className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50"
        >
          {forms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.title}
            </option>
          ))}
        </select>
      </section>

      {selectedForm && (
        <>
          {/* Customization Options */}
          <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Widget Configuration</h2>
            <p className="text-xs text-slate-400">
              Customize how the floating widget launcher appears on your external website.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Position */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">Position</label>
                <div className="flex rounded-lg border border-white/10 bg-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPosition("bottom-right")}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                      position === "bottom-right"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Bottom Right
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition("bottom-left")}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                      position === "bottom-left"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Bottom Left
                  </button>
                </div>
              </div>

              {/* Launcher Text */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">Launcher Label</label>
                <input
                  type="text"
                  value={btnText}
                  disabled={iconOnly}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="Chat with us"
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                />
              </div>

              {/* Style & Theme Color */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">Color & Style</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-white/10 bg-transparent p-0"
                    title="Choose brand accent color"
                  />
                  <button
                    type="button"
                    onClick={() => setIconOnly(!iconOnly)}
                    className={`flex-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      iconOnly
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                        : "border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {iconOnly ? "Icon Only" : "Pill with text"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Script Snippet */}
          <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-white">Floating JavaScript Widget Snippet</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Copy and paste this script right before the closing <code className="text-indigo-300 font-mono">&lt;/body&gt;</code> tag of your website. It injects a fast, responsive floating chat launcher.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-[#07080c] p-3.5 font-mono text-xs text-indigo-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap break-all leading-relaxed">{snippet}</pre>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void copyText(snippet, "snippet")}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copied === "snippet" ? "Copied Embed Code!" : "Copy Embed Code"}
              </button>
              <a
                href={testWidgetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Test Live Widget in New Tab ↗
              </a>
            </div>
          </section>

          {/* Responsive Live Interactive Preview */}
          <section className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/50">
            <div className="flex flex-wrap items-center justify-between border-b border-white/8 px-4 py-3.5 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold text-white">Live Responsive Widget Preview</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Click the floating launcher button to experience the conversational widget.
                </p>
              </div>
              <div className="mt-2 sm:mt-0 flex rounded-lg border border-white/10 bg-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                    previewDevice === "desktop"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Desktop View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                    previewDevice === "mobile"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mobile View (375px)
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-[#07080c] p-4 sm:p-6 overflow-hidden">
              <div
                className={`relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-300 shadow-2xl ${
                  previewDevice === "mobile"
                    ? "w-[375px] h-[520px]"
                    : "w-full h-[460px]"
                }`}
              >
                {/* Mock Browser Header */}
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-950 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-red-500/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                  <div className="ml-2 flex-1 rounded bg-slate-800/80 px-2.5 py-0.5 text-[10px] text-slate-400 truncate">
                    https://client-website.com
                  </div>
                </div>

                {/* Simulated Content */}
                <div className="p-6 space-y-4 opacity-70">
                  <div className="h-5 w-40 rounded bg-indigo-500/35" />
                  <div className="h-3 w-5/6 rounded bg-slate-700" />
                  <div className="h-3 w-2/3 rounded bg-slate-700" />
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="h-20 rounded-xl border border-slate-700/60 bg-slate-800/40 p-3" />
                    <div className="h-20 rounded-xl border border-slate-700/60 bg-slate-800/40 p-3" />
                  </div>
                </div>

                {/* Floating Widget Frame inside Preview */}
                {previewOpen && (
                  <div
                    className={`absolute z-20 overflow-hidden rounded-2xl border border-white/15 bg-[#090a0f] shadow-2xl transition-all ${
                      previewDevice === "mobile"
                        ? "inset-x-2 bottom-16 top-12"
                        : position === "bottom-left"
                        ? "bottom-16 left-4 h-[350px] w-[320px]"
                        : "bottom-16 right-4 h-[350px] w-[320px]"
                    }`}
                  >
                    <iframe
                      key={selectedForm.publicId}
                      title={`${selectedForm.title} floating widget preview`}
                      src={`/forms/${selectedForm.publicId}?embed=1&preview=1`}
                      className="h-full w-full border-0"
                    />
                  </div>
                )}

                {/* Floating Launcher Button inside Preview */}
                <button
                  type="button"
                  aria-expanded={previewOpen}
                  onClick={() => setPreviewOpen(!previewOpen)}
                  style={{ backgroundColor: themeColor }}
                  className={`absolute z-30 inline-flex items-center gap-2 rounded-full text-white shadow-xl transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                    iconOnly ? "h-11 w-11 justify-center p-0" : "px-4 py-2.5 text-xs font-semibold"
                  } ${
                    previewDevice === "mobile"
                      ? "bottom-3 right-3"
                      : position === "bottom-left"
                      ? "bottom-4 left-4"
                      : "bottom-4 right-4"
                  }`}
                >
                  {previewOpen ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
                    </svg>
                  )}
                  {!iconOnly && <span>{previewOpen ? "Close chat" : btnText}</span>}
                </button>
              </div>
            </div>
          </section>

          {/* Public Form Direct URL */}
          <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-white">Direct Form Share Link</h2>
            <p className="mt-1 text-xs text-slate-400">Share this standalone link to open the full form in a new tab.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={publicUrl}
                aria-label="Public form URL"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#07080c] px-3.5 py-2.5 text-xs sm:text-sm text-slate-300"
              />
              <button
                type="button"
                onClick={() => void copyText(publicUrl, "url")}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:bg-white/5 transition"
              >
                {copied === "url" ? "Copied Link!" : "Copy Link"}
              </button>
              <a
                href={`/forms/${selectedForm.publicId}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-center text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 transition"
              >
                Open Form ↗
              </a>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
