import { Suspense } from "react";
import LoginForm from "@/components/authComponents/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#090a0f] text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to FormFly
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse text-center text-sm text-slate-400">
              Loading login portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
