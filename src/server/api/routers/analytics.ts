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
          isView: 0,
        },
      });
    }),
});
