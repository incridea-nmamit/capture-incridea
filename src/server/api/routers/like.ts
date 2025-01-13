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
      const totalLikes = await ctx.db.galleryLike.count({
        where: { galleryId: input.captureId, liked: true },
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
      const likeStatus = await ctx.db.galleryLike.findUnique({
        where: { userId_galleryId: { userId: ctx.session.user.id, galleryId: input.captureId } },
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
      await ctx.db.galleryLike.upsert({
        where: { userId_galleryId: { userId:ctx.session.user.id, galleryId: input.galleryId } },
        update: { liked: input.toggle },
        create: { userId: ctx.session.user.id, galleryId: input.galleryId, liked: input.toggle },
      });
    }),
});
