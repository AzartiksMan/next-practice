import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();

  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    const users = await prisma.user.findMany({
      where: {
        ...(currentUserId && {
          id: { not: currentUserId },
        }),
        ...(search && {
          username: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      select: {
        id: true,
        username: true,
        status: true,
        image: true,
      },
      orderBy: {
        username: "asc",
      },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
