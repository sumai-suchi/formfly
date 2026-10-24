import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {user.name ? `Hey, ${user.name} 👋` : "Your Dashboard"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            You&apos;re signed in as{" "}
            <span className="text-slate-300 font-medium">{user.email}</span>
          </p>
        </div>
      </div>

      {/* Placeholder stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Forms", value: "0", icon: "📋" },
          { label: "Total Submissions", value: "0", icon: "📨" },
          { label: "Published Forms", value: "0", icon: "🚀" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-slate-900/60 p-5 flex items-center gap-4"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-600/20">
          <svg
            className="h-7 w-7 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">No forms yet</h3>
        <p className="mt-1.5 text-sm text-slate-400 max-w-xs mx-auto">
          Create your first conversational form and start collecting responses.
        </p>
        <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Form
        </button>
      </div>
    </div>
  );
}
