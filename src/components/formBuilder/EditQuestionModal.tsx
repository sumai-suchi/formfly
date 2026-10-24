"use client";

import { useState } from "react";
import { QuestionData, QuestionType } from "@/types/form";

interface EditQuestionModalProps {
  formId: string;
  question: QuestionData;
  onClose: () => void;
  onUpdated: (question: QuestionData) => void;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "TEXT", label: "Text" },
  { value: "EMAIL", label: "Email" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "YES_NO", label: "Yes / No" },
];

export default function EditQuestionModal({ formId, question, onClose, onUpdated }: EditQuestionModalProps) {
  const [label, setLabel] = useState(question.label);
  const [description, setDescription] = useState(question.description ?? "");
  const [type, setType] = useState<QuestionType>(question.type);
  const [required, setRequired] = useState(question.required);

  const parsedOptions = (): string[] => {
    if (!question.options) return ["Option 1", "Option 2"];
    try {
      return JSON.parse(question.options);
    } catch {
      return ["Option 1", "Option 2"];
    }
  };
  const [options, setOptions] = useState<string[]>(parsedOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => setOptions([...options, `Option ${options.length + 1}`]);
  const handleRemoveOption = (idx: number) => setOptions(options.filter((_, i) => i !== idx));
  const handleOptionChange = (idx: number, val: string) =>
    setOptions(options.map((o, i) => (i === idx ? val : o)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("Label is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        label: label.trim(),
        description: description.trim() || null,
        type,
        required,
      };
      if (type === "MULTIPLE_CHOICE") {
        body.options = JSON.stringify(options.filter((o) => o.trim()));
      } else {
        body.options = null;
      }
      const res = await fetch(`/api/forms/${formId}/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update question.");
        return;
      }
      const q = data.question;
      onUpdated({
        id: q.id,
        formId: q.formId,
        label: q.label,
        description: q.description,
        type: q.type,
        options: q.options,
        required: q.required,
        order: q.order,
      });
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-5 text-lg font-bold text-white">Edit Question</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Label <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
              disabled={loading}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  disabled={loading}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    type === t.value
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {type === "MULTIPLE_CHOICE" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Options</label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      disabled={loading}
                      className="flex-1 rounded-lg border border-white/10 bg-slate-800/60 px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        disabled={loading}
                        className="rounded-lg border border-white/10 px-2 text-slate-500 hover:border-red-500/30 hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={loading}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                >
                  + Add option
                </button>
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setRequired((r) => !r)}
              className={`relative h-5 w-9 rounded-full transition-colors ${required ? "bg-indigo-600" : "bg-slate-700"}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  required ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-slate-300">Required</span>
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
