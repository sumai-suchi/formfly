import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateFormButton from "@/components/dashboard/CreateFormButton";
import EmptyFormsState from "@/components/dashboard/EmptyFormsState";
import FormsList from "@/components/dashboard/FormsList";

export default async function MyFormsPage() {
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">My Forms</h1>
          <p className="mt-1 text-sm text-slate-500">Manage, edit, and delete your forms.</p>
        </div>
        {forms.length > 0 && <CreateFormButton />}
      </div>

      {forms.length === 0 ? (
        <EmptyFormsState />
      ) : (
        <FormsList
          showActions
          forms={forms.map((form) => ({
            id: form.id,
            title: form.title,
            description: form.description,
            status: form.status,
            updatedAt: form.updatedAt.toISOString(),
            submissionCount: form._count.submissions,
            questionCount: form._count.questions,
          }))}
        />
      )}
    </div>
  );
}
