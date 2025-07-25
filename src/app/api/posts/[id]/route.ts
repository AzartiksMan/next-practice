import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
