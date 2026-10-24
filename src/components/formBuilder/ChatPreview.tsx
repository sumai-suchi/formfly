"use client";

import { FormData, QuestionData } from "@/types/form";

interface ChatPreviewProps {
  form: FormData;
  questions: QuestionData[];
}

function parseOptions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function QuestionWidget({ question, primaryColor }: { question: QuestionData; primaryColor: string }) {
  switch (question.type) {
    case "TEXT":
      return (
        <input
          type="text"
          placeholder="Type your answer…"
          disabled
          className="mt-2 w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-400 placeholder-slate-600"
        />
      );
    case "EMAIL":
      return (
        <input
          type="email"
          placeholder="your@email.com"
          disabled
          className="mt-2 w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-400 placeholder-slate-600"
        />
      );
    case "YES_NO":
      return (
        <div className="mt-2 flex gap-2">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              disabled
              style={{ borderColor: `${primaryColor}60` }}
              className="rounded-lg border px-4 py-1.5 text-sm font-medium text-slate-400"
            >
              {opt}
            </button>
          ))}
        </div>
      );
    case "MULTIPLE_CHOICE": {
      const opts = parseOptions(question.options);
      return (
        <div className="mt-2 flex flex-wrap gap-2">
          {opts.length === 0 ? (
            <span className="text-xs text-slate-600">No options yet</span>
          ) : (
            opts.map((opt, i) => (
              <button
                key={i}
                disabled
                style={{ borderColor: `${primaryColor}60` }}
                className="rounded-full border px-3 py-1 text-xs font-medium text-slate-400"
              >
                {opt}
              </button>
            ))
          )}
        </div>
      );
    }
    default:
      return null;
  }
}

export default function ChatPreview({ form, questions }: ChatPreviewProps) {
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full items-center justify-center p-6">
      {/* Phone frame */}
      <div className="hidden lg:flex h-full max-h-[680px] w-[360px] flex-col overflow-hidden rounded-[2rem] border-4 border-slate-700 bg-[#0d0f17] shadow-2xl shadow-black/50">
        {/* Phone notch / status bar */}
        <div className="flex items-center justify-center bg-slate-900/80 py-2">
          <div className="h-1.5 w-16 rounded-full bg-slate-700" />
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          {/* Welcome message */}
          {form.welcomeMessage && (
            <div className="mb-4 flex">
              <div
                className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white"
                style={{ backgroundColor: form.primaryColor }}
              >
                {form.welcomeMessage}
              </div>
            </div>
          )}

          {/* Questions */}
          {sortedQuestions.length === 0 && (
            <p className="text-center text-xs text-slate-600 mt-4">Add questions to preview the chat.</p>
          )}
          {sortedQuestions.map((q) => (
            <div key={q.id} className="mb-5">
              {/* Bot bubble */}
              <div className="flex mb-1">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  {q.label}
                  {q.description && (
                    <p className="mt-0.5 text-xs opacity-75">{q.description}</p>
                  )}
                </div>
              </div>
              {/* Input widget */}
              <QuestionWidget question={q} primaryColor={form.primaryColor} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 bg-slate-900/50 py-2 text-center">
          <span className="text-[10px] text-slate-600">
            Powered by{" "}
            <span style={{ color: form.primaryColor }} className="font-semibold">
              FormFly
            </span>
          </span>
        </div>
      </div>

      {/* Mobile / no-frame view */}
      <div className="flex flex-col overflow-y-auto w-full max-w-lg rounded-2xl border border-white/8 bg-[#0d0f17] p-4 lg:hidden">
        {form.welcomeMessage && (
          <div className="mb-4 flex">
            <div
              className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white"
              style={{ backgroundColor: form.primaryColor }}
            >
              {form.welcomeMessage}
            </div>
          </div>
        )}
        {sortedQuestions.length === 0 && (
          <p className="text-center text-xs text-slate-600">Add questions to preview the chat.</p>
        )}
        {sortedQuestions.map((q) => (
          <div key={q.id} className="mb-5">
            <div className="flex mb-1">
              <div
                className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white"
                style={{ backgroundColor: form.primaryColor }}
              >
                {q.label}
                {q.description && <p className="mt-0.5 text-xs opacity-75">{q.description}</p>}
              </div>
            </div>
            <QuestionWidget question={q} primaryColor={form.primaryColor} />
          </div>
        ))}
        <div className="mt-4 border-t border-white/5 pt-2 text-center">
          <span className="text-[10px] text-slate-600">
            Powered by <span style={{ color: form.primaryColor }} className="font-semibold">FormFly</span>
          </span>
        </div>
      </div>
    </div>
  );
}
