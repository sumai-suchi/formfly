import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, welcomeMessage, completionMessage, primaryColor } = body;

  const form = await prisma.form.update({
    where: { id: formId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(welcomeMessage !== undefined && { welcomeMessage }),
      ...(completionMessage !== undefined && { completionMessage }),
      ...(primaryColor !== undefined && { primaryColor }),
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json({ form });
}
