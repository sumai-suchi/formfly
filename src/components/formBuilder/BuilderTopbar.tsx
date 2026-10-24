"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FormData } from "@/types/form";

interface BuilderTopbarProps {
  form: FormData;
  onFormChange: (form: FormData) => void;
  saving: "idle" | "saving" | "saved";
}

export default function BuilderTopbar({ form, saving }: BuilderTopbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleClick = () => {
    setEditingTitle(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
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
            defaultValue={form.title}
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
      <div className="flex items-center gap-3">
        {/* Save indicator */}
        <span className="text-xs text-slate-500">
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

        {/* Status badge */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            form.status === "PUBLISHED"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-amber-500/15 text-amber-400"
          }`}
        >
          {form.status}
        </span>

        {/* Publish button (disabled) */}
        <div className="relative group">
          <button
            disabled
            className="rounded-lg bg-indigo-600/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 opacity-60 cursor-not-allowed"
          >
            Publish
          </button>
          <div className="absolute right-0 top-full mt-1 hidden w-40 rounded-lg border border-white/10 bg-slate-800 p-2 text-xs text-slate-400 group-hover:block">
            Publishing coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
