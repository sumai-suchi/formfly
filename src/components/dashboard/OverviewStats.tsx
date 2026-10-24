import StatCard from "./StatCard";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconForms() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconSubmissions() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function IconPublished() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconActive() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OverviewStatsProps {
  totalForms?: number;
  totalSubmissions?: number;
  publishedForms?: number;
  activeForms?: number;
}

export default function OverviewStats({
  totalForms = 0,
  totalSubmissions = 0,
  publishedForms = 0,
  activeForms = 0,
}: OverviewStatsProps) {
  const stats = [
    {
      label: "Total Forms",
      value: totalForms,
      icon: <IconForms />,
      color: "indigo" as const,
    },
    {
      label: "Total Submissions",
      value: totalSubmissions,
      icon: <IconSubmissions />,
      color: "violet" as const,
    },
    {
      label: "Published Forms",
      value: publishedForms,
      icon: <IconPublished />,
      color: "cyan" as const,
    },
    {
      label: "Active Forms",
      value: activeForms,
      icon: <IconActive />,
      color: "emerald" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
