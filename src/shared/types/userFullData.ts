export interface UserFullData {
  id: number;
  username: string;
  email: string;
  status?: string | null;
  image?: string | null;
  imagePublicId?: string | null;
}
