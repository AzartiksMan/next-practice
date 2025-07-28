"use client";

import { PAGES } from "@/app/config/pages.config";
import type { PostType } from "@/shared/types/post.type";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { ADMIN_USERS } from "@/app/config/constants";

interface Props {
  post: PostType;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  likedPosts: number[];
  setLikedPosts: React.Dispatch<React.SetStateAction<number[]>>;
  showOnlyLiked?: boolean;
  isCurrentUser?: boolean;
  onOpenModal: () => void;
}

export function Post({
  post,
  setPosts,
  likedPosts,
  setLikedPosts,
  showOnlyLiked = false,
  isCurrentUser = false,
  onOpenModal,
}: Props) {
  const isLikedByMe = likedPosts.includes(post.id);
  const [isLiking, setIsLiking] = useState(false);

  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const userName = user?.username;
  const isAdmin = ADMIN_USERS.includes(userName ?? "");

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

  const handleLikeToggle = async () => {
    if (!userId || isLiking) return;

    setIsLiking(true);

    const method = isLikedByMe ? "DELETE" : "POST";

    try {
      const res = await fetch("/api/likes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId: post.id }),
      });

      if (!res.ok) throw new Error("Like toggle failed");

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                _count: {
                  ...p._count,
                  likes: p._count.likes + (isLikedByMe ? -1 : 1),
                },
              }
            : p
        )
      );

      setLikedPosts((prev) =>
        isLikedByMe ? prev.filter((id) => id !== post.id) : [...prev, post.id]
      );

      if (showOnlyLiked && isLikedByMe && isCurrentUser) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLiking(false);
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
        <div className="absolute right-4 bottom-0 translate-y-1">
          <Link href={PAGES.USER(post.user.username)}>
            <h2 className="font-bold text-2xl text-black hover:underline leading-tight">
              @{post.user.username}
            </h2>
          </Link>
        </div>
      </div>

      <div className="pt-12 px-4 pb-4 bg-white rounded-b-xl">
        <h2 className="font-bold text-2xl">{post.title}</h2>

        <div className="h-20 overflow-hidden pt-2">
          <p className="text-sm text-gray-700 leading-snug line-clamp-3">
            {post.text}
          </p>
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex gap-4 text-sm font-medium text-gray-600">
            <div
              className={`flex items-center gap-1 cursor-pointer ${
                isLiking ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={handleLikeToggle}
            >
              <span className="text-black">{post._count.likes}</span>
              <Heart
                className={`w-4 h-4 transition-all cursor-pointer duration-200 ${
                  isLikedByMe
                    ? "fill-red-500 text-red-500 scale-110"
                    : "scale-100"
                }`}
              />
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => onOpenModal()}
            >
              <span className="text-black">{post._count.comments}</span>
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => onOpenModal()}
          >
            View details
          </Button>

          {(isAdmin || userId === post.user.id) && (
            <Button
              type="button"
              className="cursor-pointer"
              onClick={() => handleDelete(post.id)}
            >
              Delete
            </Button>
          )}
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
