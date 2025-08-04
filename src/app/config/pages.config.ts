export const PAGES = {
  HOME: "/",
  POSTS: "/posts",
  USERS: "/users",
  ABOUT: "/about",
  AUTH: "/auth",
  PROFILE: "/profile",
  USER: (username: string) => `/user/${username}`,
};
