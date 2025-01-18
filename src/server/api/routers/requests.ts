
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Status } from "@prisma/client";

export const removalRequestRouter = createTRPCRouter({

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
          status: "pending"
        },
      });
      return newRequest;
    }),


  clearRequest: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Request ID is required"),
        status:z.nativeEnum(Status)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.removalRequest.findUnique({
        where: { id: input.id },
      });

      if (!request) {
        throw new Error("Request not found");
      }

      return await ctx.db.removalRequest.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const requests = await ctx.db.removalRequest.findMany();
    return requests;
  }),

  getPendingCount: protectedProcedure.query(async ({ ctx }) => {
    const pendingCount = await ctx.db.removalRequest.count({
      where: { status: "pending" },
    });
    return pendingCount;
  }),
});
