import type { PostType } from "@/shared/types/post.type";
import { Post } from "../Post/Post";

interface Props {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}
export function PostArea({ posts, setPosts }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.length === 0 && <div>No posts</div>}
      {posts.map((post) => (
        <Post key={post.id} post={post} setPosts={setPosts} />
      ))}
    </div>
  );
}
