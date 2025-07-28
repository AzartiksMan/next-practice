export interface PostType {
  id: number;
  title: string;
  text: string;
  userId: number;
  createdAt: string;

  _count: {
    comments: number;
    likes: number;
  };

  user: {
    id: number;
    username: string;
    email: string;
  };
}
