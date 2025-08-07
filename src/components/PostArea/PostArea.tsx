"use client";

import { PostModal } from "../PostModal";
import { useSession } from "next-auth/react";
import { Post, PostSkeleton } from "@/components/Post";
import { usePostStore } from "@/store/postStore";
import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  userId?: number;
  showOnlyLiked: boolean;
}

export function PostArea({ userId, showOnlyLiked }: Props) {
  const isLoading = usePostStore((state) => state.isLoading);
  const posts = usePostStore((state) => state.posts);
  const postInModal = usePostStore((state) => state.postInModal);
  const toggleLike = usePostStore((state) => state.toggleLike);
  const fetchAllPosts = usePostStore((state) => state.fetchAllPosts);
  const fetchUserPosts = usePostStore((state) => state.fetchUserPosts);

  const isNextPostPageFetch = usePostStore(
    (state) => state.isNextPostPageFetch
  );

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleLikeToggle = useCallback(
    (postId: number, isLikedByMe: boolean) => {
      if (!currentUserId) {
        toast.error("You must be logged in to like posts.");
        return;
      }
      toggleLike(postId, isLikedByMe, currentUserId, showOnlyLiked);
    },
    [currentUserId, toggleLike, showOnlyLiked]
  );

  const scrollHandler = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 150;

    const fetchMode = userId
      ? () => fetchUserPosts(showOnlyLiked, userId)
      : () => fetchAllPosts(showOnlyLiked);

    if (nearBottom) {
      fetchMode();
    }
  }, [fetchAllPosts, fetchUserPosts, showOnlyLiked, userId]);

  useEffect(() => {
    const postArea = scrollRef.current;
    if (!postArea) return;

    postArea.addEventListener("scroll", scrollHandler);

    return () => postArea.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  return (
    <div className="bg-white rounded-xl w-[520px]">
      <div
        ref={scrollRef}
        className="shadow-inner rounded-md p-3 overflow-y-auto h-150 ring-1 ring-gray-200"
        style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
      >
        <div className="flex flex-col gap-4">
          {isLoading && [...Array(3)].map((_, i) => <PostSkeleton key={i} />)}

          {!isLoading && !posts.length && (
            <div className="text-center text-gray-500 py-4">No posts</div>
          )}

          {!isLoading &&
            !!posts.length &&
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
                session={session}
              />
            ))}

          {isNextPostPageFetch && <PostSkeleton />}
        </div>
      </div>

      {postInModal && <PostModal session={session} />}
    </div>
  );
}
