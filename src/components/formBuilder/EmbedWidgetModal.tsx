"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FormData } from "@/types/form";

interface EmbedWidgetModalProps {
  form: FormData;
  isOpen: boolean;
  onClose: () => void;
  onPublish?: () => Promise<void>;
}

const emptySubscribe = () => () => {};

export default function EmbedWidgetModal({
  form,
  isOpen,
  onClose,
  onPublish,
}: EmbedWidgetModalProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [baseUrl, setBaseUrl] = useState("");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [btnText, setBtnText] = useState("Chat with us");
  const [iconOnly, setIconOnly] = useState(false);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const color = customColor ?? form.primaryColor ?? "#4f46e5";
  const [copiedType, setCopiedType] = useState<"snippet" | "url" | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"snippet" | "preview" | "guide">("snippet");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBaseUrl(window.location.origin);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  // Use current window origin for snippet generation
  const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const publicUrl = `${origin}/forms/${form.publicId}`;
  const testWidgetUrl = `/forms/${form.publicId}/test-widget`;

  // Build snippet with selected attributes
  const attributes = [
    `src="${origin || "https://your-domain.com"}/formfly-widget.js"`,
    `data-form-id="${form.publicId}"`,
  ];
  if (color && color !== "#4f46e5") {
    attributes.push(`data-theme="${color}"`);
  }
  if (position !== "bottom-right") {
    attributes.push(`data-position="${position}"`);
  }
  if (btnText && btnText !== "Chat with us" && !iconOnly) {
    attributes.push(`data-btn-text="${btnText}"`);
  }
  if (iconOnly) {
    attributes.push(`data-icon-only="true"`);
  }
  attributes.push("async");

  const embedSnippet = `<script \n  ${attributes.join("\n  ")}>\n</script>`;

  const copyToClipboard = async (text: string, type: "snippet" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      setCopiedType(null);
    }
  };

  const handlePublish = async () => {
    if (!onPublish) return;
    setPublishing(true);
    try {
      await onPublish();
    } finally {
      setPublishing(false);
    }
  };

  const modalMarkup = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="embed-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl my-auto rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 id="embed-modal-title" className="text-sm sm:text-base font-semibold text-white">
                Embed Floating Widget
              </h2>
              <p className="text-xs text-slate-400">Add this form chat to any external website via a snippet.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Draft Notice if applicable */}
        {form.status !== "PUBLISHED" && (
          <div className="mx-5 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-200 shrink-0">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Form is in <strong>Draft</strong>. External visitors cannot submit responses until published.</span>
            </div>
            {onPublish && (
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublish}
                className="rounded-lg bg-amber-500 px-3 py-1 font-semibold text-black hover:bg-amber-400 transition disabled:opacity-50"
              >
                {publishing ? "Publishing…" : "Publish Now"}
              </button>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/8 px-5 shrink-0 bg-slate-900/20">
          <button
            type="button"
            onClick={() => setActiveTab("snippet")}
            className={`border-b-2 py-3 px-3 text-xs sm:text-sm font-medium transition ${
              activeTab === "snippet"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Code Snippet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`border-b-2 py-3 px-3 text-xs sm:text-sm font-medium transition ${
              activeTab === "preview"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Interactive Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`border-b-2 py-3 px-3 text-xs sm:text-sm font-medium transition ${
              activeTab === "guide"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            How to Install
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {activeTab === "snippet" && (
            <>
              {/* Customization Options */}
              <div className="rounded-xl border border-white/8 bg-slate-900/30 p-3.5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Widget Appearance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Position */}
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1.5">Position</label>
                    <div className="flex rounded-lg border border-white/10 bg-slate-800 p-0.5">
                      <button
                        type="button"
                        onClick={() => setPosition("bottom-right")}
                        className={`flex-1 rounded-md py-1 text-xs font-medium transition ${
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
                        className={`flex-1 rounded-md py-1 text-xs font-medium transition ${
                          position === "bottom-left"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Bottom Left
                      </button>
                    </div>
                  </div>

                  {/* Button text */}
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

                  {/* Icon Only Toggle & Theme Color */}
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1.5">Color & Style</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent p-0"
                        title="Choose accent color"
                      />
                      <button
                        type="button"
                        onClick={() => setIconOnly(!iconOnly)}
                        className={`flex-1 rounded-lg border px-2 py-1 text-xs font-medium transition ${
                          iconOnly
                            ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                            : "border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {iconOnly ? "Icon Only" : "Pill + Text"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embed Script Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    JavaScript Embed Snippet
                  </label>
                  <span className="text-[11px] text-slate-500">Paste before &lt;/body&gt;</span>
                </div>
                <div className="relative rounded-xl border border-white/10 bg-[#050608] p-3.5 font-mono text-xs text-indigo-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all leading-relaxed">{embedSnippet}</pre>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(embedSnippet, "snippet")}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copiedType === "snippet" ? "Copied Snippet!" : "Copy Embed Code"}
                  </button>

                  {/* Direct link to test page in new tab */}
                  <a
                    href={testWidgetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Test Live Widget in New Tab ↗
                  </a>
                </div>
              </div>

              {/* Direct Form Link */}
              <div className="pt-2 border-t border-white/8 space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Direct Full-Screen Form URL</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="flex-1 rounded-xl border border-white/10 bg-[#050608] px-3.5 py-2 text-xs text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(publicUrl, "url")}
                    className="rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    {copiedType === "url" ? "Copied!" : "Copy Link"}
                  </button>
                  <a
                    href={`/forms/${form.publicId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-indigo-300 hover:bg-white/10 hover:text-indigo-200 transition"
                  >
                    Open Form ↗
                  </a>
                </div>
              </div>
            </>
          )}

          {activeTab === "preview" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Simulated website view. Click the bubble to test.
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={testWidgetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-indigo-400 hover:underline"
                  >
                    Open Live Playground ↗
                  </a>
                  <div className="flex rounded-lg border border-white/10 bg-slate-800 p-0.5">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                        previewDevice === "desktop"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                        previewDevice === "mobile"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Stage */}
              <div className="flex justify-center bg-[#050608] p-3 sm:p-4 rounded-2xl border border-white/8 min-h-[360px] overflow-hidden">
                <div
                  className={`relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-300 shadow-2xl ${
                    previewDevice === "mobile"
                      ? "w-[360px] h-[480px]"
                      : "w-full h-[400px]"
                  }`}
                >
                  {/* Mock browser bar */}
                  <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-950 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-red-500/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                    <div className="ml-2 flex-1 rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400 truncate">
                      https://sample-company-website.com
                    </div>
                  </div>

                  {/* Mock webpage content */}
                  <div className="p-5 space-y-3 opacity-75">
                    <div className="h-4 w-32 rounded bg-indigo-500/40" />
                    <div className="h-2.5 w-3/4 rounded bg-slate-700" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-700" />
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="h-14 rounded-lg border border-slate-700/60 bg-slate-800/50 p-2" />
                      <div className="h-14 rounded-lg border border-slate-700/60 bg-slate-800/50 p-2" />
                    </div>
                  </div>

                  {/* Widget Iframe Popup in Preview */}
                  {previewOpen && (
                    <div
                      className={`absolute z-20 overflow-hidden rounded-2xl border border-white/15 bg-[#090a0f] shadow-2xl transition-all ${
                        previewDevice === "mobile"
                          ? "inset-x-2 bottom-14 top-10"
                          : position === "bottom-left"
                          ? "bottom-14 left-4 h-[320px] w-[300px]"
                          : "bottom-14 right-4 h-[320px] w-[300px]"
                      }`}
                    >
                      <iframe
                        key={form.publicId}
                        src={`/forms/${form.publicId}?embed=1&preview=1`}
                        title="FormFly Widget Preview"
                        className="h-full w-full border-0"
                      />
                    </div>
                  )}

                  {/* Launcher Button in Preview */}
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(!previewOpen)}
                    style={{ backgroundColor: color }}
                    className={`absolute z-30 inline-flex items-center gap-2 rounded-full text-white shadow-xl transition-all hover:brightness-110 ${
                      iconOnly ? "h-10 w-10 justify-center p-0" : "px-3.5 py-2 text-xs font-semibold"
                    } ${
                      previewDevice === "mobile"
                        ? "bottom-2.5 right-2.5"
                        : position === "bottom-left"
                        ? "bottom-3 left-3"
                        : "bottom-3 right-3"
                    }`}
                  >
                    {previewOpen ? (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
                      </svg>
                    )}
                    {!iconOnly && <span>{previewOpen ? "Close" : btnText}</span>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "guide" && (
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="rounded-xl border border-white/8 bg-slate-900/40 p-3.5 space-y-1.5">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold">1</span>
                  Copy the snippet
                </h4>
                <p className="text-slate-400">
                  Select your preferred position and colors, then click <strong>Copy Embed Code</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-white/8 bg-slate-900/40 p-3.5 space-y-1.5">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold">2</span>
                  Paste into your HTML
                </h4>
                <p className="text-slate-400">
                  Paste the code right before the closing <code className="text-indigo-300 font-mono">&lt;/body&gt;</code> tag on the page or in your site-wide layout footer.
                </p>
              </div>

              <div className="rounded-xl border border-white/8 bg-slate-900/40 p-3.5 space-y-2">
                <h4 className="font-semibold text-white">JavaScript API for Custom Triggers</h4>
                <p className="text-slate-400 text-xs">
                  You can trigger the widget from your own website buttons:
                </p>
                <pre className="rounded-lg bg-[#050608] p-2.5 font-mono text-[11px] text-indigo-300">
{`// Open the floating widget from any button
<button onclick="FormFly.open()">Chat with us</button>

// Listen for submission completions
window.addEventListener("formfly:submit", function(e) {
  console.log("Form submitted!", e.detail);
});`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/8 bg-slate-900/40 px-5 py-3 shrink-0">
          <a
            href={testWidgetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition inline-flex items-center gap-1"
          >
            <span>Live Test Page</span>
            <span>↗</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
}
