import { randomUUID } from "node:crypto";
import type { TRPCRouterRecord } from "@trpc/server";
import type { Insertable } from "kysely";
import type { ZodType } from "zod";
import { z } from "zod";

import type { posts } from "@inf/db/types";
import { db } from "@inf/db";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    const posts = await db.selectFrom("posts").selectAll().execute();
    return posts;
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await db
        .selectFrom("posts")
        .selectAll()
        .where("id", "=", input.id)
        .executeTakeFirst();

      return post;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        author_id: z.string(),
      }) satisfies ZodType<Insertable<posts>>,
    )
    .mutation(async ({ ctx, input }) => {
      const post = await db
        .insertInto("posts")
        .returningAll()
        .values({
          id: randomUUID(),
          ...input,
        })
        .executeTakeFirstOrThrow()
        .then((r) => r.id);
      return post;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        author_id: z.string(),
      }) satisfies ZodType<Insertable<posts>>,
    )
    .mutation(async ({ ctx, input }) => {
      const post = await db
        .updateTable("posts")
        .returningAll()
        .set({
          title: input.title,
          content: input.content,
          author_id: input.author_id,
        })
        .where("id", "=", input.id)
        .executeTakeFirstOrThrow()
        .then((r) => r.id);
      return post;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await db
        .selectFrom("posts")
        .select("posts.id")
        .where("id", "=", input.id)
        .executeTakeFirst();

      if (!post) {
        throw new Error("Post not found");
      }
      await db.deleteFrom("posts").where("id", "=", input.id).execute();

      return post;
    }),
} satisfies TRPCRouterRecord;
