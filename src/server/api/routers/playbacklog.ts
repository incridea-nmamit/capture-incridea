import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const downloadLogRouter = createTRPCRouter({
  getAllLogs: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.playbackLog.findMany({});
    return logs ?? [];
  }),

  logDownload: publicProcedure
    .input(
      z.object({
        playback_id: z.number().min(1, "File path is required"),
        session_user: z.string().min(1, "Session is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Log the download
      const newLog = await ctx.db.playbackLog.create({
        data: {
          session_user: input.session_user,
          playback_id: input.playback_id,
        },
      });

      return newLog;
    }),

  getDownloadLog: protectedProcedure
    .input(
      z.object({
        playback_id: z.number().min(1, "File path is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const logs = await ctx.db.playbackLog.findMany({
        where: {
            playback_id: input.playback_id,
        },
      });
      return logs ?? [];
    }),

    getDownloadLogCount: protectedProcedure
  .input(
    z.object({
        playback_id: z.number().min(1, "File path is required"),
    })
  )
  .query(async ({ ctx, input }) => {
    const count = await ctx.db.playbackLog.count({
      where: {
        playback_id: input.playback_id,
      },
    });
    return count;
  }),

});
