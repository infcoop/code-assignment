import { Suspense } from "react";
import Image from "next/image";

import { HydrateClient } from "~/trpc/server";
import infSvg from "../../public/inf-logo-large.svg";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

export default function HomePage() {
  return (
    <HydrateClient>
      <Suspense fallback={<PostListSkeleton />}>
        <main className="container h-screen py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-5xl font-thin tracking-tight sm:text-[5rem]">
              Create{" "}
              <span>
                <Image
                  className="inline pb-4"
                  src={infSvg.src}
                  alt="INF"
                  width={128}
                  height={128}
                  priority
                />
              </span>{" "}
              Posts
            </h1>

            <CreatePostForm />
            <div className="w-full max-w-2xl h-[200px] overflow-y-auto">
              <PostList />
            </div>
          </div>
        </main>
      </Suspense>
    </HydrateClient>
  );
}

const PostListSkeleton = () => (
  <div className="flex w-full flex-col gap-4">
    <PostCardSkeleton />
    <PostCardSkeleton />
    <PostCardSkeleton />
  </div>
);
