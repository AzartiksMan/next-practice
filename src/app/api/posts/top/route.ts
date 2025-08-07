import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const limit = Number(searchParams.get("limit") || 10);

  try {
    const posts = await prisma.post.findMany({
      take: limit,
      orderBy: [{ likes: { _count: "desc" } }, { id: "desc" }],
      include: {
        user: true,
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { userId: true },
            }
          : false,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const hasMore = false;

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLikedByMe: currentUserId ? post.likes.length > 0 : false,
    }));

    return NextResponse.json({ items: postsWithLikeStatus, hasMore });
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
