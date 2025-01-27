import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const playbacksRouter = createTRPCRouter({
    addPlaybacks: adminProcedure
        .input(
            z.object({
                uploadKey: z.string().min(1, "Upload key is required"),
                name: z.string().min(1, "Name required"),
                description: z.string().min(1, " Description required")
            })
        )
        .mutation(async ({ ctx, input }) => {
            const videoPath = `https://utfs.io/f/${input.uploadKey}`;
            return await ctx.db.playbacks.create({
                data: {
                    videoPath: videoPath,
                    name: input.name,
                    description: input.description

                },
            });
        }),

    deletePlaybacks: adminProcedure
        .input(
            z.object({
                id: z.number().min(1, "required"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.playbacks.delete({
                where: {
                    id: input.id

                }
            });
        }),

    editPlaybacks: adminProcedure
        .input(
            z.object({
                id: z.number().min(1, "required"),
                uploadKey: z.string().optional(),
                name: z.string().optional(),
                description: z.string().optional()

            })
        )
        .mutation(async ({ ctx, input }) => {
            const videoPath = `https://utfs.io/f/${input.uploadKey}`;
            return await ctx.db.playbacks.update({
                where: {
                    id: input.id
                },
                data: {
                    videoPath: videoPath,
                    name: input.name,
                    description: input.description

                },
            });
        }),

    getPlaybacksDetailsById: adminProcedure
        .input(
            z.object({
                id: z.number().min(1, "required"),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.playbacks.findFirst({
                where: {
                    id: input.id
                }
            }) 
        }),

    getAllPlaybacks: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.playbacks.findMany() ?? []
    })

})