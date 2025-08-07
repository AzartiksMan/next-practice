import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    const { title, text } = await request.json();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!title || !text) {
      return NextResponse.json(
        { error: "Title and text are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        text,
        userId: currentUserId,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true, image: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return NextResponse.json(
      {
        ...post,
        isLikedByMe: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);
  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      skip,
      take: limit + 1,
      orderBy: { id: "desc" },
      include: {
        user: { select: { id: true, username: true, image: true } },
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { userId: true },
            }
          : false,
        _count: { select: { comments: true, likes: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;

    const postsWithLikeStatus = items.map((post) => ({
      ...post,
      isLikedByMe: currentUserId ? post.likes.length > 0 : false,
    }));

    return NextResponse.json({ items: postsWithLikeStatus, hasMore });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
