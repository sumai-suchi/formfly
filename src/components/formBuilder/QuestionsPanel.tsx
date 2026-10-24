"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FormData, QuestionData } from "@/types/form";
import QuestionCard from "./QuestionCard";
import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionModal";

const COLOR_SWATCHES = [
  "#4f46e5", // indigo
  "#7c3aed", // violet
  "#db2777", // pink
  "#dc2626", // red
  "#ea580c", // orange
  "#16a34a", // green
  "#0284c7", // sky
  "#0891b2", // cyan
];

interface QuestionsPanelProps {
  form: FormData;
  questions: QuestionData[];
  onFormChange: (form: FormData) => void;
  onQuestionsChange: (questions: QuestionData[]) => void;
  setSaving: (s: "idle" | "saving" | "saved") => void;
}

export default function QuestionsPanel({
  form,
  questions,
  onFormChange,
  onQuestionsChange,
  setSaving,
}: QuestionsPanelProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuestionData | null>(null);
  const [reordering, setReordering] = useState(false);
  const [questionActionError, setQuestionActionError] = useState<string | null>(null);

  // Local settings state (debounced save)
  const [localTitle, setLocalTitle] = useState(form.title);
  const [localDesc, setLocalDesc] = useState(form.description ?? "");
  const [localWelcome, setLocalWelcome] = useState(form.welcomeMessage);
  const [localCompletion, setLocalCompletion] = useState(form.completionMessage);
  const [localColor, setLocalColor] = useState(form.primaryColor);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveSettings = useCallback(
    async (patch: Partial<FormData>) => {
      setSaving("saving");
      try {
        const res = await fetch(`/api/forms/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = await res.json();
          onFormChange({ ...form, ...data.form });
          setSaving("saved");
          setTimeout(() => setSaving("idle"), 2000);
        }
      } catch {
        setSaving("idle");
      }
    },
    [form, onFormChange, setSaving]
  );

  const scheduleSettingsSave = useCallback(
    (patch: Partial<FormData>) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => saveSettings(patch), 800);
    },
    [saveSettings]
  );

  useEffect(() => {
    scheduleSettingsSave({
      title: localTitle,
      description: localDesc || null,
      welcomeMessage: localWelcome,
      completionMessage: localCompletion,
      primaryColor: localColor,
    });
  }, [localTitle, localDesc, localWelcome, localCompletion, localColor]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteQuestion = async (questionId: string) => {
    setQuestionActionError(null);
    try {
      const response = await fetch(`/api/forms/${form.id}/questions/${questionId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not delete question.");
      onQuestionsChange(
        questions
          .filter((question) => question.id !== questionId)
          .sort((a, b) => a.order - b.order)
          .map((question, order) => ({ ...question, order }))
      );
    } catch (error) {
      setQuestionActionError(error instanceof Error ? error.message : "Could not delete question.");
    }
  };

  const moveQuestion = async (questionId: string, direction: -1 | 1) => {
    if (reordering) return;
    setQuestionActionError(null);
    const previous = questions.slice().sort((a, b) => a.order - b.order);
    const fromIndex = previous.findIndex((question) => question.id === questionId);
    const toIndex = fromIndex + direction;
    if (fromIndex < 0 || toIndex < 0 || toIndex >= previous.length) return;

    const reordered = previous.slice();
    [reordered[fromIndex], reordered[toIndex]] = [reordered[toIndex], reordered[fromIndex]];
    const updated = reordered.map((question, order) => ({ ...question, order }));
    onQuestionsChange(updated);
    setReordering(true);
    setSaving("saving");

    try {
      const response = await fetch(`/api/forms/${form.id}/questions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: updated.map((question) => question.id) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not save question order.");
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 2000);
    } catch (error) {
      onQuestionsChange(previous);
      setQuestionActionError(error instanceof Error ? error.message : "Could not save question order.");
      setSaving("idle");
    } finally {
      setReordering(false);
    }
  };

  const handleQuestionAdded = (q: QuestionData) => {
    onQuestionsChange([...questions, q]);
  };

  const handleQuestionUpdated = (updated: QuestionData) => {
    onQuestionsChange(questions.map((q) => (q.id === updated.id ? updated : q)));
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Form Settings Collapsible */}
      <div className="rounded-xl border border-white/8 bg-slate-900/60">
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-white"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Form Settings
          </span>
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${settingsOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {settingsOpen && (
          <div className="border-t border-white/8 px-4 pb-4 pt-3 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Title</label>
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
              <textarea
                value={localDesc}
                onChange={(e) => setLocalDesc(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Welcome Message</label>
              <input
                type="text"
                value={localWelcome}
                onChange={(e) => setLocalWelcome(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Completion Message</label>
              <input
                type="text"
                value={localCompletion}
                onChange={(e) => setLocalCompletion(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color}
                    onClick={() => setLocalColor(color)}
                    style={{ backgroundColor: color }}
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                      localColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""
                    }`}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  value={localColor}
                  onChange={(e) => setLocalColor(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
                  title="Custom color"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300">
            Questions
            <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
              {questions.length}
            </span>
          </h3>
        </div>

        {questionActionError && (
          <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
            {questionActionError}
          </p>
        )}

        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
            <p className="text-sm text-slate-500">No questions yet.</p>
            <p className="mt-1 text-xs text-slate-600">Click <span className="font-medium text-slate-400">Add Question</span> to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  onDelete={() => void handleDeleteQuestion(q.id)}
                  onEdit={() => setEditQuestion(q)}
                  onMoveUp={() => void moveQuestion(q.id, -1)}
                  onMoveDown={() => void moveQuestion(q.id, 1)}
                  canMoveUp={!reordering && idx > 0}
                  canMoveDown={!reordering && idx < questions.length - 1}
                />
              ))}
          </div>
        )}
      </div>

      {/* Add Question button */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-500/40 py-3 text-sm font-medium text-indigo-400 transition hover:border-indigo-500/70 hover:bg-indigo-500/5 hover:text-indigo-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Question
      </button>

      {addModalOpen && (
        <AddQuestionModal
          formId={form.id}
          questionsCount={questions.length}
          onClose={() => setAddModalOpen(false)}
          onAdded={handleQuestionAdded}
        />
      )}

      {editQuestion && (
        <EditQuestionModal
          formId={form.id}
          question={editQuestion}
          onClose={() => setEditQuestion(null)}
          onUpdated={handleQuestionUpdated}
        />
      )}
    </div>
  );
}
