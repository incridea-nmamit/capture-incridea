import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { WebAnalytics } from "@prisma/client"; // Import your model if necessary

export const webRouter = createTRPCRouter({
  // Add Log Mutation
  addLog: protectedProcedure
    .input(
      z.object({
        ipAddress: z.string(),
        pageName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const logEntry = await ctx.db.webAnalytics.create({
        data: {
          ip_address: input.ipAddress,
          page_name: input.pageName,
        },
      });
      return logEntry;
    }),

  // Get All Logs Query
  getAllLogs: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.webAnalytics.findMany();
    return logs;
  }),
});
