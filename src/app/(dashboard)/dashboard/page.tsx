import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import OverviewStats from "@/components/dashboard/OverviewStats";
import CreateFormButton from "@/components/dashboard/CreateFormButton";
import EmptyFormsState from "@/components/dashboard/EmptyFormsState";
import FormsList from "@/components/dashboard/FormsList";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const forms = await prisma.form.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { submissions: true, questions: true },
      },
    },
  });

  const totalSubmissions = forms.reduce((total, form) => total + form._count.submissions, 0);
  const publishedForms = forms.filter((form) => form.status === "PUBLISHED").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Welcome banner ──────────────────────────────────────────────── */}
      <WelcomeBanner name={user.name} email={user.email} />

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <OverviewStats
        totalForms={forms.length}
        totalSubmissions={totalSubmissions}
        publishedForms={publishedForms}
        activeForms={publishedForms}
      />

      {/* ── Forms section header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">My Forms</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Your five most recently updated forms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/forms" className="hidden text-xs font-medium text-indigo-400 transition hover:text-indigo-300 sm:inline">
            View all forms →
          </Link>
          {/* Mobile-visible Create Form button (topbar hides it on sm+) */}
          <div className="sm:hidden">
            <CreateFormButton />
          </div>
        </div>
      </div>

      {/* ── Forms list / empty state ─────────────────────────────────────── */}
      {forms.length === 0 ? <EmptyFormsState /> : <FormsList forms={forms.map((form) => ({
        id: form.id,
        title: form.title,
        description: form.description,
        status: form.status,
        updatedAt: form.updatedAt.toISOString(),
        submissionCount: form._count.submissions,
        questionCount: form._count.questions,
      })).slice(0, 5)} />}
      {forms.length > 0 && (
        <Link href="/dashboard/forms" className="block text-center text-xs font-medium text-indigo-400 transition hover:text-indigo-300 sm:hidden">
          View all {forms.length} forms →
        </Link>
      )}
    </div>
  );
}
