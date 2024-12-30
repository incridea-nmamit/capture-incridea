import {  createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import { z } from "zod";
import { Name } from "node_modules/@simplewebauthn/server/esm/deps";
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
  addImage: publicProcedure
    .input(
      z.object({
        event_name: z.string().min(1, "Event name is required"),   
        event_category: z.string().min(1, "Event name is required"),        
        uploadKeyOg: z.string().min(1, "Upload key is required"),       
        uploadKeyCompressed: z.string().min(1, "Upload key is required"),       
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKeyOg}`;
      const compressedUrl = `https://utfs.io/f/${input.uploadKeyCompressed}`;
      const auto_button = (await ctx.db.variables.findUnique({where:{key:"capture-auto-request"}}))?.value
      const newImage = await ctx.db.gallery.create({
        data: {
          event_name: input.event_name,
          event_category: input.event_category,
          image_path: imageUrl,
          compressed_path: compressedUrl,
          upload_type:"image",
          state:auto_button!="OFF"?"approved":"pending"

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

    updateState: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Capture ID is required"),
        state: z.enum(['pending', 'declined', 'approved']), // Ensure the state is valid
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, state } = input; 
      await ctx.db.gallery.updateMany({
        where: { id },
        data: {
          state, 
        },
      });
    })
    
});
