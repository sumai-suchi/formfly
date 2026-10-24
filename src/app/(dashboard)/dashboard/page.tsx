import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import OverviewStats from "@/components/dashboard/OverviewStats";
import CreateFormButton from "@/components/dashboard/CreateFormButton";
import EmptyFormsState from "@/components/dashboard/EmptyFormsState";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Welcome banner ──────────────────────────────────────────────── */}
      <WelcomeBanner name={user.name} email={user.email} />

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <OverviewStats
        totalForms={0}
        totalSubmissions={0}
        publishedForms={0}
        activeForms={0}
      />

      {/* ── Forms section header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">My Forms</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            All your conversational forms in one place.
          </p>
        </div>
        {/* Mobile-visible Create Form button (topbar hides it on sm+) */}
        <div className="sm:hidden">
          <CreateFormButton />
        </div>
      </div>

      {/* ── Forms list / empty state ─────────────────────────────────────── */}
      <EmptyFormsState />
    </div>
  );
}
