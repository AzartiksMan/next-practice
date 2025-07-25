import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hash },
  });

  return NextResponse.json({ id: user.id, username: user.username });
}
