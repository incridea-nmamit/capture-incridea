import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc"; // Adjust the import path as needed

export const auditLog = createTRPCRouter({
  log: publicProcedure
    .input(
      z.object({
        sessionUser: z.string().min(1, "Session user is required"),
        description: z.string().min(1, "Description is required"), 
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newLog = await ctx.db.auditLog.create({
        data: {
          sessionUserName: input.sessionUser,
          description: input.description,
          dateTime: new Date(), 
        },
      });

      return newLog;
    }),
});
