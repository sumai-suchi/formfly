import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import TestWidgetPlayground from "@/components/dashboard/TestWidgetPlayground";

interface TestWidgetPageProps {
  params: Promise<{ publicId: string }>;
}

export default async function TestWidgetPage({ params }: TestWidgetPageProps) {
  const { publicId } = await params;
  const user = await getSessionUser();

  const form = await prisma.form.findFirst({
    where: { publicId },
  });

  if (!form) notFound();

  const isOwner = Boolean(user && user.id === form.ownerId);
  if (form.status !== "PUBLISHED" && !isOwner) {
    notFound();
  }

  const primaryColor = form.primaryColor || "#4f46e5";

  return (
    <TestWidgetPlayground
      formId={form.id}
      publicId={form.publicId}
      title={form.title}
      status={form.status}
      primaryColor={primaryColor}
    />
  );
}
