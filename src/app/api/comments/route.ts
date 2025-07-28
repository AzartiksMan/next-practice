import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, postId, userId } = await req.json();

    if (!text || !postId || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postId: Number(postId),
        userId: Number(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}