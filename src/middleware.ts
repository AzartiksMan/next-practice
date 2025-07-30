import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: ["/((?!auth|favicon.ico|_next|api).*)"],
};
