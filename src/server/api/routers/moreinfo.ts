import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const moreInfoRouter = createTRPCRouter({



    moreInfoForCaptureById: adminProcedure
        .input(
            z.object({
                id: z.number().min(1, "required"),
            })
        )
        .query(async ({ ctx, input }) => {
            const id = input.id;

            const capture = await ctx.db.captures.findUnique({
                where: { id },
                select: {
                    downloadLog: {
                        select: {
                            id: true,
                            session_user: true,
                        },
                    },
                    captureLikes: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                        where: {
                            liked: true
                        }
                    },
                },
            });

            if (!capture) {
                throw new Error("Capture not found");
            }
            const downloadUsers = await Promise.all(
                capture.downloadLog.map(async (log) => {
                    const user = await ctx.db.user.findUnique({
                        where: { email: log.session_user },
                        select: { name: true, image: true },
                    });

                    return {
                        id: log.id,
                        username: user?.name || "Unknown",
                        imageUrl: user?.image || null,
                    };
                })
            );


            const likeUsers = capture.captureLikes.map((like) => ({
                id: like.id,
                username: like.user?.name || "Unknown",
                imageUrl: like.user?.image || null,
            }));

            return {
                totalDownloads: downloadUsers.length,
                downloadUsers,
                totalLikes: likeUsers.length,
                likeUsers,
            };
        }),




    moreInfoForPlayBacksById: adminProcedure
        .input(
            z.object({
                id: z.number().min(1, "required"),
            })
        )
        .query(async ({ ctx, input }) => {
            const id = input.id;

            const playback = await ctx.db.playbacks.findUnique({
                where: { id },
                select: {
                    playbackLog: {
                        select: {
                            id: true,
                            session_user: true,
                        },
                    },
                    playbackLikes: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                        where:{
                            liked: true,
                        }
                    },
                },
            });

            if (!playback) {
                throw new Error("Stories not found");
            }
            const downloadUsers = await Promise.all(
                playback.playbackLog.map(async (log) => {
                    const user = await ctx.db.user.findUnique({
                        where: { email: log.session_user },
                        select: { name: true, image: true },
                    });

                    return {
                        id: log.id,
                        username: user?.name || "Unknown",
                        imageUrl: user?.image || null,
                    };
                })
            );

            const likeUsers = playback.playbackLikes.map((like) => ({
                id: like.id,
                username: like.user?.name || "Unknown",
                imageUrl: like.user?.image || null,
            }));

            return {
                totalDownloads: downloadUsers.length,
                downloadUsers,
                totalLikes: likeUsers.length,
                likeUsers,
            };
        }),

});