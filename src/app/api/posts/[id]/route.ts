import { prisma } from "@/lib/prisma";
import { editPostSchema } from "@/shared/validators/editPostSchema";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Id is required" }, { status: 400 });
  }

  try {
    await prisma.post.delete({
      where: { id: +id },
    });

    return NextResponse.json({ message: "Suc deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Smth went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Id is required" }, { status: 400 });
  }

  const body = await request.json();
  const result = editPostSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: +id },
      data: {
        title: result.data.title,
        text: result.data.text,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
