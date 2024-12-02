import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';

export const smcRouter = createTRPCRouter({
  getAllUploads: publicProcedure.query(async ({ ctx }) => {
    const uploads = await ctx.db.smcuploads.findMany({
      orderBy: { date_time: 'desc' },
    });
    return uploads ?? [];
  }),

  addVideo: protectedProcedure
    .input(
      z.object({
        author: z.string().min(1, "Author is required"),
        description: z.string().min(1, "Description is required"),
        uploadKey: z.string().min(1, "Upload key is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      return await ctx.db.smcuploads.create({
        data: {
          author: input.author,
          description: input.description,
          video_path: imageUrl,
        },
      });
    }),

  deleteVideo: protectedProcedure
    .input(z.object({ id: z.number().min(1, "Upload ID is required") }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.smcuploads.delete({ where: { id: input.id } });
      return { message: "Upload deleted successfully" };
    }),
});
