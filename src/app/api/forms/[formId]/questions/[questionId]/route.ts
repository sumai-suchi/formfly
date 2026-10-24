import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestionType } from "@/generated/prisma/client";

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
  const questionType: QuestionType | undefined =
    type && validTypes.includes(type as QuestionType)
      ? (type as QuestionType)
      : undefined;

  const question = await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(label !== undefined && { label: label.trim() }),
      ...(description !== undefined && { description }),
      ...(questionType !== undefined && { type: questionType }),
      ...(options !== undefined && { options }),
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

  await prisma.question.delete({ where: { id: questionId } });

  return NextResponse.json({ success: true });
}
