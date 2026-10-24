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
  const [activeTab, setActiveTab] = useState<"questions" | "preview">("questions");
  const [leftTab, setLeftTab] = useState<"questions" | "theme" | "settings">("questions");

  useEffect(() => {
    // Ensure any floating widgets from previous test pages are removed from document.body
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

  const handleLeftTabChange = (tab: "questions" | "theme" | "settings") => {
    setLeftTab(tab);
    setActiveTab("questions");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#090a0f]">
      <BuilderTopbar
        form={form}
        onFormChange={setForm}
        saving={saving}
        activeLeftTab={leftTab}
        onLeftTabChange={handleLeftTabChange}
      />

      {/* Mobile tab switcher */}
      <div className="flex border-b border-white/8 lg:hidden">
        {(["questions", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "border-b-2 border-indigo-500 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "questions" ? (leftTab === "theme" ? "Theme & Colors" : "Form Editor") : "Chat Preview"}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — 40% on desktop, full on mobile */}
        <div
          className={`w-full flex-shrink-0 overflow-y-auto border-r border-white/8 lg:block lg:w-2/5 ${
            activeTab !== "questions" ? "hidden lg:block" : ""
          }`}
        >
          <QuestionsPanel
            form={form}
            questions={questions}
            onFormChange={setForm}
            onQuestionsChange={setQuestions}
            setSaving={setSaving}
            activeTab={leftTab}
            onTabChange={setLeftTab}
          />
        </div>

        {/* Preview panel — 60% on desktop, full on mobile */}
        <div
          className={`flex-1 overflow-y-auto lg:block ${
            activeTab !== "preview" ? "hidden lg:block" : ""
          }`}
        >
          <ChatPreview form={form} questions={questions} />
        </div>
      </div>
    </div>
  );
}
