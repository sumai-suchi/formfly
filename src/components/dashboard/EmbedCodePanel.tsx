"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PublishedForm {
  id: string;
  publicId: string;
  title: string;
}

export default function EmbedCodePanel({ forms }: { forms: PublishedForm[] }) {
  const [selectedId, setSelectedId] = useState(forms[0]?.id ?? "");
  const [baseUrl, setBaseUrl] = useState("https://your-formfly-domain.com");
  const [copied, setCopied] = useState<"snippet" | "url" | null>(null);
  const selectedForm = forms.find((form) => form.id === selectedId);
  const publicUrl = selectedForm ? `${baseUrl}/forms/${selectedForm.publicId}` : "";
  const snippet = selectedForm
    ? `<script src="${baseUrl}/formfly-widget.js" data-form-id="${selectedForm.publicId}" async></script>`
    : "";

  useEffect(() => {
    const timer = window.setTimeout(() => setBaseUrl(window.location.origin), 0);
    return () => window.clearTimeout(timer);
  }, []);

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
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Published forms appear here with a public link and a floating chat widget snippet.</p>
        <Link href="/dashboard/forms" className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Open My Forms</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6">
        <label htmlFor="embed-form" className="mb-2 block text-xs font-medium text-slate-400">Published form</label>
        <select id="embed-form" value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setCopied(null); }} className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50">
          {forms.map((form) => <option key={form.id} value={form.id}>{form.title}</option>)}
        </select>
      </section>

      {selectedForm && (
        <>
          <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-white">Public form link</h2>
            <p className="mt-1 text-xs text-slate-500">Share this link to open the full chat form.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input readOnly value={publicUrl} aria-label="Public form URL" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2.5 text-sm text-slate-300" />
              <button type="button" onClick={() => void copyText(publicUrl, "url")} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">{copied === "url" ? "Copied" : "Copy link"}</button>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500">Open form</a>
            </div>
          </section>

          <section className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-white">Floating chatbot widget</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">Paste this script before the closing <code className="text-slate-300">&lt;/body&gt;</code> tag on your website. It adds a responsive chat button that opens this form.</p>
            <textarea readOnly value={snippet} rows={3} aria-label="Widget embed code" className="mt-4 w-full resize-y rounded-lg border border-white/10 bg-[#090a0f] p-3 font-mono text-xs leading-relaxed text-slate-300" />
            <button type="button" onClick={() => void copyText(snippet, "snippet")} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">{copied === "snippet" ? "Copied" : "Copy embed code"}</button>
          </section>
        </>
      )}
    </div>
  );
}
