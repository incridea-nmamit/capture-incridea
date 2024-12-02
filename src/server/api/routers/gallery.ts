import {  createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import { z } from "zod";
export const galleryRouter = createTRPCRouter({
  // Get all events
  getAllGallery: publicProcedure.query(async ({ ctx }) => {
    const gallery = await ctx.db.gallery.findMany({
      orderBy: {
        date_time:"desc"
      }

    });
    return gallery ?? [];
  }),

  // Add a new event
  addImage: protectedProcedure
    .input(
      z.object({
        event_name: z.string().min(1, "Event name is required"),   
        event_category: z.string().min(1, "Event name is required"),        
        uploadKey: z.string().min(1, "Upload key is required"),       
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      const newImage = await ctx.db.gallery.create({
        data: {
          event_name: input.event_name,
          event_category: input.event_category,
          image_path: imageUrl,
        },
      });

      return newImage;
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
