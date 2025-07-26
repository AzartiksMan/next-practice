import { PAGES } from "@/app/config/pages.config";
import type { PostType } from "@/shared/types/post.type";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

interface Props {
  post: PostType;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

export function Post({ post, setPosts }: Props) {
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-70 rounded-xl overflow-hidden shadow-lg bg-[#c2d9dd]">
      <div className="bg-[#00acee] h-24 relative">
        <Image
          src="/placeholder-avatar.png"
          alt="Avatar"
          width={80}
          height={80}
          className="absolute -bottom-10 left-4 rounded-full object-cover shadow-sm border-4 border-white"
        />
        <Button
          type="button"
          className="absolute right-4 bottom-[-16px] bg-black text-white text-sm font-semibold px-4 py-1 rounded-full"
          onClick={() => handleDelete(post.id)}
        >
          Delete
        </Button>
      </div>

      <div className="pt-12 px-4 pb-4 bg-white rounded-b-xl">
        <div className="flex items-center gap-1">
          <Link href={PAGES.USER(post.user.username)}>
            <h2 className="font-bold text-lg">{post.user.username}</h2>
          </Link>
        </div>
        <p className="text-gray-500">{post.user.email}</p>

        <p className="mt-2 text-sm text-gray-700 leading-snug">{post.text}</p>

        <div className="flex gap-4 mt-3 text-sm font-medium text-gray-600">
          <div>
            <span className="text-black">0</span> Likes
          </div>
          <div>
            <span className="text-black">0</span> Comments
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
