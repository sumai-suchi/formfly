"use client";

import { useState } from "react";
import { QuestionData } from "@/types/form";

interface QuestionCardProps {
  question: QuestionData;
  index: number;
  onDelete: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  TEXT: { label: "Text", className: "bg-sky-500/15 text-sky-400" },
  EMAIL: { label: "Email", className: "bg-violet-500/15 text-violet-400" },
  MULTIPLE_CHOICE: { label: "Multiple Choice", className: "bg-amber-500/15 text-amber-400" },
  YES_NO: { label: "Yes / No", className: "bg-emerald-500/15 text-emerald-400" },
};

export default function QuestionCard({ question, index, onDelete, onEdit, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: QuestionCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const badge = TYPE_BADGE[question.type] ?? { label: question.type, className: "bg-slate-500/15 text-slate-400" };

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-white/8 bg-slate-900/60 px-3 py-3 transition hover:border-white/15">
      {/* Reorder controls */}
      <div className="mt-0.5 flex flex-shrink-0 flex-col">
        <button type="button" onClick={onMoveUp} disabled={!canMoveUp} title="Move question up" aria-label="Move question up" className="rounded p-0.5 text-slate-500 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m5 15 7-7 7 7" /></svg>
        </button>
        <button type="button" onClick={onMoveDown} disabled={!canMoveDown} title="Move question down" aria-label="Move question down" className="rounded p-0.5 text-slate-500 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Question number */}
      <span className="mt-0.5 flex-shrink-0 text-xs font-bold text-slate-500">
        {index + 1}.
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{question.label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
            {badge.label}
          </span>
          {question.required && (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
              Required
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">Delete?</span>
            <button
              onClick={onDelete}
              className="rounded px-1.5 py-0.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-400 hover:bg-white/5"
            >
              No
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="rounded p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
              title="Edit question"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
              title="Delete question"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
