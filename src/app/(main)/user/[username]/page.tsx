"use client";

import { PostArea } from "@/components/PostArea";
import { Button } from "@/components/ui/button";
import type { PostType } from "@/shared/types/post.type";
import type { UserFullData } from "@/shared/types/userFullData";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserFullData | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
  const [showOnlyLiked, setShowOnlyLiked] = useState<boolean>(false);
  const currentUsername = useUserStore((state) => state.user?.username);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/byUsername/${username}`);
        const data = await res.json();
        setUser(data);
        if (data?.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (username) fetchUser();
  }, [username]);

  const handleTogglePosts = async () => {
    setShowOnlyLiked((prev) => !prev);

    if (!likedPosts.length && user?.id) {
      try {
        const res = await fetch(`/api/user/byId/${user.id}/likedPosts`);
        const data = await res.json();

        const othersLikedPosts = data.filter(
          (post: PostType) => post.user.id !== user.id
        );
        setLikedPosts(othersLikedPosts);
      } catch (err) {
        console.error("Failed to fetch liked posts:", err);
      }
    }
  };

  const isCurrentUser = username === currentUsername;

  return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
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
              {user?.status || "Not status yet"}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">Posts</h3>
              <Button onClick={handleTogglePosts} disabled={!user}>
                {showOnlyLiked ? "Show all" : "Show liked"}
              </Button>
            </div>
            <PostArea
              setPosts={showOnlyLiked ? setLikedPosts : setPosts}
              posts={showOnlyLiked ? likedPosts : posts}
              showOnlyLiked={showOnlyLiked}
              isCurrentUser={isCurrentUser}
            />
          </div>
        </div>
      </div>
  );
}
