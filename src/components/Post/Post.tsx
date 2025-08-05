"use client";

import { PAGES } from "@/app/config/pages.config";
import type { PostType } from "@/shared/types/post.type";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { getTimeAgo } from "@/utils/getTimeAgo";
import type { Session } from "next-auth";
import { usePostStore } from "@/store/postStore";

interface Props {
  post: PostType;
  onLikeToggle: (postId: number, isLikedByMe: boolean) => void;
  session?: Session | null;
}

export function Post({ post, onLikeToggle, session }: Props) {
  const isLikedByMe = post.isLikedByMe;

  const likingPostIds = usePostStore((state) => state.likingPostIds);
  const isLiking = likingPostIds.has(post.id);

  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";
  const setPostInModal = usePostStore((state) => state.setPostInModal);
  const handleDelete = usePostStore((state) => state.deletePost);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-[#c2d9dd]">
      <div className="bg-[#00acee] h-16 relative">
        <Image
          src={post.user.image || "/placeholder-avatar.png"}
          alt="Avatar"
          width={80}
          height={80}
          className="absolute -bottom-10 left-4 rounded-full object-cover shadow-sm border-4 border-white bg-white"
        />
        <div className="absolute left-28 bottom-0 translate-y-1">
          <Link href={PAGES.USER(post.user.username)}>
            <h2 className="font-bold text-2xl text-black hover:underline leading-tight">
              {post.user.username}
            </h2>
          </Link>
        </div>
        <div className="absolute right-2 bottom-0 translate-y-1">
          <p className="font-bold">{getTimeAgo(post.createdAt)}</p>
        </div>
      </div>

      <div className="pt-12 px-4 pb-4 bg-white rounded-b-xl">
        <h2 className="font-bold text-2xl">{post.title}</h2>

        <div className="pt-2">
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
              onClick={() => onLikeToggle(post.id, isLikedByMe)}
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
              onClick={() => setPostInModal(post)}
            >
              <span className="text-black">{post._count.comments}</span>
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex gap-x-4">
            {(isAdmin || userId === post.user.id) && (
              <Button
                type="button"
                className="cursor-pointer"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              className="cursor-pointer"
              onClick={() => setPostInModal(post)}
            >
              View details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
