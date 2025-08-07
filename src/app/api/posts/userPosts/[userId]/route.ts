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

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);
  const skip = (page - 1) * limit;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userId: Number(userId),
      },
      skip,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { userId: true },
            }
          : false,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    const hasMore = userPosts.length > limit;
    const items = hasMore ? userPosts.slice(0, -1) : userPosts;

    const postsWithLikeStatus = items.map((post) => ({
      ...post,
      isLikedByMe: currentUserId ? post.likes.length > 0 : false,
    }));

    return NextResponse.json({ items: postsWithLikeStatus, hasMore });
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
