import {  createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import { z } from "zod";
import { Name } from "node_modules/@simplewebauthn/server/esm/deps";
export const galleryRouter = createTRPCRouter({
  // Get all events
  getAllGallery: protectedProcedure.query(async ({ ctx }) => {
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
        event_name: z.string().optional(),
        event_category: z.string().min(1, "Event name is required"),        
        uploadKeyOg: z.string().min(1, "Upload key is required"), 
        uploadKeyCompressed: z.string().min(1, "Upload key is required").optional(),       
        upload_type: z.string().min(1, "Type is required"), 
        state: z.enum(['pending', 'declined', 'approved'])      
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKeyOg}`;
      const compressedUrl = `https://utfs.io/f/${input.uploadKeyCompressed}`;
      const auto_button = (await ctx.db.variables.findUnique({where:{key:"capture-auto-request"}}))?.value
      const newImage = await ctx.db.gallery.create({
        data: {
          event_name: input.event_category === "events" ? input.event_name : null,
          event_category: input.event_category,
          image_path: imageUrl,
          compressed_path: compressedUrl,
          state:auto_button!="OFF"?"approved":"pending",
          upload_type: input.upload_type
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
      await ctx.db.gallery.updateMany({
        where: { id: input.id },
        data:{
          upload_type: "deleted",
        }
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
    }),

    batchUpload: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Capture ID is required"),
        upload_type: z.string().min(1, "Type is required"), 
        state: z.enum(['pending', 'declined', 'approved']), // Ensure the state is valid
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, state, upload_type } = input; 
      await ctx.db.gallery.updateMany({
        where: { id },
        data: {
          state, 
          upload_type
        },
      });
    })
    
});
