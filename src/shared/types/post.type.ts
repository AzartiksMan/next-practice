export interface PostType {
  id: number;
  title: string;
  text: string;
  userId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}
