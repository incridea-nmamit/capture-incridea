import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const downloadLogRouter = createTRPCRouter({
  getAllDownlodeLogs: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.downloadLog.findMany({
    });
    return logs ?? [];
  }),

  logDownload: publicProcedure
    .input(
      z.object({
        image_id: z.number().min(1, "File path is required"),
        session_user: z.string().min(1, "Session is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Log the download
      const newLog = await ctx.db.downloadLog.create({
        data: {
          session_user: input.session_user,
          image_id: input.image_id,
        },
      });

      return newLog;
    }),

  getDownloadLog: protectedProcedure
    .input(
      z.object({
        image_id: z.number().min(1, "File path is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const logs = await ctx.db.downloadLog.findMany({
        where: {
          image_id: input.image_id,
        },
      });
      return logs ?? [];
    }),

    getDownloadLogCount: protectedProcedure
  .input(
    z.object({
      image_id: z.number().min(1, "File path is required"),
    })
  )
  .query(async ({ ctx, input }) => {
    const count = await ctx.db.downloadLog.count({
      where: {
        image_id: input.image_id,
      },
    });
    return count;
  }),

});
