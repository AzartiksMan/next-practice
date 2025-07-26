"use client";

import { Post } from "@/components/Post";
import type { PostType } from "@/shared/types/post.type";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">

        <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-1/3">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/placeholder-avatar.png"
              alt="Avatar"
              width={90}
              height={90}
              className="rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.username}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2 px-2 py-2 rounded-md bg-gray-100 text-sm text-gray-700">
            <span className="font-medium text-gray-600">Status:</span>{" "}
            {user?.status || 'Not status yet'}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-2/3">
          <h3 className="text-xl font-semibold mb-4">Posts</h3>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Post key={post.id} post={post} setPosts={setPosts} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
