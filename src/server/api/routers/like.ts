import {  createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import { z } from "zod";

export const likeRouter = createTRPCRouter({
  // Get all events
  getLike: publicProcedure.query(async ({ ctx }) => {
    const like = await ctx.db.galleryLike.findMany({
    });
    return like ?? [];
  }),

  getTotalLikes: protectedProcedure
    .input(
      z.object({
        captureId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
        const totalLikes = await ctx.db.galleryLike.count({
            where: { galleryId: input.captureId, liked: true },
          });     

      return totalLikes;
    }),

  // Add a new event
  like: protectedProcedure
  .input(
    z.object({
      galleryId: z.number().min(1, "Id is required"),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      alert("User not authenticated");
    }

    const newLike = await ctx.db.galleryLike.create({
      data: {
        galleryId: input.galleryId,
        userId,
      },
    });

    return newLike;
  }),


    likeUsers: protectedProcedure
    .input(
      z.object({
        galleryId: z.number().min(1, "Id is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
        const users = await ctx.db.galleryLike.findMany({
            where: { galleryId: input.galleryId, liked: true },
            include: { user: true },
          });
                
    }),


    hasLiked: protectedProcedure
    .input(
      z.object({
        galleryId: z.number().min(1, "Id is required"),
        userId: z.string().min(1, "userId is required")
      })
    )
    .mutation(async ({ ctx, input }) => {
        const hasLiked = await ctx.db.galleryLike.findUnique({
            where: { userId_galleryId: { userId: input.userId, galleryId: input.galleryId } },
          });
          return hasLiked?.liked;          
    }),

    toggleLike: protectedProcedure
  .input(
    z.object({
      galleryId: z.number().min(1, "Id is required"),
      userId: z.string().min(1, "userId is required"),
      toggle: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { galleryId, userId, toggle } = input;

    // Check if the user exists in the User table
    const userExists = await ctx.db.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // Check if the gallery exists in the Gallery table
    const galleryExists = await ctx.db.gallery.findUnique({ where: { id: galleryId } });

    if (!galleryExists) {
      throw new Error(`Gallery with ID ${galleryId} does not exist.`);
    }

    // If both user and gallery exist, perform the upsert operation
    await ctx.db.galleryLike.upsert({
      where: { userId_galleryId: { userId, galleryId } },
      update: { liked: toggle },
      create: { userId, galleryId, liked: toggle },  // Default liked to the toggle value
    });
  }),

});
