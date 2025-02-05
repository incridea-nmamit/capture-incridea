import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const capturesRouter = createTRPCRouter({
  // Get all events
  getAllcaptures: publicProcedure.query(async ({ ctx }) => {
    const captures = await ctx.db.captures.findMany({
      orderBy: {
        date_time: "desc"
      }

    });
    return captures ?? [];
  }),

  getApproveCaptures: publicProcedure.query(async ({ ctx }) => {
    const captures = await ctx.db.captures.findMany({
      orderBy: {
        date_time: "desc"
      },
      where: {
        state: "pending",
        upload_type: {
          not: "deleted",
        },
      }

    });
    return captures ?? [];
  }),

  getAllActivecapturesforAdmin: publicProcedure.query(async ({ ctx }) => {
    const captures = await ctx.db.captures.findMany({
      where: {
        upload_type: {
          not: "deleted",
        },
      },
      orderBy: {
        date_time: "desc",
      },
    });
    return captures ?? [];
  }),
  getAllDeletedcapturesforAdmin: publicProcedure.query(async ({ ctx }) => {
    const captures = await ctx.db.captures.findMany({
      where: {
        upload_type: {
          equals: "deleted",
        },
      },
      orderBy: {
        date_time: "desc",
      },
    });
    return captures ?? [];
  }),

  restoreDeletedcaptures: publicProcedure.input(
    z.object({
      id: z.number().min(1, "Capture ID is required"),
    })
  ).mutation(async ({ ctx, input }) => {
    await ctx.db.captures.updateMany({
      where: { id: input.id },
      data: {
        upload_type: "",
      },
    });
    return { message: "Image restored successfully" };
  }),

  deletecapturesPermanently: publicProcedure.input(
    z.object({
      id: z.number().min(1, "Capture ID is required"),
    })
  ).mutation(async ({ ctx, input }) => {
    await ctx.db.captures.delete({
      where: { id: input.id },
    });
    return { message: "Image deleted permanently" };
  }),



  getApprovedImagesByCategory: publicProcedure
    .input(
      z.object({
        category: z.string().min(1, "Category is required"),
        includeDownloadCount: z.boolean().optional(),
        cursor: z.date().optional(), // Cursor is a string here to represent the `date_time` value
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { category, includeDownloadCount = false, cursor, limit = 30 } = input;

      const images = await ctx.db.captures.findMany({
        where: {
          event_category: category,
          state: "approved",
          upload_type: "direct",
          ...(cursor && { date_time: { lt: cursor } }), // Filter based on cursor
        },
        orderBy: {
          date_time: "desc",
        },
        take: limit,
        select: {
          id: true,
          image_path: true,
          compressed_path: true,
          event_name: true,
          event_category: true,
          upload_type: true,
          state: true,
          date_time: true,
          ...(includeDownloadCount && {
            _count: {
              select: {
                downloadLog: true,
              },
            },
          }),
        },
      });

      return {
        images: images.map((captures) => ({
          ...captures,
          download_count: includeDownloadCount
            ? captures._count?.downloadLog ?? 0
            : undefined,
        })),
        nextCursor: images.length > 0 ? images[images.length - 1]!.date_time : null,
      };
    }),
  getApprovedImagesByEventName: publicProcedure
    .input(
      z.object({
        eventName: z.string().min(1, "event name is required"),
        includeDownloadCount: z.boolean().optional(),
        cursor: z.date().optional(), // Cursor is a string here to represent the `date_time` value
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { eventName, includeDownloadCount = false, cursor, limit = 30 } = input;

      const images = await ctx.db.captures.findMany({
        where: {
          event_name: eventName,
          state: "approved",
          upload_type: "direct",
          ...(cursor && { date_time: { lt: cursor } }), // Filter based on cursor
        },
        orderBy: {
          date_time: "desc",
        },
        take: limit,
        select: {
          id: true,
          image_path: true,
          compressed_path: true,
          event_name: true,
          event_category: true,
          upload_type: true,
          state: true,
          date_time: true,
          ...(includeDownloadCount && {
            _count: {
              select: {
                downloadLog: true,
              },
            },
          }),
        },
      });

      return {
        images: images.map((captures) => ({
          ...captures,
          download_count: includeDownloadCount
            ? captures._count?.downloadLog ?? 0
            : undefined,
        })),
        nextCursor: images.length > 0 ? images[images.length - 1]!.date_time : null,
      };
    }),
  // Add a new event
  addImage: protectedProcedure
    .input(
      z.object({
        event_name: z.string().optional(),
        event_category: z.string().min(1, "Event name is required"),
        uploadKeyOg: z.string().min(1, "Upload key is required"),
        uploadKeyCompressed: z.string().min(1, "Upload key is required"),
        upload_type: z.string().min(1, "Type is required"),
        author_id: z.number().min(1, "Author Id is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = input.uploadKeyOg;
      const compressedUrl = input.uploadKeyCompressed;
      const auto_button = (await ctx.db.variables.findUnique({ where: { key: "capture-auto-request" } }))?.value
      const newImage = await ctx.db.captures.create({
        data: {
          event_name: input.event_category === "events" ? input.event_name : null,
          event_category: input.event_category,
          image_path: imageUrl,
          captured_by_id: input.author_id,
          compressed_path: compressedUrl,
          state: auto_button != "OFF" ? "approved" : "pending",
          upload_type: input.upload_type
        },
      });

      return newImage;
    }),

  deleteImage: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Capture ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.captures.updateMany({
        where: { id: input.id },
        data: {
          upload_type: "deleted",
        }
      });

      return { message: "Image deleted successfully" };
    }),

  updateState: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Capture ID is required"),
        state: z.enum(['pending', 'declined', 'approved']), // Ensure the state is valid
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, state } = input;
      await ctx.db.captures.updateMany({
        where: { id },
        data: {
          state,
        },
      });
    }),

  batchUpload: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Capture ID is required"),
        upload_type: z.string().min(1, "Type is required"),
        state: z.enum(['pending', 'declined', 'approved']), // Ensure the state is valid
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, state, upload_type } = input;
      await ctx.db.captures.updateMany({
        where: { id },
        data: {
          state,
          upload_type
        },
      });
    }),

  getAuthorDetails: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Author ID is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const author = await ctx.db.captures.findUnique({
        where: {
          id: input.id,
        },
        select: {
          captured_by: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (!author) {
        throw new Error("Author not found");
      }

      return {
        name: author.captured_by.name,
        image: author.captured_by.image,
      };
    }),


  getCaptureDetailsForQrScanById: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Capture ID is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const captureDetails = await ctx.db.captures.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          image_path: true,
          compressed_path: true,
          event_name: true,
          event_category: true,
          upload_type: true,
          state: true,
          date_time: true,
          captured_by: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });


      if (!captureDetails) {
        throw new Error("Capture not found");
      }

      return captureDetails;
    }),
});
