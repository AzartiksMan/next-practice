import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isProfilePage = pathname.startsWith("/profile");
  const isLoggedIn = !!token;

  if (!isLoggedIn && isProfilePage) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/auth"],
};
