import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const playbacksRouter = createTRPCRouter({
    addPlaybacks: adminProcedure
        .input(
            z.object({
                thumbnails: z.string().min(1, "ThumbnailUrl is required"),
                uploadKey: z.string().min(1, "Upload key is required"),
                name: z.string().min(1, "Name required"),
                description: z.string().min(1, " Description required")
            })
        )
        .mutation(async ({ ctx, input }) => {
            const videoPath = `https://utfs.io/f/${input.uploadKey}`;
            const added = await ctx.db.playbacks.create({
                data: {
                    thumbnails: input.thumbnails,
                    videoPath: videoPath,
                    name: input.name,
                    description: input.description
                },
            });
            return added;

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
                thumbnails: z.string().optional(),
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
                    thumbnails: input.thumbnails,
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
    }),

    toggleLikeForPlayback: protectedProcedure
        .input(
            z.object({
                userId: z.string().min(1, "required"),
                playback_Id: z.number().min(1, "required"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const existingLike = await ctx.db.playbackLike.findFirst({
                where: {
                    userId: input.userId,
                    playback_id: input.playback_Id
                }
            });
            if (existingLike) {
                const updatedLike = await ctx.db.playbackLike.update({
                    where: { id: existingLike.id },
                    data: { liked: !existingLike.liked }
                });

                return { message: updatedLike.liked ? "Like added" : "Like removed", liked: updatedLike.liked };
            } else {
                await ctx.db.playbackLike.create({
                    data: {
                        userId: input.userId,
                        playback_id: input.playback_Id,
                        liked: true
                    }
                });
                return { message: "Like added", liked: true };
            }
        }),

    isLiked: protectedProcedure.input(
        z.object({
            userId: z.string().min(1, "required"),
            playback_Id: z.number().min(1, "required"),
        })

    ).query(async ({ ctx, input }) => {
        const existingLike = await ctx.db.playbackLike.findFirst({
            where: {
                userId: input.userId,
                playback_id: input.playback_Id
            }
        });
        return existingLike?.liked ?? false;
    }),

    getTotalPlaybackLikes: protectedProcedure.input(
        z.object({
            id: z.number()
        })
    ).query(async ({ ctx, input }) => {
        return await ctx.db.playbackLike.findMany({
            where: {
                playback_id: input.id,
                liked: true
            },

        });
    }),


})