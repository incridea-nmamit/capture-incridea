import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const likeRouter = createTRPCRouter({
  getTotalLikes: protectedProcedure
    .input(
      z.object({
        captureId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const totalLikes = await ctx.db.captureLike.count({
        where: { captures_id: input.captureId, liked: true },
      });
      return totalLikes;
    }),

  hasLiked: protectedProcedure
    .input(
      z.object({
        captureId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const likeStatus = await ctx.db.captureLike.findUnique({
        where: { userId_captures_id: { userId: ctx.session.user.id, captures_id: input.captureId } },
      });
      return likeStatus?.liked || false;
    }),

  toggleLike: protectedProcedure
    .input(
      z.object({
        galleryId: z.number(),
        toggle: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.captureLike.upsert({
        where: { userId_captures_id: { userId:ctx.session.user.id, captures_id: input.galleryId } },
        update: { liked: input.toggle },
        create: { userId: ctx.session.user.id, captures_id: input.galleryId, liked: input.toggle },
      });
    }),
});
