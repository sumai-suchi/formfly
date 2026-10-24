import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestionType } from "@/generated/prisma/client";

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
      options: options ?? null,
      required: required ?? false,
      order: questionOrder,
    },
  });

  return NextResponse.json({ question }, { status: 201 });
}
