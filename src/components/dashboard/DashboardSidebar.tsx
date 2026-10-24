"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconLayout() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconForms() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconInbox() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function IconEmbed() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Nav item ────────────────────────────────────────────────────────────────

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
}

function NavItem({ href, icon, label, badge, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-indigo-600/20 text-indigo-300 shadow-sm"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      <span className={`transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-indigo-600/30 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
          {badge}
        </span>
      )}
    </Link>
  );
}

// ─── Section group ────────────────────────────────────────────────────────────

interface SectionGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SectionGroup({ title, children, defaultOpen = true }: SectionGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-400 transition-colors"
      >
        <IconChevron open={open} />
        {title}
      </button>
      {open && <div className="mt-0.5 space-y-0.5">{children}</div>}
    </div>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {/* My Workspace group */}
      <SectionGroup title="My Workspace" defaultOpen>
        <NavItem href="/dashboard" icon={<IconLayout />} label="Overview" onClick={onNavClick} />
        <NavItem href="/dashboard/forms" icon={<IconForms />} label="My Forms" onClick={onNavClick} />
        <NavItem href="/dashboard/submissions" icon={<IconInbox />} label="Submissions" onClick={onNavClick} />
      </SectionGroup>

      {/* Divider */}
      <div className="my-2 border-t border-white/5" />

      {/* Integrations & Embed group */}
      <SectionGroup title="Embed & Widget" defaultOpen>
        <NavItem href="/dashboard/embed" icon={<IconEmbed />} label="Embed Widget" onClick={onNavClick} />
      </SectionGroup>
    </nav>
  );
}

// ─── Main sidebar export ──────────────────────────────────────────────────────

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur text-slate-300 hover:text-white transition-colors"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <IconClose /> : <IconMenu />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel – desktop: sticky, mobile: slide-in drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 flex-shrink-0
          border-r border-white/5 bg-[#0d0f17]/95 backdrop-blur-xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar brand (mobile only) */}
        <div className="flex h-16 items-center border-b border-white/5 px-4 lg:hidden">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-2.5 transition hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-transform duration-200 group-hover:scale-105">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">FormFly</span>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto pt-2 pb-4">
          <SidebarContent onNavClick={() => setMobileOpen(false)} />
        </div>

        {/* Sidebar footer hint */}
        <div className="border-t border-white/5 p-4">
          <p className="text-[10px] text-slate-600 text-center">FormFly v0.1 · Beta</p>
        </div>
      </aside>
    </>
  );
}
