"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react"
import { PostCardSkeleton } from "./PostCardSkeleton";
import { PostCard } from "./PostCard";

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