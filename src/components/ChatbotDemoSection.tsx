"use client";

import { useState, useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type FormTemplateKey = "leadgen" | "feedback" | "event";

interface QuestionConfig {
  id: number;
  prompt: string;
  type: "email" | "choice" | "yesno" | "text" | "rating";
  options?: string[];
  placeholder?: string;
}

const TEMPLATES: Record<
  FormTemplateKey,
  {
    name: string;
    description: string;
    tag: string;
    questions: QuestionConfig[];
  }
> = {
  leadgen: {
    name: "SaaS Lead Qualification",
    description: "Capture high-intent buyers and route them to calendar bookings.",
    tag: "Lead Gen",
    questions: [
      {
        id: 1,
        type: "email",
        prompt: "To get started with your personalized trial, what is your work email?",
        placeholder: "name@company.com",
      },
      {
        id: 2,
        type: "choice",
        prompt: "How many team members will be using FormFly?",
        options: ["1 - 5 seats", "6 - 25 seats", "26 - 100 seats", "100+ Enterprise"],
      },
      {
        id: 3,
        type: "yesno",
        prompt: "Would you like our technical team to schedule an onboarding walkthrough?",
      },
    ],
  },
  feedback: {
    name: "Customer CSAT & Feedback",
    description: "Measure user delight and gather constructive qualitative insights.",
    tag: "Feedback",
    questions: [
      {
        id: 1,
        type: "rating",
        prompt: "How satisfied are you with your FormFly experience so far?",
      },
      {
        id: 2,
        type: "text",
        prompt: "What is the single most valuable feature we could add next?",
        placeholder: "E.g. Zapier 2-way sync, custom fonts...",
      },
      {
        id: 3,
        type: "yesno",
        prompt: "Can our product team reach out to you for a 10-minute research interview?",
      },
    ],
  },
  event: {
    name: "Webinar & Event RSVP",
    description: "Convert signups with frictionless single-prompt attendee registration.",
    tag: "Event RSVP",
    questions: [
      {
        id: 1,
        type: "text",
        prompt: "Hi there! What is your full name and current job title?",
        placeholder: "E.g. Sarah Jenkins, Head of Growth",
      },
      {
        id: 2,
        type: "choice",
        prompt: "Which breakout session are you most excited to attend?",
        options: [
          "Conversational CRO Tactics",
          "Automating Lead Qualification",
          "GSAP & Modern Web UX",
        ],
      },
      {
        id: 3,
        type: "email",
        prompt: "Where should we send your calendar invite and stream access key?",
        placeholder: "E.g. sarah@startup.io",
      },
    ],
  },
};

const THEME_COLORS = [
  { name: "Indigo", hex: "#6366f1", bgClass: "bg-indigo-600", textClass: "text-indigo-400", borderClass: "border-indigo-500" },
  { name: "Emerald", hex: "#10b981", bgClass: "bg-emerald-600", textClass: "text-emerald-400", borderClass: "border-emerald-500" },
  { name: "Purple", hex: "#a855f7", bgClass: "bg-purple-600", textClass: "text-purple-400", borderClass: "border-purple-500" },
  { name: "Rose", hex: "#f43f5e", bgClass: "bg-rose-600", textClass: "text-rose-400", borderClass: "border-rose-500" },
  { name: "Amber", hex: "#f59e0b", bgClass: "bg-amber-600", textClass: "text-amber-400", borderClass: "border-amber-500" },
];

export default function ChatbotDemoSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  // Playground state
  const [activeTemplateKey, setActiveTemplateKey] = useState<FormTemplateKey>("leadgen");
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0]);
  const [displayMode, setDisplayMode] = useState<"embedded" | "floating">("embedded");
  const [isFloatingOpen, setIsFloatingOpen] = useState(true);

  // Form conversation state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeTemplate = TEMPLATES[activeTemplateKey];
  const currentQuestion = activeTemplate.questions[currentStepIndex];

  // GSAP entrance animations
  useGSAP(
    () => {
      gsap.from(".demo-header > *", {
        scrollTrigger: {
          trigger: ".demo-header",
          start: "top 92%",
          once: true,
        },
        opacity: 0,
        y: 18,
        stagger: 0.05,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });

      gsap.from(".demo-studio-box", {
        scrollTrigger: {
          trigger: ".demo-studio-box",
          start: "top 90%",
          once: true,
        },
        opacity: 0,
        y: 20,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  // Auto-scroll chat box when new step appears
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [currentStepIndex, answers, isSubmitted, isTyping]);

  const handleTemplateChange = (key: FormTemplateKey) => {
    setActiveTemplateKey(key);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setInputValue("");
    setIsTyping(false);
    setIsSubmitted(false);
  };

  const advanceStep = (answerText: string) => {
    const qId = currentQuestion.id;
    setAnswers((prev) => ({ ...prev, [qId]: answerText }));
    setInputValue("");

    if (currentStepIndex + 1 < activeTemplate.questions.length) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStepIndex((prev) => prev + 1);
      }, 450);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setIsSubmitted(true);
      }, 600);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    advanceStep(inputValue.trim());
  };

  const generatedScriptCode = `<script 
  src="https://formfly.app/formfly-widget.js" 
  data-form-id="ff_${activeTemplateKey}"
  data-theme="${themeColor.name.toLowerCase()}"
  data-mode="${displayMode}"
  async>
</script>`;

  const copyScriptCode = () => {
    navigator.clipboard.writeText(generatedScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="demo"
      ref={containerRef}
      className="relative overflow-hidden bg-[#090a0f] py-28 text-slate-100 border-t border-white/5"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-indigo-600/10 blur-[60px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="demo-header mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            03 // LIVE CHATBOT SIMULATOR
          </div>

          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Test The Conversational Experience{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-white bg-clip-text text-transparent">
              In Real-Time.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Switch between use-case templates, change accent themes, toggle between embedded & floating widget modes, and interact with the live dialogue.
          </p>
        </div>

        {/* Demo Studio Box */}
        <div className="demo-studio-box mt-14 rounded-2xl border border-white/10 bg-[#0d0f17]/95 shadow-2xl shadow-black/60 backdrop-blur-sm overflow-hidden">
          
          {/* Top Control Bar: Template Switcher & Modes */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/60 px-6 py-4">
            
            {/* Template Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-1 hidden sm:inline">
                TEMPLATE:
              </span>
              {(Object.keys(TEMPLATES) as FormTemplateKey[]).map((key) => {
                const isSelected = activeTemplateKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTemplateChange(key)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {TEMPLATES[key].name}
                  </button>
                );
              })}
            </div>

            {/* Display Mode & Color Controls */}
            <div className="flex items-center gap-4">
              
              {/* Display Mode Toggle */}
              <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode("embedded");
                    setIsFloatingOpen(true);
                  }}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
                    displayMode === "embedded"
                      ? "bg-white/15 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  In-Page Embed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode("floating");
                    setIsFloatingOpen(true);
                  }}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
                    displayMode === "floating"
                      ? "bg-white/15 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Floating Bubble
                </button>
              </div>

              {/* Theme Color Picker */}
              <div className="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-4">
                <span className="text-xs font-mono text-slate-400 mr-1">THEME:</span>
                {THEME_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => setThemeColor(c)}
                    className={`h-5 w-5 rounded-full transition-transform ${c.bgClass} ${
                      themeColor.name === c.name
                        ? "ring-2 ring-white scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={resetForm}
                title="Restart flow"
                className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            
            {/* Left Column: Simulated Browser Window (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 p-6 lg:p-8 bg-[#0b0d14] flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10">
              
              {/* Browser Window Chrome */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 font-mono text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                    https://your-company.com/request-demo
                  </span>
                </div>
                <div className="text-[11px] font-mono text-indigo-400">
                  {displayMode === "embedded" ? "MODE: INLINE EMBED" : "MODE: FLOATING LAUNCHER"}
                </div>
              </div>

              {/* Simulated Page Background Content */}
              <div className="relative flex-1 flex flex-col justify-center items-center">
                {displayMode === "floating" && (
                  <div className="w-full max-w-md p-6 text-center space-y-3 opacity-40 select-none">
                    <div className="h-4 w-32 bg-white/10 rounded mx-auto" />
                    <div className="h-7 w-64 bg-white/20 rounded mx-auto" />
                    <div className="h-3 w-full bg-white/10 rounded" />
                    <div className="h-3 w-4/5 bg-white/10 rounded mx-auto" />
                    <p className="text-xs text-slate-400 mt-4">
                      [Your existing website content renders here. Notice the interactive FormFly chat widget launcher docked at the bottom right.]
                    </p>
                  </div>
                )}

                {/* THE ACTUAL INTERACTIVE CHATBOT WIDGET */}
                <div
                  className={`w-full max-w-lg transition-all duration-300 ${
                    displayMode === "floating"
                      ? isFloatingOpen
                        ? "absolute bottom-16 right-0 sm:right-4 shadow-2xl z-20"
                        : "hidden"
                      : "relative mx-auto"
                  }`}
                >
                  <div className="rounded-2xl border border-white/15 bg-[#0f121d] shadow-2xl shadow-black/80 backdrop-blur-sm overflow-hidden">
                    
                    {/* Widget Header */}
                    <div
                      className="flex items-center justify-between px-5 py-3.5 text-white"
                      style={{ backgroundColor: `${themeColor.hex}18`, borderBottom: `1px solid ${themeColor.hex}30` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-xs shadow"
                          style={{ backgroundColor: themeColor.hex }}
                        >
                          FF
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {activeTemplate.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Conversational Form
                          </div>
                        </div>
                      </div>

                      {displayMode === "floating" && (
                        <button
                          type="button"
                          onClick={() => setIsFloatingOpen(false)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                          title="Minimize widget"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Chat Messages Stream */}
                    <div
                      ref={chatMessagesRef}
                      className="p-5 space-y-4 max-h-[300px] min-h-[250px] overflow-y-auto scroll-smooth text-xs sm:text-sm"
                    >
                      {/* Greeting */}
                      <div className="flex items-start gap-2.5">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: themeColor.hex }}
                        >
                          FF
                        </div>
                        <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.04] p-3 text-slate-200 max-w-[85%] leading-relaxed">
                          Hello! Welcome to FormFly. Let us guide you step by step.
                        </div>
                      </div>

                      {/* Display Past Questions & Answers */}
                      {activeTemplate.questions.map((q, idx) => {
                        if (idx > currentStepIndex && !isSubmitted) return null;
                        const hasAnswer = answers[q.id] !== undefined;
                        if (!hasAnswer && idx !== currentStepIndex) return null;

                        return (
                          <div key={q.id} className="space-y-3">
                            {/* Question prompt */}
                            <div className="flex items-start gap-2.5">
                              <div
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                                style={{ backgroundColor: themeColor.hex }}
                              >
                                FF
                              </div>
                              <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.04] p-3 text-slate-200 max-w-[85%] leading-relaxed">
                                <span
                                  className="block text-[10px] font-mono mb-1 font-semibold"
                                  style={{ color: themeColor.hex }}
                                >
                                  Step {idx + 1} of {activeTemplate.questions.length}
                                </span>
                                {q.prompt}
                              </div>
                            </div>

                            {/* User's Answer */}
                            {hasAnswer && (
                              <div className="flex justify-end">
                                <div
                                  className="rounded-xl rounded-tr-sm px-4 py-2 text-white text-xs sm:text-sm shadow-md"
                                  style={{ backgroundColor: themeColor.hex }}
                                >
                                  {answers[q.id]}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Bot Typing Indicator */}
                      {isTyping && (
                        <div className="flex items-start gap-2.5">
                          <div
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white opacity-60"
                            style={{ backgroundColor: themeColor.hex }}
                          >
                            FF
                          </div>
                          <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-400">
                            <span className="inline-flex gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Completion Card */}
                      {isSubmitted && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center mt-3">
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-white">
                            Form Response Captured!
                          </div>
                          <div className="text-xs text-slate-300 mt-1">
                            Responses are instantly streamed to your dashboard & webhooks.
                          </div>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="mt-3 text-xs font-semibold underline cursor-pointer"
                            style={{ color: themeColor.hex }}
                          >
                            Test Again
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Widget Interactive Input Area */}
                    {!isSubmitted && currentQuestion && (
                      <div className="border-t border-white/10 bg-black/50 p-4">
                        
                        {/* Short Text or Email Input */}
                        {(currentQuestion.type === "text" || currentQuestion.type === "email") && (
                          <form onSubmit={handleInputSubmit} className="flex gap-2">
                            <input
                              type={currentQuestion.type === "email" ? "email" : "text"}
                              required
                              placeholder={currentQuestion.placeholder || "Type your response..."}
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                              style={{ borderColor: inputValue ? themeColor.hex : undefined }}
                            />
                            <button
                              type="submit"
                              className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-opacity cursor-pointer"
                              style={{ backgroundColor: themeColor.hex }}
                            >
                              Send
                            </button>
                          </form>
                        )}

                        {/* Multiple Choice Buttons */}
                        {currentQuestion.type === "choice" && currentQuestion.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentQuestion.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => advanceStep(opt)}
                                className="rounded-lg border border-white/15 bg-white/[0.04] p-2.5 text-left text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer hover:border-white/40"
                                style={{
                                  borderColor: themeColor.hex ? `${themeColor.hex}40` : undefined,
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Yes / No Buttons */}
                        {currentQuestion.type === "yesno" && (
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => advanceStep("Yes, absolutely")}
                              className="flex-1 rounded-lg py-2.5 text-xs font-semibold text-white transition-all cursor-pointer shadow"
                              style={{ backgroundColor: themeColor.hex }}
                            >
                              Yes, absolutely
                            </button>
                            <button
                              type="button"
                              onClick={() => advanceStep("Not right now")}
                              className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                            >
                              Not right now
                            </button>
                          </div>
                        )}

                        {/* Rating Stars / CSAT */}
                        {currentQuestion.type === "rating" && (
                          <div className="flex items-center justify-center gap-3 py-1">
                            {["😡 1", "😐 2", "🙂 3", "😃 4", "🤩 5 - Excellent!"].map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                onClick={() => advanceStep(rate)}
                                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                              >
                                {rate}
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    )}

                    {/* Widget Footer */}
                    <div className="flex items-center justify-between border-t border-white/10 bg-black/80 px-4 py-2 text-[10px] font-mono text-slate-400">
                      <span>Step {currentStepIndex + 1} of {activeTemplate.questions.length}</span>
                      <span className="flex items-center gap-1">
                        Powered by <strong className="text-white">FormFly</strong>
                      </span>
                    </div>

                  </div>
                </div>

                {/* Floating Launcher Trigger Icon (shown when floating mode is active) */}
                {displayMode === "floating" && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={() => setIsFloatingOpen(!isFloatingOpen)}
                      className="group flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-xl shadow-black/60 transition-transform duration-200 hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: themeColor.hex }}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="text-xs font-semibold">
                        {isFloatingOpen ? "Minimize" : "Ask Question"}
                      </span>
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Right Column: Code Snippet & Live Insights (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 p-6 lg:p-7 bg-[#0d0f17] flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-indigo-400">
                    DYNAMIC SNIPPET
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded">
                    Universal JS
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  The script updates dynamically based on your chosen template, theme, and placement mode. Copy and paste it anywhere:
                </p>

                {/* Code Preview Block */}
                <div className="mt-4 rounded-xl border border-white/10 bg-black/80 p-3.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span>index.html</span>
                    <button
                      type="button"
                      onClick={copyScriptCode}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      {copiedCode ? "✓ Copied" : "Copy Code"}
                    </button>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap select-all">
                    {generatedScriptCode}
                  </pre>
                </div>

                {/* Live Collected State Inspector */}
                <div className="mt-6">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Simulated Payload Stream
                  </span>
                  <div className="mt-2 rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-[10px] text-slate-300 space-y-1">
                    <div>{`{`}</div>
                    <div className="pl-3 text-indigo-300">
                      {`"template": "${activeTemplateKey}",`}
                    </div>
                    <div className="pl-3 text-indigo-300">
                      {`"mode": "${displayMode}",`}
                    </div>
                    <div className="pl-3 text-emerald-400">
                      {`"submitted": ${isSubmitted},`}
                    </div>
                    <div className="pl-3 text-slate-400">
                      {`"answers": ${JSON.stringify(answers)}`}
                    </div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>

              {/* Ready to launch CTA box */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <a
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  <span>Build This Form For Your Site</span>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
