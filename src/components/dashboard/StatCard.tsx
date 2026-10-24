interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: "indigo" | "violet" | "cyan" | "emerald";
}

const colorMap = {
  indigo: {
    icon: "text-indigo-400",
    bg: "bg-indigo-600/10",
    border: "border-indigo-600/20",
    glow: "bg-indigo-500/10",
    badge: "bg-indigo-600/20 text-indigo-300",
  },
  violet: {
    icon: "text-violet-400",
    bg: "bg-violet-600/10",
    border: "border-violet-600/20",
    glow: "bg-violet-500/10",
    badge: "bg-violet-600/20 text-violet-300",
  },
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-600/10",
    border: "border-cyan-600/20",
    glow: "bg-cyan-500/10",
    badge: "bg-cyan-600/20 text-cyan-300",
  },
  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-600/10",
    border: "border-emerald-600/20",
    glow: "bg-emerald-500/10",
    badge: "bg-emerald-600/20 text-emerald-300",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  color = "indigo",
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/8 bg-slate-900/60 p-5 backdrop-blur transition-all duration-200 hover:border-white/15 hover:bg-slate-900/80">
      {/* subtle glow */}
      <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl ${c.glow} pointer-events-none`} />

      <div className="relative flex items-start justify-between gap-4">
        {/* icon */}
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${c.border} ${c.bg}`}>
          <span className={c.icon}>{icon}</span>
        </div>

        {/* trend badge */}
        {trend && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
