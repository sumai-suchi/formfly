import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description } = body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const publicId =
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10);

  const form = await prisma.form.create({
    data: {
      ownerId: user.id,
      title: title.trim(),
      description: description?.trim() ?? null,
      publicId,
      status: "DRAFT",
    },
    select: {
      id: true,
      publicId: true,
      title: true,
    },
  });

  return NextResponse.json({ form }, { status: 201 });
}
