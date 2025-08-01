import { prisma } from "@/lib/prisma";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const username = params.username;
    const shouldDeleteAvatar = formData.get("delete") === "true";

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let image = existingUser.image;
    let imagePublicId = existingUser.imagePublicId;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                transformation: [
                  { width: 300, height: 300, crop: "fill", gravity: "face" },
                ],
              },
              (err, result) => {
                if (err || !result)
                  return reject(err || new Error("No result from Cloudinary"));
                resolve(result);
              }
            )
            .end(buffer);
        }
      );

      if (existingUser.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingUser.imagePublicId);
        } catch (err) {
          console.warn("Prev avatar error:", err);
        }
      }

      image = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    if (shouldDeleteAvatar && existingUser.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existingUser.imagePublicId);
        image = null;
        imagePublicId = null;
      } catch (err) {
        console.warn("Avatar del error:", err);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        image,
        imagePublicId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        imagePublicId: true,
        status: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("PATCH error /user/byUsername:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
