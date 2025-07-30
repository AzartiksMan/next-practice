"use client";

import Image from "next/image";
import type { PostType } from "@/shared/types/post.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { editPostSchema } from "@/shared/validators/editPostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { ADMIN_USERS } from "@/app/config/constants";

type Comment = {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
};

export function PostModal({
  post,
  open,
  onOpenChange,
  setPosts,
}: {
  post: PostType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const userId = useUserStore((state) => state.user?.id);

  const [isEditing, setIsEditing] = useState(false);
  const userName = useUserStore((state) => state.user?.username);
  const isAdmin = ADMIN_USERS.includes(userName ?? "");
  const canEdit = isAdmin || userId === post.user.id;

  useEffect(() => {
    if (!open || !post?.id) {
      return;
    }
    setLoading(true);
    fetch(`/api/posts/${post.id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load comments");
        setLoading(false);
      });
  }, [open, post?.id]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !userId) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          text: newComment,
          postId: post.id,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setComments((prev) => [data, ...prev]);
      setNewComment("");
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                _count: {
                  ...p._count,
                  comments: p._count.comments + 1,
                },
              }
            : p
        )
      );
    } catch (err) {
      console.error("Ошибка отправки комментария:", err);
    }
  };

  const handleUpdate = async (values: z.infer<typeof editPostSchema>) => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, ...updated } : p))
      );

      form.reset(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка обновления поста:", err);
    }
  };

  const form = useForm<z.infer<typeof editPostSchema>>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      text: post.text,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px]">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {form.getValues("title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-[500px] gap-x-10 p-2">
          <div className="w-[450px] bg-white p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/placeholder-avatar.png"
                alt="Avatar"
                width={50}
                height={50}
                className="rounded-full border"
              />
              <div>
                <p className="font-semibold">@{post.user.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {canEdit && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Post
              </Button>
            )}
            {!isEditing && (
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {form.getValues("title")}
                </h2>
                <div className="overflow-y-auto h-[300px]">
                  <p className="text-gray-700 whitespace-pre-line">
                    {form.getValues("text")}
                  </p>
                </div>
              </div>
            )}

            {!!isEditing && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Post title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Post content..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={form.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>

          <div className="w-[550px] max-w-[650px] bg-white p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Comments</h3>
              </div>
              <div
                className="space-y-3 text-sm text-gray-800 shadow-inner rounded-md p-3 bg-gray-50 h-80 overflow-y-auto"
                style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
              >
                {loading && <p>Loading comments...</p>}
                {!loading && error && (
                  <p className="text-red-600 text-6xl">Error</p>
                )}
                {!loading && !error && !comments.length && (
                  <p className="text-2x1">No posts</p>
                )}
                {!loading &&
                  !error &&
                  !!comments.length &&
                  comments.map((comment) => {
                    return (
                      <div
                        key={comment.id}
                        className="bg-white p-3 rounded-2xl shadow flex gap-x-5"
                      >
                        <Image
                          src="/placeholder-avatar.png"
                          alt="Avatar"
                          width={50}
                          height={50}
                          className="rounded-full border"
                        />
                        <div className="w-full flex flex-col gap-y-1">
                          <div className="flex justify-between">
                            <h2>{comment.user.username}</h2>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex gap-2 w-118">
              <Textarea
                placeholder="Type your comment"
                className=" h-10 resize-none overflow-y-auto"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                type="submit"
                className="w-6 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                title="Send"
                aria-label="Send comment"
                onClick={handleSubmit}
                disabled={!newComment.trim()}
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
