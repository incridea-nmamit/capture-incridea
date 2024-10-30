import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { RemovalRequestStatus } from "@prisma/client"; // Import the enum

export const removalRequestRouter = createTRPCRouter({
  // Submit a new removal request
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        idcard: z.string().min(1, "ID card URL is required"),
        description: z.string(),
        email: z.string(),
        image_path: z.string().min(1, "Image path is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.idcard}`;
      const newRequest = await ctx.db.removalRequest.create({
        data: {
          name: input.name,
          idcard: imageUrl,
          email: input.email,
          description: input.description,
          image_path: input.image_path,
          status: RemovalRequestStatus.pending, // Default status
        },
      });
      return newRequest;
    }),

  // Approve a removal request
  approve: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Request ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.removalRequest.findUnique({
        where: { id: input.id },
      });

      // Check if the request exists
      if (!request) {
        throw new Error("Request not found");
      }

      // Update the request status to approved
      const approvedRequest = await ctx.db.removalRequest.update({
        where: { id: input.id },
        data: { status: RemovalRequestStatus.approved }, // Set status to approved
      });

      return approvedRequest;
    }),

  // Decline a removal request
  decline: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Request ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.removalRequest.findUnique({
        where: { id: input.id },
      });

      // Check if the request exists
      if (!request) {
        throw new Error("Request not found");
      }

      // Update the request status to declined
      const declinedRequest = await ctx.db.removalRequest.update({
        where: { id: input.id },
        data: { status: RemovalRequestStatus.declined }, // Set status to declined
      });

      return declinedRequest;
    }),

  // Get all removal requests
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const requests = await ctx.db.removalRequest.findMany();
    return requests;
  }),
});
