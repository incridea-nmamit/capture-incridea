import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const galleryRouter = createTRPCRouter({
  // Fetch all gallery images
  getImage: protectedProcedure.query(async ({ ctx }) => {
    const images = await ctx.db.gallery.findMany({
      select: {
        id: true,
        image_path: true,
        image_name: true,
        event_name: true,
      },
    });
    return images ?? null;
  }),

  // Add a new gallery image
  addImage: protectedProcedure
    .input(
      z.object({
        event_name: z.string().min(1, "Event name is required"),
        image_path: z.string().url().min(1, "Image URL is required"),
        image_name: z.string().min(1, "Image name is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newImage = await ctx.db.gallery.create({
        data: {
          event_name: input.event_name,
          image_path: input.image_path,
          image_name: input.image_name,
        },
      });

      return newImage;
    }),

  // Delete a gallery image by ID
  deleteImage: protectedProcedure
    .input(z.object({ id: z.string().min(1, "Image ID is required") }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.gallery.delete({
        where: { id: Number(input.id) }, // Ensure ID is correctly parsed
      });
    }),
});
