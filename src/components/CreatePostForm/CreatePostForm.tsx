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
import {
  editPostSchema,
  type EditPostValues,
} from "@/shared/validators/editPostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePostStore } from "@/store/postStore";
import type React from "react";

interface Props {
  userId: number;
}

export const CreatePostForm: React.FC<Props> = ({ userId }) => {
  const addPost = usePostStore((state) => state.addPost);

  const form = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  });

  const onSubmit = async (data: EditPostValues) => {
    if (!userId) {
      return;
    }

    try {
      await addPost(data, userId);
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      form.setError("root", {
        type: "server",
        message,
      });
    }
  };
  
  return (
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
  );
};
