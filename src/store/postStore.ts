import type { PostType } from "@/shared/types/post.type";
import type { EditPostValues } from "@/shared/validators/editPostSchema";
import { create } from "zustand";

interface PostStore {
  posts: PostType[];
  setPosts: (posts: PostType[]) => void;
  isLoading: boolean;
  fetchAllPosts: (isLikesMode: boolean) => Promise<void>;
  fetchUserPosts: (isLikesMode: boolean, userId: number) => Promise<void>;
  resetFeed: () => void;

  deletePost: (postId: number) => Promise<void>;

  isProfilePage: boolean;
  setIsProfilePage: (value: boolean) => void;

  toggleLike: (
    postId: number,
    isLikedByMe: boolean,
    userId: number,
    isLikesMode?: boolean
  ) => Promise<void>;

  likingPostIds: Set<number>;

  addPost: (data: EditPostValues, userId: number) => Promise<void>;
  updatePost: (data: EditPostValues, postId: number) => Promise<void>;
  incrementCommentCount: (postId: number) => void;

  postInModal: PostType | null;
  setPostInModal: (post: PostType) => void;
  clearPostInModal: () => void;

  currentFetchPage: number;
  hasMoreFetch: boolean;
  isNextPostPageFetch: boolean;
  postFetchLimit: number;
  topPostFetchLimit: number;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  likingPostIds: new Set(),
  setPosts: (posts) => set({ posts }),
  isLoading: false,
  postInModal: null,
  isProfilePage: false,

  currentFetchPage: 0,
  hasMoreFetch: true,
  isNextPostPageFetch: false,
  postFetchLimit: 5,
  topPostFetchLimit: 10,

  resetFeed: () =>
    set({
      posts: [],
      isLoading: false,
      isNextPostPageFetch: false,
      currentFetchPage: 0,
      hasMoreFetch: true,
    }),

  fetchAllPosts: async (isLikesMode) => {
    const {
      isNextPostPageFetch,
      isLoading,
      currentFetchPage,
      hasMoreFetch,
      postFetchLimit,
      topPostFetchLimit,
      posts,
    } = get();

    if (!hasMoreFetch || isLoading || isNextPostPageFetch) {
      return;
    }

    if (currentFetchPage === 0) {
      set({ posts: [], isLoading: true });
    } else {
      set({ isNextPostPageFetch: true });
    }

    const nextPage = currentFetchPage + 1;

    const url = isLikesMode
      ? `/api/posts/top?limit=${topPostFetchLimit}`
      : `/api/posts?page=${nextPage}&limit=${postFetchLimit}`;

    try {
      const res = await fetch(url);
      const { items, hasMore } = await res.json();

      set({
        posts: nextPage === 1 ? items : [...posts, ...items],
        hasMoreFetch: hasMore,
        currentFetchPage: nextPage,
      });
    } catch {
      console.log("Smth went wrong");
    } finally {
      set({ isLoading: false, isNextPostPageFetch: false });
    }
  },

  fetchUserPosts: async (isLikesMode, userId) => {
    const {
      isNextPostPageFetch,
      isLoading,
      currentFetchPage,
      hasMoreFetch,
      postFetchLimit,
      posts,
    } = get();

    if (!hasMoreFetch || isLoading || isNextPostPageFetch) {
      return;
    }

    if (currentFetchPage === 0) {
      set({ posts: [], isLoading: true });
    } else {
      set({ isNextPostPageFetch: true });
    }

    const nextPage = currentFetchPage + 1;

    const url = isLikesMode
      ? `/api/posts/userLiked/${userId}?page=${nextPage}&limit=${postFetchLimit}`
      : `/api/posts/userPosts/${userId}?page=${nextPage}&limit=${postFetchLimit}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const { items, hasMore } = await res.json();

      set({
        posts: nextPage === 1 ? items : [...posts, ...items],
        hasMoreFetch: hasMore,
        currentFetchPage: nextPage,
      });
    } finally {
      set({ isLoading: false, isNextPostPageFetch: false });
    }
  },

  deletePost: async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  toggleLike: async (postId, isLikedByMe, userId, isLikesMode) => {
    const { likingPostIds } = get();
    if (!userId || likingPostIds.has(postId)) {
      return;
    }

    set((state) => {
      const updated = new Set(state.likingPostIds);
      updated.add(postId);
      return { likingPostIds: updated };
    });

    const method = isLikedByMe ? "DELETE" : "POST";

    try {
      const res = await fetch("/api/likes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId }),
      });

      if (!res.ok) {
        throw new Error("Like toggle failed");
      }

      set((state) => {
        const preparedData = state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  likes: post._count.likes + (isLikedByMe ? -1 : 1),
                },
                isLikedByMe: !isLikedByMe,
              }
            : post
        );

        const { isProfilePage } = get();

        const shouldRemove = isLikesMode && isLikedByMe && isProfilePage;

        const finalData = shouldRemove
          ? preparedData.filter((post) => post.id !== postId)
          : preparedData;

        return { posts: finalData };
      });
    } catch (error) {
      console.error(error);
    } finally {
      set((state) => {
        const updated = new Set(state.likingPostIds);
        updated.delete(postId);
        return { likingPostIds: updated };
      });
    }
  },

  addPost: async (data, userId) => {
    const { posts } = get();

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "Network error. Please try again.");
      }

      const newPost: PostType = await res.json();
      set({ posts: [newPost, ...posts] });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Network error. Please try again.");
    }
  },

  updatePost: async (data, postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      const updatedPost = await res.json();
      console.log("Client received post:", updatedPost);

      set((state) => {
        const prevData = state.posts;

        const finalData = prevData.map((post) =>
          post.id === postId ? { ...post, ...updatedPost } : post
        );

        return { posts: finalData };
      });
    } catch {
      throw new Error("Update failed");
    }
  },

  incrementCommentCount: (postId) => {
    set((state) => {
      const currentData = state.posts;

      const updatedData = currentData.map((post) =>
        post.id === postId
          ? {
              ...post,
              _count: { ...post._count, comments: post._count.comments + 1 },
            }
          : post
      );

      return { posts: updatedData };
    });
  },

  clearPostInModal: () => set({ postInModal: null }),

  setPostInModal: (post) => set({ postInModal: post }),

  setIsProfilePage: (value) => set({ isProfilePage: value }),
}));
