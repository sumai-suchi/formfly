"use client";

import { useState } from "react";
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

  return (
    <div className="flex min-h-screen flex-col bg-[#090a0f]">
      <BuilderTopbar form={form} onFormChange={setForm} saving={saving} />

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
            {tab}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Questions panel — 40% on desktop, full on mobile */}
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
