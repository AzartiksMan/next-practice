"use client";

import type { PostType } from "@/shared/types/post.type";
import { Post } from "../Post/Post";
import { useEffect, useState } from "react";
import { PostModal } from "../PostModal/PostModal";
import { useUserStore } from "@/store/userStore";

interface Props {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  showOnlyLiked?: boolean;
  isCurrentUser?: boolean;
}

export function PostArea({
  posts,
  setPosts,
  showOnlyLiked,
  isCurrentUser,
}: Props) {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const userId = useUserStore((state) => state.user?.id);

  useEffect(() => {
    fetch(`/api/likes?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setLikedPosts(data.likedPostIds || []))
      .catch(() => console.log("Smth went wrong"));
  }, [userId]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.length === 0 && <div>No posts</div>}
        {posts.map((post) => {
          return (
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
          );
        })}
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
    </>
  );
}
