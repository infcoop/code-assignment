"use client";

import type { ZodType } from "zod";
import { z } from "zod";

import type { RouterOutputs } from "@inf/api";
import type { Insertable } from "@inf/db/helpers";
import type { posts } from "@inf/db/types";
import { cn } from "@inf/ui";
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
import { useMemo, useState } from "react"

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
                <Input {...field} placeholder="Share your thoughts here.." />
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

export function PostList() {
  // Destructure isFetching
  const { data: posts = [], isFetching } = api.post.all.useQuery();

  // Memoize posts to avoid unnecessary recalculations
  const memoizedPosts = useMemo(() => posts, [posts]);

  if (isFetching) {
    return (
      <div className="flex w-full flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} pulse />
        ))}
      </div>
    );
  }


  if (memoizedPosts.length === 0) {
    return (
      <div className="relative flex min-h-16 w-full flex-col gap-4">
        {!isFetching && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-stone-500/[0.5]">
              No posts yet
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {memoizedPosts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete a post"
          : "Failed to delete post",
      );
    },
  });

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-black"
          onClick={() => deletePost.mutate({ id: props.post.id })}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-stone-500/[0.2] text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-stone-500/[0.2] text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}