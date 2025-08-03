"use client";

import { PostModal } from "../PostModal";
import { useSession } from "next-auth/react";
import { Post, PostSkeleton } from "@/components/Post";
import { usePostStore } from "@/store/postStore";

interface Props {
  showOnlyLiked?: boolean;
  isCurrentUser?: boolean;
}

export function PostArea({ showOnlyLiked, isCurrentUser }: Props) {

  const likingPostIds = usePostStore((state) => state.likingPostIds);
  const isLoading = usePostStore((state) => state.isLoading);
  const posts = usePostStore((state) => state.posts);
  const postInModal = usePostStore((state) => state.postInModal);

  const handleDelete = usePostStore((state) => state.deletePost);
  const toggleLike = usePostStore((state) => state.toggleLike);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleLikeToggle = (postId: number, isLikedByMe: boolean) => {
    if (!userId) {
      return;
    }

    toggleLike(postId, isLikedByMe, userId, {
      showOnlyLiked,
      isCurrentUser,
    });
  };

  return (
    <div className="bg-white rounded-xl w-[520px]">
      <div
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
                onDelete={handleDelete}
                onLikeToggle={handleLikeToggle}
                isLiking={likingPostIds.has(post.id)}
                session={session}
              />
            ))}
        </div>
      </div>

      {postInModal && (
        <PostModal
          session={session}
        />
      )}
    </div>
  );
}
