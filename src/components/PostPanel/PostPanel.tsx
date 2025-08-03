import Image from "next/image";
import type React from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  editPostSchema,
  type EditPostValues,
} from "@/shared/validators/editPostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostStore } from "@/store/postStore";
import { useState } from "react";

interface Props {
  canEdit: boolean;
}

export const PostPanel: React.FC<Props> = ({ canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const updatePost = usePostStore((state) => state.updatePost);
  const postInModal = usePostStore((state) => state.postInModal);

  const form = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: postInModal?.title,
      text: postInModal?.text,
    },
  });

  const handleUpdate = async (data: EditPostValues) => {
    if (!postInModal) {
      return;
    }

    try {
      await updatePost(data, postInModal.id);

      form.reset(data);
      setIsEditing(false);
    } catch (err) {
      console.error("Post update error:", err);
    }
  };

  if (!postInModal) {
    return null;
  }

  return (
    <div className="w-[450px] bg-white p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={postInModal.user.image ?? "/placeholder-avatar.png"}
          alt="Avatar"
          width={50}
          height={50}
          className="rounded-full border"
        />
        <div>
          <p className="font-semibold">@{postInModal.user.username}</p>
          <p className="text-sm text-gray-500">
            {new Date(postInModal.createdAt).toLocaleString()}
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
          <h2 className="text-xl font-bold mb-2">{form.getValues("title")}</h2>
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
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
  );
};
