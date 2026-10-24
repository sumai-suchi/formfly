"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { QuestionType } from "@/types/form";

interface PublicQuestion {
  id: string;
  label: string;
  description: string | null;
  type: QuestionType;
  options: string | null;
  required: boolean;
  order: number;
}

interface PublicFormChatProps {
  publicId: string;
  title: string;
  welcomeMessage: string;
  completionMessage: string;
  primaryColor: string;
  questions: PublicQuestion[];
  embedded?: boolean;
}

function parseOptions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const options: unknown = JSON.parse(raw);
    return Array.isArray(options) ? options.filter((option): option is string => typeof option === "string") : [];
  } catch {
    return [];
  }
}

export default function PublicFormChat({
  publicId,
  title,
  welcomeMessage,
  completionMessage,
  primaryColor,
  questions,
  embedded = false,
}: PublicFormChatProps) {
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const currentQuestion = sortedQuestions[currentIndex];
  const progress = sortedQuestions.length
    ? Math.round(((submitted ? sortedQuestions.length : currentIndex) / sortedQuestions.length) * 100)
    : 100;

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [currentIndex, answers, submitting, submitted, error]);

  useEffect(() => {
    if (embedded && typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({ type: "formfly:loaded", formId: publicId }, "*");
    }
  }, [embedded, publicId]);

  const handleClose = () => {
    if (typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({ type: "formfly:close" }, "*");
    }
  };

  const submitResponses = async (nextAnswers: Record<string, string>) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/public/forms/${publicId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(nextAnswers).map(([questionId, value]) => ({ questionId, value })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "We couldn't submit your responses. Please try again.");
      setSubmitted(true);
      if (typeof window !== "undefined" && window.parent) {
        window.parent.postMessage({ type: "formfly:submit_success", formId: publicId }, "*");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We couldn't submit your responses. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const answerQuestion = (value: string) => {
    if (!currentQuestion || submitting) return;
    const answer = value.trim();
    if (currentQuestion.required && !answer) return;

    const nextAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(nextAnswers);
    setDraft("");
    setError(null);

    if (currentIndex + 1 === sortedQuestions.length) {
      setCurrentIndex(sortedQuestions.length);
      void submitResponses(nextAnswers);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  };

  const handleTextSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    answerQuestion(draft);
  };

  return (
    <section className={embedded
      ? "flex h-full min-h-0 w-full max-w-none flex-col overflow-hidden border-0 bg-[#0d0f17]"
      : "flex h-[min(820px,calc(100dvh-4rem))] min-h-[min(520px,calc(100dvh-4rem))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl shadow-black/30"
    }>
      <header className="shrink-0 border-b border-white/8 bg-slate-900/50 px-3.5 py-3 sm:px-6">
        <div className="mb-2.5 flex items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }} aria-hidden="true">
              {title.trim().charAt(0).toUpperCase() || "F"}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xs sm:text-sm font-semibold text-white">{title}</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400">FormFly assistant</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
              {submitted ? "Complete" : `${Math.min(currentIndex + 1, sortedQuestions.length)} of ${sortedQuestions.length}`}
            </span>
            {embedded && (
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Close chat"
                title="Close chat"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8" role="progressbar" aria-label="Form progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${progress}%`, backgroundColor: primaryColor }} />
        </div>
      </header>

      <div ref={conversationRef} className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-4 sm:px-6">
        <div className="flex items-end gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }} aria-hidden="true">F</span>
          <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed text-slate-100 break-words">
            {welcomeMessage || "Hi! Welcome. Let's get started."}
          </div>
        </div>

        {sortedQuestions.slice(0, currentIndex).map((question) => (
          <div key={question.id} className="space-y-2.5">
            <div className="flex items-end gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }} aria-hidden="true">F</span>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed text-slate-100 break-words">
                {question.label}
                {question.description && <p className="mt-1 text-[11px] sm:text-xs text-slate-400">{question.description}</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-white break-words shadow-sm" style={{ backgroundColor: primaryColor }}>
                {answers[question.id] || "Skipped"}
              </div>
            </div>
          </div>
        ))}

        {currentQuestion && !submitted && (
          <div className="flex items-end gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }} aria-hidden="true">F</span>
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed text-slate-100 break-words">
              {currentQuestion.label}
              {currentQuestion.description && <p className="mt-1 text-[11px] sm:text-xs text-slate-400">{currentQuestion.description}</p>}
              {currentQuestion.required && <span className="ml-1 text-rose-400" aria-label="required">*</span>}
            </div>
          </div>
        )}

        {submitted && (
          <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-6 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
              </svg>
            </span>
            <h2 className="mt-3 text-sm font-semibold text-white">Submission received</h2>
            <p className="mt-1 text-sm text-slate-400">{completionMessage || "Thank you for your responses!"}</p>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center" role="alert">
            <p className="text-sm text-red-300">{error}</p>
            <button type="button" disabled={submitting} onClick={() => void submitResponses(answers)} className="mt-2 text-xs font-medium text-red-200 underline disabled:opacity-50">
              Try again
            </button>
          </div>
        )}
      </div>

      {currentQuestion && !submitted && (
        <div className="shrink-0 border-t border-white/8 bg-slate-900/40 p-2.5 sm:p-4">
          {currentQuestion.type === "MULTIPLE_CHOICE" ? (
            <div className="flex flex-wrap gap-2" aria-label="Answer choices">
              {parseOptions(currentQuestion.options).map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={submitting}
                  onClick={() => answerQuestion(option)}
                  className="rounded-full border px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-200 transition hover:text-white disabled:opacity-50 break-words max-w-full text-left"
                  style={{ borderColor: `${primaryColor}80`, backgroundColor: `${primaryColor}18` }}
                >
                  {option}
                </button>
              ))}
              {parseOptions(currentQuestion.options).length === 0 && <p className="text-xs text-slate-400">This form is missing answer choices.</p>}
            </div>
          ) : currentQuestion.type === "YES_NO" ? (
            <div className="flex gap-2">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={submitting}
                  onClick={() => answerQuestion(option)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-slate-700 disabled:opacity-50"
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
                maxLength={10000}
                disabled={submitting}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
                aria-label="Send answer"
              >
                {submitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>
          )}
          {!currentQuestion.required && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => answerQuestion("")}
              className="mt-2 text-xs text-slate-500 transition hover:text-slate-300 disabled:opacity-50"
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
          style={{ color: primaryColor }}
        >
          FormFly
        </a>
      </footer>
    </section>
  );
}
