import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      include: {
        user: true,
        likes: { select: { userId: true } },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLikedByMe: currentUserId
        ? post.likes.some((like) => like.userId === currentUserId)
        : false,
      likes: undefined,
    }));

    return NextResponse.json(postsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
