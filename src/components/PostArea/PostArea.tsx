"use client";

import type { PostType } from "@/shared/types/post.type";
import { Post } from "../Post/Post";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { PostModal } from "../PostModal";

interface Props {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  showOnlyLiked?: boolean;
  isCurrentUser?: boolean;
  isLoading: boolean;
}

export function PostArea({
  posts,
  setPosts,
  showOnlyLiked,
  isCurrentUser,
  isLoading,
}: Props) {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/likes?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setLikedPosts(data.likedPostIds || []))
      .catch(() => console.log("Smth went wrong"));
  }, [userId]);

  return (
    <div className="bg-white rounded-xl w-[520px]">
      <div
        className="shadow-inner rounded-md p-3 overflow-y-auto h-150 ring-1 ring-gray-200"
        style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
      >
        <div className="flex flex-col gap-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-xl shadow h-58 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex justify-between mt-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-10 rounded-md" />
                    <Skeleton className="h-5 w-10 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No posts</div>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                setPosts={setPosts}
                likedPosts={likedPosts}
                setLikedPosts={setLikedPosts}
                showOnlyLiked={showOnlyLiked}
                isCurrentUser={isCurrentUser}
                onOpenModal={() => setSelectedPost(post)}
              />
            ))
          )}
        </div>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={!!selectedPost}
          setPosts={setPosts}
          onOpenChange={(open) => {
            if (!open) setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}
