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
  const conversationRef = useRef<HTMLDivElement>(null);
  const currentQuestion = sortedQuestions[currentIndex];
  const accent = form.primaryColor || "#4f46e5";
  const progress = sortedQuestions.length === 0
    ? 0
    : Math.round(((completed ? sortedQuestions.length : currentIndex) / sortedQuestions.length) * 100);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [currentIndex, answers, completed]);

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

  return (
    <section className="flex h-full min-h-[520px] flex-col p-3 sm:p-5" aria-label="Chatbot preview">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Chatbot preview</p>
          <p className="mt-0.5 text-xs text-slate-500">Try the conversation as a respondent</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Preview
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl shadow-black/20">
        <header className="shrink-0 border-b border-white/8 bg-slate-900/50 px-4 py-3 sm:px-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              >
                {form.title.trim().charAt(0).toUpperCase() || "F"}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">{form.title || "Untitled form"}</h2>
                <p className="text-[11px] text-slate-500">FormFly assistant</p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-slate-500">
              {completed ? "Complete" : sortedQuestions.length ? `${Math.min(currentIndex + 1, sortedQuestions.length)} of ${sortedQuestions.length}` : "No questions"}
            </span>
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

        <div ref={conversationRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {form.welcomeMessage && (
            <div className="flex items-end gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: accent }} aria-hidden="true">F</span>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-4 py-3 text-sm leading-relaxed text-slate-100">
                {form.welcomeMessage}
              </div>
            </div>
          )}

          {sortedQuestions.slice(0, completed ? sortedQuestions.length : currentIndex).map((question) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-end gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: accent }} aria-hidden="true">F</span>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-4 py-3 text-sm leading-relaxed text-slate-100">
                  {question.label}
                  {question.description && <p className="mt-1 text-xs text-slate-400">{question.description}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white" style={{ backgroundColor: accent }}>
                  {answers[question.id]}
                </div>
              </div>
            </div>
          ))}

          {!completed && currentQuestion && (
            <div className="flex items-end gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: accent }} aria-hidden="true">F</span>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-slate-800/80 px-4 py-3 text-sm leading-relaxed text-slate-100">
                {currentQuestion.label}
                {currentQuestion.description && <p className="mt-1 text-xs text-slate-400">{currentQuestion.description}</p>}
                {currentQuestion.required && <span className="ml-1 text-rose-400" aria-label="required">*</span>}
              </div>
            </div>
          )}

          {sortedQuestions.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
              <p className="text-sm text-slate-400">Add a question to preview your conversation.</p>
              <p className="mt-1 text-xs text-slate-600">New questions will appear here as you build the form.</p>
            </div>
          )}

          {completed && (
            <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400" aria-hidden="true">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                </svg>
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">Conversation complete</h3>
              <p className="mt-1 text-sm text-slate-400">{form.completionMessage || "Thank you for your responses!"}</p>
              <button onClick={resetPreview} className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
                Restart preview
              </button>
            </div>
          )}
        </div>

        {!completed && currentQuestion && (
          <div className="shrink-0 border-t border-white/8 bg-slate-900/40 p-3 sm:p-4">
            {currentQuestion.type === "MULTIPLE_CHOICE" ? (
              <div className="flex flex-wrap gap-2" aria-label="Answer choices">
                {parseOptions(currentQuestion.options).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => submitAnswer(option)}
                    className="rounded-full border px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
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
                  <button key={option} type="button" onClick={() => submitAnswer(option)} className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-slate-700">
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
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60"
                />
                <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:brightness-110" style={{ backgroundColor: accent }} aria-label="Send answer">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}
            {!currentQuestion.required && (
              <button type="button" onClick={() => submitAnswer("")} className="mt-2 text-xs text-slate-500 transition hover:text-slate-300">Skip question</button>
            )}
          </div>
        )}

        <footer className="shrink-0 border-t border-white/5 px-4 py-2 text-center text-[10px] text-slate-600">
          Powered by <span className="font-semibold" style={{ color: accent }}>FormFly</span>
          <span className="ml-2 text-slate-700">· Preview answers are not submitted</span>
        </footer>
      </div>
    </section>
  );
}
