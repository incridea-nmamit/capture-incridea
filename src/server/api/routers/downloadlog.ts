import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const downloadLogRouter = createTRPCRouter({
  getAllLogs: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.downloadLog.findMany({});
    return logs ?? [];
  }),

  logDownload: publicProcedure
    .input(
      z.object({
        file_path: z.string().min(1, "File path is required"),
        cookieId: z.string().min(1, "Cookie is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Log the download
      const newLog = await ctx.db.downloadLog.create({
        data: {
          cookieId: input.cookieId,
          file_path: input.file_path,
        },
      });

      return newLog;
    }),
});
