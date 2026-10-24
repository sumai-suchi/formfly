"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface DashboardForm {
  id: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
  submissionCount: number;
  questionCount: number;
}

export default function FormsList({
  forms,
  showActions = false,
}: {
  forms: DashboardForm[];
  showActions?: boolean;
}) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteForm = async (formId: string) => {
    setDeletingId(formId);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/forms/${formId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not delete form.");
      setConfirmingId(null);
      router.refresh();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not delete form.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {forms.map((form) => (
        <div key={form.id} className="rounded-xl border border-white/8 bg-slate-900/50 p-4 transition hover:border-indigo-500/30 hover:bg-slate-900/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-white">{form.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  form.status === "PUBLISHED"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}>
                  {form.status === "PUBLISHED" ? "Published" : "Draft"}
                </span>
              </div>
              {form.description && <p className="mt-1 truncate text-xs text-slate-500">{form.description}</p>}
              <p className="mt-2 text-xs text-slate-600">Updated {form.updatedAt.slice(0, 10)}</p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>{form.questionCount} {form.questionCount === 1 ? "question" : "questions"}</span>
              <span>{form.submissionCount} {form.submissionCount === 1 ? "submission" : "submissions"}</span>
              <Link href={`/dashboard/form/${form.id}/builder`} className="font-medium text-indigo-400 transition hover:text-indigo-300">
                {showActions ? "Edit form" : "Open builder"} <span aria-hidden="true">→</span>
              </Link>
              {showActions && (
                <button
                  type="button"
                  onClick={() => { setConfirmingId(form.id); setDeleteError(null); }}
                  className="font-medium text-red-400 transition hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {showActions && confirmingId === form.id && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/15 bg-red-500/5 px-3 py-2.5">
              <div>
                <p className="text-xs font-medium text-slate-200">Delete “{form.title}”?</p>
                <p className="mt-0.5 text-[11px] text-slate-500">This also removes its questions and submissions.</p>
                {deleteError && <p role="alert" className="mt-1 text-xs text-red-300">{deleteError}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" disabled={deletingId === form.id} onClick={() => { setConfirmingId(null); setDeleteError(null); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50">
                  Cancel
                </button>
                <button type="button" disabled={deletingId === form.id} onClick={() => void deleteForm(form.id)} className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/25 disabled:opacity-50">
                  {deletingId === form.id ? "Deleting…" : "Delete form"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
