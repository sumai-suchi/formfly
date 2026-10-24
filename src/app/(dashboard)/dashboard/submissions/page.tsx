import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pagination from "@/components/dashboard/Pagination";

interface SubmissionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function SubmissionsPage({ searchParams }: SubmissionsPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const query = await searchParams;
  const rawPage = parseInt(query.page || "1", 10);
  const requestedPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const totalSubmissions = await prisma.submission.count({
    where: { form: { ownerId: user.id } },
  });

  const totalPages = Math.max(1, Math.ceil(totalSubmissions / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const submissions = await prisma.submission.findMany({
    where: { form: { ownerId: user.id } },
    orderBy: { submittedAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      form: { select: { id: true, title: true } },
      answers: {
        include: { question: { select: { label: true, order: true } } },
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-white">Submissions</h1>
        <p className="mt-1 text-sm text-slate-500">Individual responses to your published forms.</p>
      </header>

      {totalSubmissions === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-14 text-center">
          <h2 className="text-sm font-semibold text-white">No submissions yet</h2>
          <p className="mt-2 text-sm text-slate-500">Responses will appear here after someone completes a published form.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {submissions.map((submission) => (
              <details key={submission.id} className="group rounded-xl border border-white/8 bg-slate-900/50">
                <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-white">{submission.form.title}</h2>
                    <time dateTime={submission.submittedAt.toISOString()} className="mt-1 block text-xs text-slate-500">
                      Submitted {submission.submittedAt.toLocaleString()}
                    </time>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{submission.answers.length} {submission.answers.length === 1 ? "answer" : "answers"}</span>
                    <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                  </div>
                </summary>
                <div className="space-y-3 border-t border-white/8 px-4 py-4">
                  {submission.answers
                    .slice()
                    .sort((a, b) => a.question.order - b.question.order)
                    .map((answer) => (
                      <div key={answer.id} className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:gap-4">
                        <p className="text-xs font-medium text-slate-400">{answer.question.label}</p>
                        <p className="break-words text-sm text-slate-100">{answer.value || <span className="text-slate-600">No answer</span>}</p>
                      </div>
                    ))}
                  {submission.answers.length === 0 && <p className="text-xs text-slate-500">This submission has no saved answers.</p>}
                </div>
              </details>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalSubmissions}
            pageSize={PAGE_SIZE}
            basePath="/dashboard/submissions"
          />
        </div>
      )}
    </div>
  );
}
