import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ publicId: string }>;
}

interface SubmittedAnswer {
  questionId: string;
  value: string;
}

function parseOptions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const options: unknown = JSON.parse(raw);
    return Array.isArray(options) ? options.filter((option): option is string => typeof option === "string") : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request, { params }: Params) {
  const { publicId } = await params;
  const form = await prisma.form.findFirst({
    where: { publicId, status: "PUBLISHED" },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!form) {
    return NextResponse.json({ error: "This form is not available" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as { answers?: unknown }).answers)) {
    return NextResponse.json({ error: "Answers are required" }, { status: 400 });
  }

  const submittedAnswers = (body as { answers: unknown[] }).answers;
  if (submittedAnswers.some((answer) =>
    !answer || typeof answer !== "object" ||
    typeof (answer as Partial<SubmittedAnswer>).questionId !== "string" ||
    typeof (answer as Partial<SubmittedAnswer>).value !== "string"
  )) {
    return NextResponse.json({ error: "Each answer must include a question and a text value" }, { status: 400 });
  }

  const answers = submittedAnswers as SubmittedAnswer[];
  const answerMap = new Map<string, string>();
  for (const answer of answers) {
    if (answer.value.length > 10000) {
      return NextResponse.json({ error: "Answers must be 10,000 characters or fewer" }, { status: 400 });
    }
    if (answerMap.has(answer.questionId)) {
      return NextResponse.json({ error: "A question can only have one answer" }, { status: 400 });
    }
    answerMap.set(answer.questionId, answer.value.trim());
  }

  const questionById = new Map(form.questions.map((question) => [question.id, question]));
  for (const [questionId, value] of answerMap) {
    const question = questionById.get(questionId);
    if (!question) {
      return NextResponse.json({ error: "An answer refers to an invalid question" }, { status: 400 });
    }
    if (question.required && !value) {
      return NextResponse.json({ error: `Please answer “${question.label}”` }, { status: 400 });
    }
    if (question.type === "YES_NO" && value && value !== "Yes" && value !== "No") {
      return NextResponse.json({ error: `Choose Yes or No for “${question.label}”` }, { status: 400 });
    }
    if (question.type === "EMAIL" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return NextResponse.json({ error: `Enter a valid email for “${question.label}”` }, { status: 400 });
    }
    if (question.type === "MULTIPLE_CHOICE" && value && !parseOptions(question.options).includes(value)) {
      return NextResponse.json({ error: `Choose a valid option for “${question.label}”` }, { status: 400 });
    }
  }

  const missingRequiredQuestion = form.questions.find(
    (question) => question.required && !answerMap.get(question.id)
  );
  if (missingRequiredQuestion) {
    return NextResponse.json({ error: `Please answer “${missingRequiredQuestion.label}”` }, { status: 400 });
  }

  const submission = await prisma.submission.create({
    data: {
      formId: form.id,
      answers: {
        create: [...answerMap.entries()].map(([questionId, value]) => ({ questionId, value })),
      },
    },
    select: { id: true, submittedAt: true },
  });

  return NextResponse.json({ submission }, { status: 201 });
}
