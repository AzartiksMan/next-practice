"use client";

import { PostArea } from "@/components/PostArea";
import type { PostType } from "@/shared/types/post.type";
import type { UserFullData } from "@/shared/types/userFullData";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserFullData | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
  const [showOnlyLiked, setShowOnlyLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const currentUsername = session?.user?.username;

  useEffect(() => {
    setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);

  const handleTogglePosts = async () => {
    setShowOnlyLiked((prev) => !prev);

    if (!likedPosts.length && user?.id) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user/byId/${user.id}/likedPosts`);
        const data = await res.json();

        const othersLikedPosts = data.filter(
          (post: PostType) => post.user.id !== user.id
        );
        setLikedPosts(othersLikedPosts);
      } catch (err) {
        console.error("Failed to fetch liked posts:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isCurrentUser = username === currentUsername;

  return (
    <div className="mt-16 flex justify-center gap-x-10">
      <div className="bg-white shadow-lg rounded-xl p-6 self-start ">
        <div className="flex items-center gap-4">
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

      <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3">
        <div className="flex bg-gray-100 rounded-md p-1 w-full text-sm font-medium">
          <div
            onClick={() => {
              if (showOnlyLiked) handleTogglePosts();
            }}
            className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
              !showOnlyLiked
                ? "bg-white text-black rounded-l-md shadow"
                : "text-gray-500"
            }`}
          >
            User posts
          </div>
          <div
            onClick={() => {
              if (!showOnlyLiked) handleTogglePosts();
            }}
            className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
              showOnlyLiked
                ? "bg-white text-black rounded-r-md shadow"
                : "text-gray-500"
            }`}
          >
            Liked posts
          </div>
        </div>
        <PostArea
          setPosts={showOnlyLiked ? setLikedPosts : setPosts}
          posts={showOnlyLiked ? likedPosts : posts}
          showOnlyLiked={showOnlyLiked}
          isCurrentUser={isCurrentUser}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
