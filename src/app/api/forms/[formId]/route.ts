import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeChoiceOptions } from "@/lib/question-validation";

interface Params {
  params: Promise<{ formId: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ form });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId } = await params;

  const existing = await prisma.form.findFirst({
    where: { id: formId, ownerId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: {
    title?: string;
    description?: string | null;
    welcomeMessage?: string;
    completionMessage?: string;
    primaryColor?: string;
    status?: "DRAFT" | "PUBLISHED";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, welcomeMessage, completionMessage, primaryColor, status } = body;

  if (status !== undefined && status !== "DRAFT" && status !== "PUBLISHED") {
    return NextResponse.json({ error: "Status must be DRAFT or PUBLISHED" }, { status: 400 });
  }

  if (status === "PUBLISHED") {
    const questions = await prisma.question.findMany({
      where: { formId },
      select: { type: true, options: true },
    });
    if (questions.length === 0) {
      return NextResponse.json({ error: "Add at least one question before publishing this form" }, { status: 400 });
    }
    if (questions.some((question) => question.type === "MULTIPLE_CHOICE" && normalizeChoiceOptions(question.options).error)) {
      return NextResponse.json({ error: "Add at least two answer options to every multiple choice question before publishing" }, { status: 400 });
    }
  }

  const form = await prisma.form.update({
    where: { id: formId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(welcomeMessage !== undefined && { welcomeMessage }),
      ...(completionMessage !== undefined && { completionMessage }),
      ...(primaryColor !== undefined && { primaryColor }),
      ...(status !== undefined && { status }),
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json({ form });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId } = await params;
  const form = await prisma.form.findFirst({
    where: { id: formId, ownerId: user.id },
    select: { id: true },
  });

  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.form.delete({ where: { id: form.id } });
  return NextResponse.json({ success: true });
}
