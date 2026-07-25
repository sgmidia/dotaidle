import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const save = await prisma.gameSave.findUnique({
    where: { userId: session.user.id },
    select: { stateJson: true, updatedAt: true },
  });

  return NextResponse.json({ save: save ?? null });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("state" in body)) {
    return NextResponse.json({ error: "Corpo inválido — esperado { state }." }, { status: 400 });
  }

  const save = await prisma.gameSave.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, stateJson: body.state },
    update: { stateJson: body.state },
    select: { updatedAt: true },
  });

  return NextResponse.json({ ok: true, updatedAt: save.updatedAt });
}
