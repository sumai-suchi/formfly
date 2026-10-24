"use client";

import { useState, useEffect } from "react";
import { FormData, QuestionData } from "@/types/form";
import BuilderTopbar from "./BuilderTopbar";
import QuestionsPanel from "./QuestionsPanel";
import ChatPreview from "./ChatPreview";

interface BuilderLayoutProps {
  initialForm: FormData;
  initialQuestions: QuestionData[];
}

export default function BuilderLayout({ initialForm, initialQuestions }: BuilderLayoutProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [questions, setQuestions] = useState<QuestionData[]>(initialQuestions);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  // Mobile active view: "questions" | "theme" | "preview"
  const [mobileTab, setMobileTab] = useState<"questions" | "theme" | "preview">("questions");
  // Desktop left panel tab: "questions" | "theme" | "settings"
  const [leftTab, setLeftTab] = useState<"questions" | "theme" | "settings">("questions");

  useEffect(() => {
    // Clean up any lingering floating widgets from test pages
    if (typeof window !== "undefined") {
      const formfly = (window as unknown as { FormFly?: { destroy?: () => void } }).FormFly;
      if (formfly?.destroy) {
        formfly.destroy();
      }
      document.querySelectorAll("[data-formfly-widget], [data-formfly-widget-panel], .ff-widget-container, .ff-widget-panel").forEach((el) => {
        el.remove();
      });
    }
  }, []);

  const handleTopTabChange = (tab: "questions" | "theme" | "settings") => {
    setLeftTab(tab);
    setMobileTab(tab === "theme" ? "theme" : "questions");
  };

  const handleMobileTabSwitch = (tab: "questions" | "theme" | "preview") => {
    setMobileTab(tab);
    if (tab === "theme") {
      setLeftTab("theme");
    } else if (tab === "questions") {
      setLeftTab("questions");
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#090a0f] overflow-hidden">
      {/* Builder Header */}
      <BuilderTopbar
        form={form}
        onFormChange={setForm}
        saving={saving}
        activeLeftTab={leftTab}
        onLeftTabChange={handleTopTabChange}
      />

      {/* Mobile 3-Way Segmented Tab Bar (Hidden on Desktop) */}
      <div className="flex border-b border-white/8 bg-[#0d0f17] px-2 py-1.5 lg:hidden shrink-0">
        <div className="flex w-full items-center rounded-xl bg-slate-900/90 p-1 border border-white/8">
          <button
            type="button"
            onClick={() => handleMobileTabSwitch("questions")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mobileTab === "questions"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Questions</span>
            <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.2 text-[10px] text-indigo-300">
              {questions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileTabSwitch("theme")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mobileTab === "theme"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: form.primaryColor || "#4f46e5" }}
            />
            <span>Theme</span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileTabSwitch("preview")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mobileTab === "preview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel: Questions, Theme, Settings */}
        <div
          className={`w-full flex-shrink-0 overflow-y-auto border-r border-white/8 lg:block lg:w-2/5 ${
            mobileTab === "preview" ? "hidden lg:block" : ""
          }`}
        >
          <QuestionsPanel
            form={form}
            questions={questions}
            onFormChange={setForm}
            onQuestionsChange={setQuestions}
            setSaving={setSaving}
            activeTab={leftTab}
            onTabChange={(tab) => {
              setLeftTab(tab);
              if (tab === "theme") setMobileTab("theme");
              if (tab === "questions") setMobileTab("questions");
            }}
          />
        </div>

        {/* Right Panel: Interactive Chat Preview */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto lg:block ${
            mobileTab !== "preview" ? "hidden lg:block" : ""
          }`}
        >
          <ChatPreview form={form} questions={questions} />
        </div>
      </div>
    </div>
  );
}
