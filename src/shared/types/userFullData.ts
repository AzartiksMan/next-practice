import type { PostType } from "./post.type";

export interface UserFullData {
  id: number;
  username: string;
  email: string;
  status?: string;
  posts: PostType[];
}
