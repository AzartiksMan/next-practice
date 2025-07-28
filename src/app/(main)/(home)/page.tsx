"use client";

import { useEffect, useState } from "react";
import { Form } from "@/components/Form";
import type { PostType } from "@/shared/types/post.type";
import { useUserStore } from "@/store/userStore";
import { PostArea } from "@/components/PostArea";
import { EmojiRain } from "@/components/EmojiRain";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<PostType[]>([]);

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setError("Smth went wrong"))
  }, []);


  console.log(posts)
  return (
    <div className="mt-10 flex items-center justify-center">
      <EmojiRain />

      <div
        className="
          inline-flex
          gap-x-10
          border border-gray-300
          rounded-lg
          p-3
          bg-white
          "
      >
        <div>
          <div>
            <div className="mb-3 flex items-center gap-4">
              <span className="text-gray-700">
                Вы вошли как <b>{user!.username}</b>
              </span>
              <button
                className="bg-red-200 text-red-700 rounded px-2 py-1 text-xs"
                onClick={logout}
              >
                Выйти
              </button>
            </div>
            <Form
              userId={user!.id}
              loading={loading}
              error={error}
              setLoading={setLoading}
              setError={setError}
              setPosts={setPosts}
            />
          </div>
        </div>

        <PostArea posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
}
