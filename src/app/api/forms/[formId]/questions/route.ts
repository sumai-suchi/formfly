import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestionType } from "@/generated/prisma/client";
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
  });
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const questions = await prisma.question.findMany({
    where: { formId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ questions });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId } = await params;

  const form = await prisma.form.findFirst({
    where: { id: formId, ownerId: user.id },
  });
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  if (!label || typeof label !== "string" || label.trim() === "") {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }

  const validTypes: QuestionType[] = ["TEXT", "EMAIL", "MULTIPLE_CHOICE", "YES_NO"];
  const questionType: QuestionType =
    type && validTypes.includes(type as QuestionType)
      ? (type as QuestionType)
      : "TEXT";

  if (type !== undefined && !validTypes.includes(type as QuestionType)) {
    return NextResponse.json({ error: "Unsupported question type" }, { status: 400 });
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

  let savedOptions: string | null = null;
  if (questionType === "MULTIPLE_CHOICE") {
    const normalized = normalizeChoiceOptions(options);
    if (normalized.error) return NextResponse.json({ error: normalized.error }, { status: 400 });
    savedOptions = normalized.serialized ?? null;
  }

  // Determine order: max existing order + 1
  let questionOrder = order;
  if (questionOrder === undefined) {
    const lastQuestion = await prisma.question.findFirst({
      where: { formId },
      orderBy: { order: "desc" },
    });
    questionOrder = lastQuestion ? lastQuestion.order + 1 : 0;
  }

  const question = await prisma.question.create({
    data: {
      formId,
      label: label.trim(),
      description: description ?? null,
      type: questionType,
      options: savedOptions,
      required: required ?? false,
      order: questionOrder,
    },
  });

  return NextResponse.json({ question }, { status: 201 });
}

export async function PATCH(request: Request, { params }: Params) {
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

  let body: { questionIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { questionIds } = body;
  if (!Array.isArray(questionIds) || questionIds.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Question order must be a list of IDs" }, { status: 400 });
  }

  const existingQuestions = await prisma.question.findMany({
    where: { formId },
    select: { id: true },
  });
  const existingIds = new Set(existingQuestions.map((question) => question.id));
  const requestedIds = questionIds as string[];
  if (
    requestedIds.length !== existingIds.size ||
    new Set(requestedIds).size !== requestedIds.length ||
    requestedIds.some((id) => !existingIds.has(id))
  ) {
    return NextResponse.json({ error: "Question order must include every form question once" }, { status: 400 });
  }

  await prisma.$transaction(
    requestedIds.map((id, order) =>
      prisma.question.update({ where: { id }, data: { order } })
    )
  );

  return NextResponse.json({ success: true });
}
