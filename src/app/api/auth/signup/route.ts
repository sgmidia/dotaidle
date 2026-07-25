import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
  const password = typeof body?.password === "string" ? body.password : null;

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email válido e senha com pelo menos 8 caracteres são obrigatórios." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Este email já está cadastrado." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      pvpProfile: { create: {} },
    },
    select: { id: true, email: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
