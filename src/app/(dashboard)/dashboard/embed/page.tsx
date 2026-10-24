import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EmbedCodePanel from "@/components/dashboard/EmbedCodePanel";

export default async function EmbedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const forms = await prisma.form.findMany({
    where: { ownerId: user.id, status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
    select: { id: true, publicId: true, title: true, primaryColor: true },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-white">Embed chatbot</h1>
        <p className="mt-1 text-sm text-slate-500">Share a public form or add its floating chat widget to another website.</p>
      </header>
      <EmbedCodePanel forms={forms} />
    </div>
  );
}
