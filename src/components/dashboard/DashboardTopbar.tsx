

import Link from "next/link";

interface DashboardTopbarProps {
  userName?: string | null;
  userEmail: string;
}

export default function DashboardTopbar({ userName, userEmail }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090a0f]/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand — left side (with space for mobile sidebar toggle) */}
        <Link href="/" className="group flex items-center gap-2.5 pl-10 lg:pl-0 transition hover:opacity-90">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-transform duration-200 group-hover:scale-105">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">FormFly</span>
        </Link>

        {/* Right side */}
        <div className="relative flex items-center gap-3">
        

          {/* User chip */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/8 bg-slate-800/50 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600/30 text-[10px] font-bold text-indigo-300">
              {(userName ?? userEmail).charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-slate-400 max-w-[120px] truncate">
              {userName ?? userEmail}
            </span>
          </div>

          {/* Logout */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-slate-700/60 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
