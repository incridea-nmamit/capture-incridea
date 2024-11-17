import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db"; // Ensure db is correctly configured

export const analyticsRouter = createTRPCRouter({
  // Log a new visit
  logVisit: publicProcedure
    .input(
      z.object({
        cookieId: z.string(),
        uniqueId: z.string(),
        routePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { cookieId, uniqueId, routePath } = input;
      await db.webAnalytics.create({
        data: {
          cookie_id: cookieId,
          uniqueId: uniqueId,
          routePath: routePath,
          isChecked: "no",
          timer: 0,
          isView: 1,
        },
      });
    }),

  // Update an existing visit
  updateVisit: publicProcedure
    .input(
      z.object({
        uniqueId: z.string(),
        timer: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { uniqueId, timer } = input;
      await db.webAnalytics.updateMany({
        where: { uniqueId },
        data: {
          timer,
          isChecked: "yes",
          isView: 0,
        },
      });
    }),

  // Retrieve analytics data
  getAnalytics: publicProcedure.query(async ({ ctx }) => {
      const data = await ctx.db.webAnalytics.findMany();
      return data;
  }),

  // Procedure to update entries with null timer values
  updateNullEntries: publicProcedure
    .input(
      z.object({
        cookieId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { cookieId } = input;
      await db.webAnalytics.updateMany({
        where: {
          cookie_id: cookieId,
          isChecked: "no",
        },
        data: {
          isChecked:"yes",
          isView: 0,
        },
      });
    }),

    
});
