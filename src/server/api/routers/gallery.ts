import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { State, EventType, Day } from "@prisma/client";

export const galleryRouter = createTRPCRouter({
  // Get all events
  getAllGallery: protectedProcedure.query(async ({ ctx }) => {
    const gallery = await ctx.db.gallery.findMany({});
    return gallery ?? [];
  }),

  // Add a new event
  addImage: protectedProcedure
    .input(
      z.object({
        event_name: z.string().min(1, "Event name is required"),        
        uploadKey: z.string().min(1, "Upload key is required"),       
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      const newEvent = await ctx.db.gallery.create({
        data: {
          event_name: input.event_name,
          image_path: imageUrl,
        },
      });

      return newEvent;
    }),

  deleteImage: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Event ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.gallery.delete({
        where: { id: input.id },
      });

      return { message: "Image deleted successfully" };
    }),
});
