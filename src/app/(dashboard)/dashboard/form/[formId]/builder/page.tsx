import { redirect, notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BuilderLayout from "@/components/formBuilder/BuilderLayout";
import { FormData, QuestionData } from "@/types/form";

interface PageProps {
  params: Promise<{ formId: string }>;
}

export default async function BuilderPage({ params }: PageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const { formId } = await params;

  const form = await prisma.form.findFirst({
    where: { id: formId, ownerId: user.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!form) {
    notFound();
  }

  const formData: FormData = {
    id: form.id,
    publicId: form.publicId,
    title: form.title,
    description: form.description,
    status: form.status as FormData["status"],
    welcomeMessage: form.welcomeMessage,
    completionMessage: form.completionMessage,
    primaryColor: form.primaryColor,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
  };

  const questionsData: QuestionData[] = form.questions.map((q) => ({
    id: q.id,
    formId: q.formId,
    label: q.label,
    description: q.description,
    type: q.type as QuestionData["type"],
    options: q.options,
    required: q.required,
    order: q.order,
  }));

  return <BuilderLayout initialForm={formData} initialQuestions={questionsData} />;
}
