import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      image?: string;
      imagePublicId?: string;
      role: string;
    };
  }

  interface User {
    id: number;
    username: string;
    email: string;
    image?: string;
    imagePublicId?: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    email: string;
    image?: string;
    imagePublicId?: string;
    role: string;
  }
}
