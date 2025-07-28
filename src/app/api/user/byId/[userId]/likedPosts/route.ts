import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: Number(userId),
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return NextResponse.json(likedPosts);
  } catch (error) {
    console.error("Failed to fetch liked posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}