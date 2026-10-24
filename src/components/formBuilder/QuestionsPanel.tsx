"use client";

import { useState, useCallback, useRef } from "react";
import { FormData, QuestionData } from "@/types/form";
import QuestionCard from "./QuestionCard";
import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionModal";

export const COLOR_PALETTES = [
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Purple", hex: "#9333ea" },
  { name: "Electric Blue", hex: "#2563eb" },
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Electric Cyan", hex: "#0891b2" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Forest Green", hex: "#16a34a" },
  { name: "Sunset Orange", hex: "#ea580c" },
  { name: "Warm Amber", hex: "#f59e0b" },
  { name: "Rose Pink", hex: "#e11d48" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Dark Slate", hex: "#334155" },
];

interface QuestionsPanelProps {
  form: FormData;
  questions: QuestionData[];
  onFormChange: (form: FormData) => void;
  onQuestionsChange: (questions: QuestionData[]) => void;
  setSaving: (s: "idle" | "saving" | "saved") => void;
  activeTab?: "questions" | "theme" | "settings";
  onTabChange?: (tab: "questions" | "theme" | "settings") => void;
}

export default function QuestionsPanel({
  form,
  questions,
  onFormChange,
  onQuestionsChange,
  setSaving,
  activeTab: externalTab,
  onTabChange: externalSetTab,
}: QuestionsPanelProps) {
  const [internalTab, setInternalTab] = useState<"questions" | "theme" | "settings">("questions");
  const activeTab = externalTab ?? internalTab;
  const setActiveTab = externalSetTab ?? setInternalTab;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuestionData | null>(null);
  const [reordering, setReordering] = useState(false);
  const [questionActionError, setQuestionActionError] = useState<string | null>(null);
  const [hexDraft, setHexDraft] = useState<string | null>(null);

  const activeColor = form.primaryColor || "#4f46e5";
  const displayedHex = hexDraft !== null ? hexDraft : activeColor;

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
        } else {
          setSaving("idle");
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
      debounceTimer.current = setTimeout(() => saveSettings(patch), 600);
    },
    [saveSettings]
  );

  // Instant optimistic color update handler: 0ms UI reaction in ChatPreview + debounced server save
  const handleColorChange = (newColor: string) => {
    setHexDraft(null);
    onFormChange({ ...form, primaryColor: newColor });
    scheduleSettingsSave({ primaryColor: newColor });
  };

  const handleHexInputChange = (raw: string) => {
    setHexDraft(raw);
    const cleaned = raw.trim();
    if (/^#([0-9A-F]{3}){1,2}$/i.test(cleaned)) {
      onFormChange({ ...form, primaryColor: cleaned });
      scheduleSettingsSave({ primaryColor: cleaned });
    }
  };

  const handleTitleChange = (val: string) => {
    onFormChange({ ...form, title: val });
    scheduleSettingsSave({ title: val });
  };

  const handleDescChange = (val: string) => {
    onFormChange({ ...form, description: val || null });
    scheduleSettingsSave({ description: val || null });
  };

  const handleWelcomeChange = (val: string) => {
    onFormChange({ ...form, welcomeMessage: val });
    scheduleSettingsSave({ welcomeMessage: val });
  };

  const handleCompletionChange = (val: string) => {
    onFormChange({ ...form, completionMessage: val });
    scheduleSettingsSave({ completionMessage: val });
  };

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

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Top Navigation Tabs */}
      <div className="flex items-center rounded-xl bg-slate-900/80 p-1 border border-white/8">
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "questions"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span>Questions</span>
          <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.2 text-[10px] text-indigo-300">
            {questions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("theme")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "theme"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <span
            className="h-3 w-3 rounded-full border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: activeColor }}
          />
          <span>Theme & Color</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "settings"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <span>Settings</span>
        </button>
      </div>

      {/* 1. THEME & COLORS TAB */}
      {activeTab === "theme" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-slate-900/60 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: activeColor }} />
                Form Accent Color
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Choose the brand color that styles your bot header, avatars, progress bar, choice buttons, and floating widget launcher.
              </p>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="mb-2.5 block text-xs font-medium text-slate-300">
                Preset Color Palettes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PALETTES.map((palette) => {
                  const isSelected = activeColor.toLowerCase() === palette.hex.toLowerCase();
                  return (
                    <button
                      key={palette.hex}
                      type="button"
                      onClick={() => handleColorChange(palette.hex)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-white/40 bg-white/10 ring-2 ring-white/20 shadow-md"
                          : "border-white/5 bg-slate-800/40 hover:border-white/20 hover:bg-slate-800/80"
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-lg shrink-0 border border-white/20 shadow-sm flex items-center justify-center"
                        style={{ backgroundColor: palette.hex }}
                      >
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-slate-200 truncate">{palette.name}</span>
                        <span className="block text-[10px] font-mono text-slate-400">{palette.hex}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Input & Native Color Wheel */}
            <div className="pt-3 border-t border-white/8">
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Custom HEX Color Code
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center gap-2 flex-1">
                  <div
                    className="h-9 w-9 rounded-xl border border-white/20 shadow-sm shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                    style={{ backgroundColor: activeColor }}
                    title="Click to open color picker"
                  >
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={displayedHex}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder="#4f46e5"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none uppercase"
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Applied live ⚡
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="pt-3 border-t border-white/8 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300">Live Component Preview:</span>
              <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-3 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: activeColor }}
                  >
                    F
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full w-2/3" style={{ backgroundColor: activeColor }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-all shadow-sm"
                    style={{ backgroundColor: activeColor }}
                  >
                    Submit Response
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-200 border"
                    style={{ borderColor: `${activeColor}80`, backgroundColor: `${activeColor}18` }}
                  >
                    Choice Option
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FORM SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="rounded-xl border border-white/8 bg-slate-900/60 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">General Form Settings</h3>
            <p className="mt-1 text-xs text-slate-400">Configure greeting messages and form metadata.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Form Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => handleDescChange(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Welcome Message (First Bot Bubble)</label>
            <input
              type="text"
              value={form.welcomeMessage}
              onChange={(e) => handleWelcomeChange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Completion Message (Final Screen)</label>
            <input
              type="text"
              value={form.completionMessage}
              onChange={(e) => handleCompletionChange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 3. QUESTIONS TAB */}
      {activeTab === "questions" && (
        <div className="space-y-3">
          {/* Quick theme pill banner */}
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-slate-900/50 p-2.5 sm:px-3">
            <div className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-full border border-white/20 shadow-sm shrink-0"
                style={{ backgroundColor: activeColor }}
              />
              <span className="text-xs text-slate-300">Theme: <strong className="text-white font-mono">{activeColor.toUpperCase()}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("theme")}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Change Color →
            </button>
          </div>

          {/* Questions list header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">
              Questions
              <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
                {questions.length}
              </span>
            </h3>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Question</span>
            </button>
          </div>

          {questionActionError && (
            <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
              {questionActionError}
            </p>
          )}

          {questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-slate-400">No questions yet.</p>
              <p className="mt-1 text-xs text-slate-500">
                Click &ldquo;Add Question&rdquo; above to start building your conversational form.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {questions
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((q, idx, arr) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={idx}
                    canMoveUp={idx > 0 && !reordering}
                    canMoveDown={idx < arr.length - 1 && !reordering}
                    onMoveUp={() => moveQuestion(q.id, -1)}
                    onMoveDown={() => moveQuestion(q.id, 1)}
                    onEdit={() => setEditQuestion(q)}
                    onDelete={() => handleDeleteQuestion(q.id)}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Add question modal */}
      {addModalOpen && (
        <AddQuestionModal
          formId={form.id}
          questionsCount={questions.length}
          onClose={() => setAddModalOpen(false)}
          onAdded={(q) => {
            onQuestionsChange([...questions, q]);
          }}
        />
      )}

      {/* Edit question modal */}
      {editQuestion && (
        <EditQuestionModal
          formId={form.id}
          question={editQuestion}
          onClose={() => setEditQuestion(null)}
          onUpdated={(updated) => {
            onQuestionsChange(questions.map((q) => (q.id === updated.id ? updated : q)));
          }}
        />
      )}
    </div>
  );
}
