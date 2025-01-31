"use client";

import type { ZodType } from "zod";
import { z } from "zod";

import type { Insertable } from "@inf/db/helpers";
import type { posts } from "@inf/db/types";
import { Button } from "@inf/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@inf/ui/form";
import { Input } from "@inf/ui/input";
import { toast } from "@inf/ui/toast";

import { api } from "~/trpc/react";

export function CreatePostForm() {

  // Validation schema
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters long" })
      .max(100, { message: "Title cannot exceed 100 characters" }),
    content: z
      .string()
      .min(10, { message: "Content must be at least 10 characters long" })
      .max(1000, { message: "Content cannot exceed 1000 characters" }),
    author_id: z.string().min(1, { message: "Author ID is required" }),
  }) satisfies ZodType<Insertable<posts>>;

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      content: "",
      title: "",
      author_id: "",
    },
  });

  const utils = api.useUtils();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.post.invalidate();
      toast.success("Post created successfully!");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to create a post"
          : "Failed to create post",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        data-testid="post-form"
        className="flex w-full max-w-2xl flex-col gap-4"
        action={"/"}
        onSubmit={form.handleSubmit((data) => {
          createPost.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Enter a Title..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Share your thoughts here..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Author ID Field */}
        <FormField
          control={form.control}
          name="author_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Enter your author ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}