import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
        likes: {
          select: { userId: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    const postsWithLikeStatus = userPosts.map(({ likes, ...rest }) => ({
      ...rest,
      isLikedByMe: likes.some((like) => like.userId === currentUserId),
    }));

    return NextResponse.json(postsWithLikeStatus);
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
