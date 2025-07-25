import { PAGES } from "@/app/config/pages.config";
import type { PostType } from "@/shared/types/post.type";
import Link from "next/link";

interface Props {
  post: PostType;
  setError: (value: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

export function Post({ post, setError, setPosts }: Props) {
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      setError("Failed to delete");
      console.error(error);
    }
  };

  return (
    <div
      className="
        flex justify-between
        border border-gray-300
        rounded-lg
        my-2 py-2 px-2
        "
    >
      <div className="flex flex-col">
        <h2 className="font-bold text-lg">{post.title}</h2>
        <p className="text-gray-700 mb-1">{post.text}</p>
        <p className="text-sm text-gray-500">
          Posted by:{" "}
          <Link href={PAGES.USER(post.user.username)}>
            {post.user.username}
          </Link>
        </p>
        <p className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => handleDelete(post.id)}
        className="h-5 w-5"
      >
        X
      </button>
    </div>
  );
}
