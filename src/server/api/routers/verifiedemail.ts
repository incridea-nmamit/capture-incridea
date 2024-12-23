import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc"; // Adjust the import path as needed

export const verifiedEmail = createTRPCRouter({
  addVerifiedEmail: publicProcedure
    .input(
      z.object({
        email: z.string().min(1, "Session user is required"), 
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newEmail = await ctx.db.verifiedEmail.create({
        data: {
          email: input.email,
        },
      });

      return newEmail;
    }),
    getEmail: publicProcedure.query(async ({ ctx }) => {
      const data = await ctx.db.verifiedEmail.findMany();
      return data;
  }),
});
