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

export async function GET() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, image: true } },
        likes: {
          select: { userId: true },
        },
        _count: { select: { comments: true, likes: true } },
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
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
