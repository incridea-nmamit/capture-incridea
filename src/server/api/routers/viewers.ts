import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';

export const viewerRouter = createTRPCRouter({
  // Upsert Viewer Mutation
  upsertView: publicProcedure
    .input(
      z.object({
        cookie_id: z.string(),
        routePath: z.string(),
        lastPing: z.date(),
        expiry: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const upsertedViewer = await ctx.db.viewer.upsert({
          where: { cookie_id: input.cookie_id },
          update: {
            routePath: input.routePath,
            lastPing: input.lastPing,
            expiry: input.expiry,
          },
          create: {
            cookie_id: input.cookie_id,
            routePath: input.routePath,
            lastPing: input.lastPing,
            expiry: input.expiry,
          },
        });
        return upsertedViewer;
      } catch (error) {
        throw new Error('Failed to upsert viewer record');
      }
    }),

  // Get All Viewers Query
  getViews: publicProcedure.query(async ({ ctx }) => {
    try {
      const viewers = await ctx.db.viewer.findMany();
      return viewers;
    } catch (error) {
      throw new Error('Failed to fetch viewer records');
    }
  }),
});
