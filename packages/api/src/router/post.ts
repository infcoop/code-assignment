import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return  [{
        id: "1",
        title: "Hello, world!",
        content: "This is a post",
      }]
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return {
        id: "1",
        title: "Hello, world!",
        content: "This is a post",}
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      return {
        id: "2",
        title: "Hello, world!",
        content: "This is a post",}
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return "success"
  }),
} satisfies TRPCRouterRecord;
