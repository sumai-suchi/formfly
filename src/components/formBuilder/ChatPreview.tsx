"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FormData, QuestionData } from "@/types/form";

interface ChatPreviewProps {
  form: FormData;
  questions: QuestionData[];
}

function parseOptions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((option): option is string => typeof option === "string") : [];
  } catch {
    return [];
  }
}

export default function ChatPreview(props: ChatPreviewProps) {
  const questionSignature = props.questions
    .map((question) => `${question.id}:${question.label}:${question.type}:${question.options}:${question.required}:${question.order}`)
    .join("|");

  return (
    <ChatPreviewConversation
      key={`${props.form.id}:${questionSignature}`}
      form={props.form}
      questions={props.questions}
    />
  );
}

function ChatPreviewConversation({ form, questions }: ChatPreviewProps) {
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [completed, setCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<"inline" | "widget">("inline");
  const [widgetOpen, setWidgetOpen] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  const currentQuestion = sortedQuestions[currentIndex];
  const accent = form.primaryColor || "#4f46e5";
  const progress = sortedQuestions.length === 0
    ? 0
    : Math.round(((completed ? sortedQuestions.length : currentIndex) / sortedQuestions.length) * 100);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [currentIndex, answers, completed, widgetOpen]);

  const submitAnswer = (value: string) => {
    if (!currentQuestion) return;
    const answer = value.trim();
    if (currentQuestion.required && !answer) return;

    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer || "Skipped" }));
    setDraft("");

    if (currentIndex + 1 >= sortedQuestions.length) {
      setCompleted(true);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  };

  const handleTextSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitAnswer(draft);
  };

  const resetPreview = () => {
    setCurrentIndex(0);
    setAnswers({});
    setDraft("");
    setCompleted(false);
  };

  // Render the core chatbot conversation container
  const renderChatContent = (isWidget: boolean) => (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#0d0f17]">
      <header className="shrink-0 border-b border-white/8 bg-slate-900/50 px-3.5 py-3 sm:px-5">
        <div className="mb-2.5 flex items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            >
              {form.title.trim().charAt(0).toUpperCase() || "F"}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xs sm:text-sm font-semibold text-white">{form.title || "Untitled form"}</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">FormFly assistant</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
              {completed ? "Complete" : sortedQuestions.length ? `${Math.min(currentIndex + 1, sortedQuestions.length)} of ${sortedQuestions.length}` : "No questions"}
            </span>
            {isWidget && (
              <button
                type="button"
                onClick={() => setWidgetOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                aria-label="Close widget"
                title="Close chat"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-white/8"
          role="progressbar"
          aria-label="Form progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%`, backgroundColor: accent }}
          />
        </div>
      </header>

      <div ref={conversationRef} className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-4 sm:px-6">
        {form.welcomeMessage && (
          <div className="flex items-end gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: accent }} aria-hidden="true">F</span>
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed text-slate-100 break-words">
              {form.welcomeMessage}
            </div>
          </div>
        )}

        {sortedQuestions.slice(0, completed ? sortedQuestions.length : currentIndex).map((question) => (
          <div key={question.id} className="space-y-2.5">
            <div className="flex items-end gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: accent }} aria-hidden="true">F</span>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed text-slate-100 break-words">
                {question.label}
                {question.description && <p className="mt-1 text-[11px] sm:text-xs text-slate-400">{question.description}</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-white break-words shadow-sm" style={{ backgroundColor: accent }}>
                {answers[question.id]}
              </div>
            </div>
          </div>
        ))}

        {!completed && currentQuestion && (
          <div className="flex items-end gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: accent }} aria-hidden="true">F</span>
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed text-slate-100 break-words">
              {currentQuestion.label}
              {currentQuestion.description && <p className="mt-1 text-[11px] sm:text-xs text-slate-400">{currentQuestion.description}</p>}
              {currentQuestion.required && <span className="ml-1 text-rose-400" aria-label="required">*</span>}
            </div>
          </div>
        )}

        {sortedQuestions.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 p-5 text-center">
            <p className="text-xs text-slate-400">No questions added yet.</p>
            <p className="mt-1 text-[11px] text-slate-600">New questions will appear here as you build the form.</p>
          </div>
        )}

        {completed && (
          <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-5 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400" aria-hidden="true">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
              </svg>
            </span>
            <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-white">Conversation complete</h3>
            <p className="mt-1 text-xs text-slate-400">{form.completionMessage || "Thank you for your responses!"}</p>
            <button onClick={resetPreview} className="mt-3.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
              Restart preview
            </button>
          </div>
        )}
      </div>

      {!completed && currentQuestion && (
        <div className="shrink-0 border-t border-white/8 bg-slate-900/40 p-2.5 sm:p-4">
          {currentQuestion.type === "MULTIPLE_CHOICE" ? (
            <div className="flex flex-wrap gap-2" aria-label="Answer choices">
              {parseOptions(currentQuestion.options).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => submitAnswer(option)}
                  className="rounded-full border px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-200 transition hover:text-white break-words max-w-full text-left"
                  style={{ borderColor: `${accent}80`, backgroundColor: `${accent}18` }}
                >
                  {option}
                </button>
              ))}
              {parseOptions(currentQuestion.options).length === 0 && <p className="text-xs text-amber-300">Add answer choices to this question.</p>}
            </div>
          ) : currentQuestion.type === "YES_NO" ? (
            <div className="flex gap-2">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => submitAnswer(option)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-slate-700"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              <input
                type={currentQuestion.type === "EMAIL" ? "email" : "text"}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={currentQuestion.type === "EMAIL" ? "Type your email…" : "Type your answer…"}
                required={currentQuestion.required}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60"
              />
              <button
                type="submit"
                className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:brightness-110"
                style={{ backgroundColor: accent }}
                aria-label="Send answer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </button>
            </form>
          )}
          {!currentQuestion.required && (
            <button
              type="button"
              onClick={() => submitAnswer("")}
              className="mt-1.5 text-[11px] sm:text-xs text-slate-500 transition hover:text-slate-300"
            >
              Skip question
            </button>
          )}
        </div>
      )}

      <footer className="shrink-0 border-t border-white/5 px-4 py-2 text-center text-[10px] text-slate-600">
        Powered by{" "}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold transition hover:underline"
          style={{ color: accent }}
        >
          FormFly
        </a>
        <span className="ml-2 text-slate-700">· Simulated preview</span>
      </footer>
    </div>
  );

  return (
    <section className="flex h-full min-h-[520px] flex-col p-3 sm:p-5" aria-label="Chatbot preview">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Chatbot preview</p>
          <p className="mt-0.5 text-xs text-slate-500">Test respondent interaction and widget responsiveness</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex rounded-lg border border-white/10 bg-slate-900/90 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("inline")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                viewMode === "inline"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Inline Chat
            </button>
            <button
              type="button"
              onClick={() => setViewMode("widget")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                viewMode === "widget"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Floating Widget
            </button>
          </div>

          <button
            type="button"
            onClick={resetPreview}
            className="rounded-lg border border-white/8 bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:bg-white/5 hover:text-white transition"
            title="Reset conversation"
          >
            Reset
          </button>
        </div>
      </div>

      {viewMode === "inline" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl shadow-black/20">
          {renderChatContent(false)}
        </div>
      ) : (
        /* Floating Widget Simulated Webpage */
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
          {/* Simulated Webpage Header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500/60" />
              <span className="font-semibold text-slate-300">My Website</span>
            </div>
            <div className="hidden sm:flex gap-3 text-[11px]">
              <span>Features</span>
              <span>Pricing</span>
              <span>About</span>
            </div>
          </div>

          {/* Simulated Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 opacity-75">
            <div className="h-6 w-48 rounded-lg bg-indigo-500/20" />
            <div className="h-3 w-3/4 rounded bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-slate-800" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-24 rounded-xl border border-white/5 bg-slate-900/40 p-3">
                <div className="h-3 w-20 rounded bg-slate-700 mb-2" />
                <div className="h-2 w-full rounded bg-slate-800" />
              </div>
              <div className="h-24 rounded-xl border border-white/5 bg-slate-900/40 p-3">
                <div className="h-3 w-20 rounded bg-slate-700 mb-2" />
                <div className="h-2 w-full rounded bg-slate-800" />
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Click the floating button in the corner to test the widget dialogue.
            </p>
          </div>

          {/* Floating Widget Popup in simulated page */}
          {widgetOpen && (
            <div className="absolute bottom-16 right-3 sm:right-5 z-20 h-[min(480px,calc(100%-5rem))] w-[min(360px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              {renderChatContent(true)}
            </div>
          )}

          {/* Floating Widget Launcher Button */}
          <button
            type="button"
            aria-expanded={widgetOpen}
            onClick={() => setWidgetOpen(!widgetOpen)}
            style={{ backgroundColor: accent }}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            {widgetOpen ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
              </svg>
            )}
            <span>{widgetOpen ? "Close chat" : "Chat with us"}</span>
          </button>
        </div>
      )}
    </section>
  );
}
