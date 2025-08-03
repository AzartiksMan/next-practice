import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, postId } = await req.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "Missing userId or postId" },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("Failed to like:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, postId } = await req.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "Missing userId or postId" },
        { status: 400 }
      );
    }

    await prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to unlike:", error);
    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 }
    );
  }
}
