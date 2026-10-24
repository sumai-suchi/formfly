import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import PublicFormChat from "@/components/formBuilder/PublicFormChat";

interface PublicFormPageProps {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ embed?: string; preview?: string }>;
}

export default async function PublicFormPage({ params, searchParams }: PublicFormPageProps) {
  const [{ publicId }, query] = await Promise.all([params, searchParams]);
  const embedded = query.embed === "1";
  const user = await getSessionUser();

  const form = await prisma.form.findFirst({
    where: { publicId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!form) notFound();

  const isOwner = Boolean(user && user.id === form.ownerId);
  const isPreview = query.preview === "1" || (embedded && isOwner);

  if (form.status !== "PUBLISHED" && !isOwner && !isPreview) {
    notFound();
  }

  return (
    <main className={embedded
      ? "h-dvh w-full overflow-hidden bg-transparent text-slate-100"
      : "flex min-h-screen items-center justify-center bg-[#090a0f] px-4 py-8 text-slate-100 sm:px-6"
    }>
      <PublicFormChat
        embedded={embedded}
        publicId={form.publicId}
        title={form.title}
        welcomeMessage={form.welcomeMessage}
        completionMessage={form.completionMessage}
        primaryColor={form.primaryColor}
        questions={form.questions.map((question) => ({
          id: question.id,
          label: question.label,
          description: question.description,
          type: question.type,
          options: question.options,
          required: question.required,
          order: question.order,
        }))}
      />
    </main>
  );
}
