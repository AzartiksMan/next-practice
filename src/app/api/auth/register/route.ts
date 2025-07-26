import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, email, password, status } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Username, email and password are required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Username or email already taken" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
      status: status ?? null,
    },
  });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    status: user.status,
  });
}
