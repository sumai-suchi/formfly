import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestionType } from "@/generated/prisma/client";
import { normalizeChoiceOptions } from "@/lib/question-validation";

interface Params {
  params: Promise<{ formId: string; questionId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId, questionId } = await params;

  const form = await prisma.form.findFirst({
    where: { id: formId, ownerId: user.id },
  });
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existingQuestion = await prisma.question.findFirst({
    where: { id: questionId, formId },
  });
  if (!existingQuestion) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  let body: {
    label?: string;
    description?: string | null;
    type?: string;
    options?: string | null;
    required?: boolean;
    order?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { label, description, type, options, required, order } = body;

  const validTypes: QuestionType[] = ["TEXT", "EMAIL", "MULTIPLE_CHOICE", "YES_NO"];
  if (type !== undefined && !validTypes.includes(type as QuestionType)) {
    return NextResponse.json({ error: "Unsupported question type" }, { status: 400 });
  }
  if (label !== undefined && (typeof label !== "string" || label.trim() === "")) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }
  if (description !== undefined && description !== null && typeof description !== "string") {
    return NextResponse.json({ error: "Description must be text" }, { status: 400 });
  }
  if (required !== undefined && typeof required !== "boolean") {
    return NextResponse.json({ error: "Required must be true or false" }, { status: 400 });
  }
  if (order !== undefined && (!Number.isInteger(order) || order < 0)) {
    return NextResponse.json({ error: "Question order must be a non-negative integer" }, { status: 400 });
  }

  const nextType = (type as QuestionType | undefined) ?? existingQuestion.type;
  let nextOptions: string | null = options ?? existingQuestion.options;
  if (nextType === "MULTIPLE_CHOICE") {
    const normalized = normalizeChoiceOptions(nextOptions);
    if (normalized.error) return NextResponse.json({ error: normalized.error }, { status: 400 });
    nextOptions = normalized.serialized ?? null;
  } else {
    nextOptions = null;
  }

  const question = await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(label !== undefined && { label: label.trim() }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type: nextType }),
      options: nextOptions,
      ...(required !== undefined && { required }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ question });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId, questionId } = await params;

  const form = await prisma.form.findFirst({
    where: { id: formId, ownerId: user.id },
  });
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existingQuestion = await prisma.question.findFirst({
    where: { id: questionId, formId },
  });
  if (!existingQuestion) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.question.delete({ where: { id: questionId } });
    const remainingQuestions = await transaction.question.findMany({
      where: { formId },
      orderBy: { order: "asc" },
      select: { id: true },
    });
    await Promise.all(
      remainingQuestions.map((question, order) =>
        transaction.question.update({ where: { id: question.id }, data: { order } })
      )
    );
  });

  return NextResponse.json({ success: true });
}
