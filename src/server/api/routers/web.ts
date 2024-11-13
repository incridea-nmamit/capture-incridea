import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const webRouter = createTRPCRouter({
  // Add Log Mutation
  addLog: publicProcedure
    .input(
      z.object({
        cookieId: z.string(),
        pageName: z.string(),
        timeSpent: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Save page visit log along with the time spent
      const logEntry = await ctx.db.webAnalytics.create({
        data: {
          cookie_id: input.cookieId,
          page_name: input.pageName,
          time_spent: input.timeSpent,
        },
      });
      return logEntry;
    }),

  // Check or Create Cookie Mutation
  checkOrCreateCookie: publicProcedure
    .input(z.object({ cookieId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      let cookieId = input.cookieId;
      if (!cookieId) {
        // If no cookie ID, create a new one and store it in the database
        cookieId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await ctx.db.webAnalytics.create({
          data: {
            cookie_id: cookieId,
            page_name: "initial-visit",
            time_spent: 0,
          },
        });
      }
      return cookieId;
    }),

  // Get All Logs Query
  getAllLogs: publicProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.webAnalytics.findMany();
    return logs;
  }),
});
