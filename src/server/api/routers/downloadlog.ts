import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const downloadLogRouter = createTRPCRouter({
  getAllLogs: publicProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.downloadLog.findMany({});
    return logs ?? [];
  }),

  logDownload: publicProcedure
    .input(
      z.object({
        file_path: z.string().min(1, "File path is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch the IP address
      const baseUrl = process.env.BASE_URL;
      console.log("Base URL:", baseUrl); // Debugging
      const ipResponse = await fetch(`${baseUrl}/api/get-ip`);
      const { ip } = await ipResponse.json();

      // Log the download
      const newLog = await ctx.db.downloadLog.create({
        data: {
          ip_address: ip,
          file_path: input.file_path,
        },
      });

      return newLog;
    }),
});
