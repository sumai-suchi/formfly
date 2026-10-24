import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateFormButton from "@/components/dashboard/CreateFormButton";
import EmptyFormsState from "@/components/dashboard/EmptyFormsState";
import FormsList from "@/components/dashboard/FormsList";
import Pagination from "@/components/dashboard/Pagination";

interface MyFormsPageProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 8;

export default async function MyFormsPage({ searchParams }: MyFormsPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const query = await searchParams;
  const rawPage = parseInt(query.page || "1", 10);
  const requestedPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const totalForms = await prisma.form.count({
    where: { ownerId: user.id },
  });

  const totalPages = Math.max(1, Math.ceil(totalForms / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const forms = await prisma.form.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      _count: {
        select: { submissions: true, questions: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">My Forms</h1>
          <p className="mt-1 text-sm text-slate-500">Manage, edit, and delete your forms.</p>
        </div>
        {totalForms > 0 && <CreateFormButton />}
      </div>

      {totalForms === 0 ? (
        <EmptyFormsState />
      ) : (
        <div className="space-y-4">
          <FormsList
            showActions
            forms={forms.map((form) => ({
              id: form.id,
              publicId: form.publicId,
              title: form.title,
              description: form.description,
              status: form.status,
              updatedAt: form.updatedAt.toISOString(),
              submissionCount: form._count.submissions,
              questionCount: form._count.questions,
              primaryColor: form.primaryColor,
              welcomeMessage: form.welcomeMessage,
              completionMessage: form.completionMessage,
            }))}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalForms}
            pageSize={PAGE_SIZE}
            basePath="/dashboard/forms"
          />
        </div>
      )}
    </div>
  );
}
