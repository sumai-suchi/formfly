"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FormData } from "@/types/form";
import EmbedWidgetModal from "./EmbedWidgetModal";

interface BuilderTopbarProps {
  form: FormData;
  onFormChange: (form: FormData) => void;
  saving: "idle" | "saving" | "saved";
  activeLeftTab?: "questions" | "theme" | "settings";
  onLeftTabChange?: (tab: "questions" | "theme" | "settings") => void;
}

export default function BuilderTopbar({
  form,
  onFormChange,
  saving,
  activeLeftTab,
  onLeftTabChange,
}: BuilderTopbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(form.title);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateStatus = async (status: FormData["status"]) => {
    setStatusSaving(true);
    setStatusError(null);
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not update form status.");

      onFormChange({ ...form, status: data.form.status });
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Could not update form status.");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleTitleClick = () => {
    setTitleValue(form.title);
    setEditingTitle(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  const saveTitle = async () => {
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === form.title) {
      setEditingTitle(false);
      return;
    }
    onFormChange({ ...form, title: trimmed });
    setEditingTitle(false);

    try {
      await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
    } catch {
      // ignore
    }
  };

  const handleTitleBlur = () => {
    void saveTitle();
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void saveTitle();
    } else if (e.key === "Escape") {
      setTitleValue(form.title);
      setEditingTitle(false);
    }
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/8 bg-[#090a0f]/95 px-4 py-3 backdrop-blur">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
          title="Back to dashboard"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        {editingTitle ? (
          <input
            ref={inputRef}
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="rounded-md border border-indigo-500/50 bg-slate-800 px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        ) : (
          <button
            onClick={handleTitleClick}
            className="rounded px-1 py-0.5 text-sm font-semibold text-white transition hover:bg-white/5"
            title="Click to edit title"
          >
            {form.title}
          </button>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Save indicator */}
        <span className="text-xs text-slate-500 hidden sm:inline-block">
          {saving === "saving" && (
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </span>
          )}
          {saving === "saved" && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Saved
            </span>
          )}
        </span>

        {/* Theme & Color button */}
        <button
          type="button"
          onClick={() => onLeftTabChange?.(activeLeftTab === "theme" ? "questions" : "theme")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
            activeLeftTab === "theme"
              ? "border-indigo-500/60 bg-indigo-500/20 text-white shadow-sm"
              : "border-white/10 bg-slate-800/60 text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
          title="Customize Form Theme & Accent Color"
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: form.primaryColor || "#4f46e5" }}
          />
          <span className="hidden sm:inline">Theme &</span> Colors
        </button>

        {/* Status badge */}
        <span
          className={`hidden md:inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            form.status === "PUBLISHED"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-amber-500/15 text-amber-400"
          }`}
        >
          {form.status}
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => updateStatus("DRAFT")}
            disabled={statusSaving || form.status === "DRAFT"}
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {statusSaving && form.status !== "DRAFT" ? "Saving…" : "Draft"}
          </button>
          <button
            type="button"
            onClick={() => updateStatus("PUBLISHED")}
            disabled={statusSaving || form.status === "PUBLISHED"}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {statusSaving && form.status !== "PUBLISHED" ? "Publishing…" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => setEmbedModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/35 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white cursor-pointer"
            title="Get embed code & widget preview"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="hidden sm:inline">Embed</span> Widget
          </button>
          {form.status === "PUBLISHED" && (
            <Link
              href={`/forms/${form.publicId}`}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap text-xs font-medium text-indigo-300 transition hover:text-indigo-200 hidden sm:inline"
            >
              Open form ↗
            </Link>
          )}
        </div>
      </div>

      {statusError && (
        <p role="alert" className="absolute right-4 top-full mt-2 rounded-lg border border-red-500/20 bg-[#160d12] px-3 py-2 text-xs text-red-300 shadow-lg">
          {statusError}
        </p>
      )}

      {/* Embed Widget Modal */}
      <EmbedWidgetModal
        form={form}
        isOpen={embedModalOpen}
        onClose={() => setEmbedModalOpen(false)}
        onPublish={async () => {
          await updateStatus("PUBLISHED");
        }}
      />
    </div>
  );
}
