import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const removalRequestRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        idcard: z.string().min(1, "ID card URL is required"),
        description: z.string(),
        image_path: z.string().min(1, "Image path is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newRequest = await ctx.db.removalRequest.create({
        data: {
          name: input.name,
          idcard: input.idcard,
          description: input.description,
          image_path: input.image_path,
          status: "pending",
        },
      });
      return newRequest;
    }),
});
