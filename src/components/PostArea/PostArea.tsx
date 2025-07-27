"use client";

import type { PostType } from "@/shared/types/post.type";
import { Post } from "../Post/Post";
import { useState } from "react";
import { PostModal } from "../PostModal/PostModal";

interface Props {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}
export function PostArea({ posts, setPosts }: Props) {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.length === 0 && <div>No posts</div>}
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="cursor-pointer"
          >
            <Post post={post} setPosts={setPosts} />
          </div>
        ))}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={!!selectedPost}
          onOpenChange={(open) => {
            if (!open) setSelectedPost(null);
          }}
        />
      )}
    </>
  );
}
