"use client";

import { useEffect, useState } from "react";
import type { PostType } from "@/shared/types/post.type";
import { PostArea } from "@/components/PostArea";
import { CreatePostForm } from "@/components/CreatePostForm";

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => console.log("Smth went wrong"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mt-16 flex justify-center gap-x-10">
      <CreatePostForm setPosts={setPosts} />

      <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3">
        <h1 className="text-2xl font-bold">Discover all posts</h1>
        <PostArea posts={posts} setPosts={setPosts} isLoading={isLoading} />
      </div>
    </div>
  );
}
