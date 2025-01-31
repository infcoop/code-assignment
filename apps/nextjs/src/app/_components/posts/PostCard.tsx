"use client";

import type { RouterOutputs } from "@inf/api";
import { Button } from "@inf/ui/button";
import { toast } from "@inf/ui/toast";

import { api } from "~/trpc/react";
import { useState, memo } from "react"
import { EditablePostTitle } from "./EditablePostTitle";

export const PostCard = memo(function PostCard(props: { post: RouterOutputs["post"]["all"][number] }) {
  const { content, author_id, id } = props.post;
  const utils = api.useUtils();
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.all.invalidate();
      await utils.post.byId.invalidate({ id });
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("You must be logged in to delete a post");
      } else if (err.data?.code === "NOT_FOUND") {
        toast.error("Post not found or already deleted");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.byId.invalidate({ id });
      toast.success("Post updated successfully!");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to update this post"
          : "Failed to update post"
      );
    },
  });

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    setIsDeleting(true);
    await deletePost.mutateAsync({ id });
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <EditablePostTitle {...props.post} />
        <p className="mt-2 text-sm">{content}</p>
        <p className="mt-2 text-xs">Posted by {author_id}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-black"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
});
