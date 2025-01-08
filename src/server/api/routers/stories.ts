import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const storiesRouter = createTRPCRouter({
  getAllStories: publicProcedure.query(async ({ ctx }) => {
    const stories = await ctx.db.stories.findMany();
    return stories ?? [];
  }),

  addStories: protectedProcedure
    .input(
      z.object({
        category_name: z.string().min(1, "Category name is required"),
        uploadKey: z.string().min(1, "Upload key is required"),
        authored_id: z.number().min(1, "Authored id is required"),

      })
    )
    .mutation(async ({ ctx, input }) => {
      const videoURL = `https://utfs.io/f/${input.uploadKey}`;
      const newStory = await ctx.db.stories.create({
        data: {
          video_path: videoURL,
          category_name: input.category_name,
          authored_id: input.authored_id
        },
      });

      return newStory;
    }),

  // Delete an event by ID
  deleteStories: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Event ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteStory = await ctx.db.stories.delete({
        where: { id: input.id },
      });
      return deleteStory;
    }),

});
