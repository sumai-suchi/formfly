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

export default function Navbar({ user: initialUser }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientUser, setClientUser] = useState<NavbarUser | null | undefined>(undefined);

  useEffect(() => {
    if (initialUser !== undefined) return;

    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!isMounted) return;
        if (data?.user) {
          setClientUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          setClientUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setClientUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, [initialUser]);

  const currentUser = initialUser !== undefined ? initialUser : (clientUser ?? null);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Live Demo", href: "/demo" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
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
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">FormFly</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Go to Dashboard */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600/30 text-[10px] font-bold text-indigo-300">
                  {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                </div>
                <span>Dashboard</span>
              </Link>

              {/* Logout Button */}
              <form action="/api/auth/logout?from=/" method="POST">
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
                className="group relative inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 active:scale-95"
              >
                <span>Create Form</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 active:scale-95"
              >
                <span>Create Form</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-[#090a0f]/95 px-6 py-4 space-y-2 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
            {currentUser ? (
              <>
                <div className="px-3 py-1 text-xs text-slate-400">
                  Signed in as <span className="text-white font-medium">{currentUser.name || currentUser.email}</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600/20"
                >
                  Dashboard
                </Link>
                <form action="/api/auth/logout?from=/" method="POST">
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 text-center"
                >
                  Create Form
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
