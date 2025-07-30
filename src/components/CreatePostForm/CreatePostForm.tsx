"use client";

import type { PostType } from "@/shared/types/post.type";
import {
  editPostSchema,
  type EditPostValues,
} from "@/shared/validators/editPostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";

interface Props {
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

export const CreatePostForm: React.FC<Props> = ({ setPosts }) => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const form = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  });

  const onSubmit = async (data: EditPostValues) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (res.status === 201) {
        const newPost: PostType = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        form.reset();
      } else {
        const err = await res.json();
        form.setError("root", {
          type: "server",
          message: err?.error || "Unexpected server error",
        });
      }
    } catch {
      form.setError("root", {
        type: "network",
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col w-80 bg-white rounded-xl p-6 shadow-md self-start">
      <h2 className="text-xl font-semibold mb-4">What&apos;s on your mind?</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-5"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
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
                    placeholder="Text"
                    className="resize-none min-h-20 max-h-126 overflow-auto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-red-600 text-sm">
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving" : "Add post"}
            </Button>
            <Button
              type="button"
              disabled={form.formState.isSubmitting}
              onClick={() => form.reset()}
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
