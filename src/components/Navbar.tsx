"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavbarUser {
  id: string;
  name?: string | null;
  email: string;
}

interface NavbarProps {
  user?: NavbarUser | null;
}

// In-memory client cache so navigating between pages never causes an auth flicker
let cachedUser: NavbarUser | null | undefined = undefined;

export default function Navbar({ user: initialUser }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientUser, setClientUser] = useState<NavbarUser | null | undefined>(() => {
    if (initialUser !== undefined) return initialUser;
    if (cachedUser !== undefined) return cachedUser;
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("formfly_user");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return undefined;
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!isMounted) return;
        if (data?.user) {
          const userObj = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          };
          cachedUser = userObj;
          setClientUser(userObj);
          try {
            sessionStorage.setItem("formfly_user", JSON.stringify(userObj));
          } catch {
            // ignore
          }
        } else {
          cachedUser = null;
          setClientUser(null);
          try {
            sessionStorage.removeItem("formfly_user");
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          cachedUser = null;
          setClientUser(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentUser = initialUser !== undefined ? initialUser : (clientUser ?? null);

  const handleLogoutClick = () => {
    cachedUser = null;
    try {
      sessionStorage.removeItem("formfly_user");
    } catch {
      // ignore
    }
  };

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Live Demo", href: "/demo" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090a0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <Link href="/" prefetch={true} className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-transform duration-200 group-hover:scale-105">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">FormFly</span>
          </Link>
        </div>

        {/* Navigation Links - Desktop Only */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-white/10 text-white font-semibold shadow-inner"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop & Mobile Actions Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Desktop Dashboard Link */}
              <Link
                href="/dashboard"
                prefetch={true}
                className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600/30 text-[10px] font-bold text-indigo-300">
                  {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                </div>
                <span>Dashboard</span>
              </Link>

              {/* Desktop Logout Button */}
              <form action="/api/auth/logout?from=/" method="POST" className="hidden md:block" onSubmit={handleLogoutClick}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 transition-all cursor-pointer"
                  title="Sign out of FormFly"
                >
                  <svg
                    className="h-3.5 w-3.5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </form>

              {/* Create Form CTA */}
              <Link
                href="/dashboard"
                prefetch={true}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 active:scale-95"
              >
                <span>Create Form</span>
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              {/* Desktop Sign In */}
              <Link
                href="/login"
                prefetch={true}
                className="hidden md:inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-white px-3 py-2"
              >
                Sign in
              </Link>

              {/* Create Form CTA */}
              <Link
                href="/dashboard"
                prefetch={true}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 active:scale-95"
              >
                <span>Create Form</span>
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </>
          )}

          {/* Mobile menu hamburger toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#090a0f]/98 px-5 py-4 space-y-3 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Profile Bar if Logged In */}
          {currentUser && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-slate-900/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
                  {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser.name || "FormFly User"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shrink-0" title="Active Session" />
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition active:scale-98"
                >
                  <span>Go to Dashboard</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <form action="/api/auth/logout?from=/" method="POST" onSubmit={handleLogoutClick}>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition active:scale-98"
                >
                  <span>Create Form Free</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/login"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-200 hover:bg-white/10 transition"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
