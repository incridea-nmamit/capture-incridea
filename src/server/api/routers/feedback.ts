import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const feedbackRouter = createTRPCRouter({
    createFeedback: protectedProcedure
        .input(
            z.object({
                description: z.string().optional(),
                rating: z.number().min(1).max(5),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.feeback.upsert({
                where: { userId: ctx.session.user.id },
                update: { description: input.description, rating: input.rating, date_time: new Date() },
                create: { userId: ctx.session.user.id, description: input.description, rating: input.rating },
            });
        }),
    getAllFeedback: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.feeback.findMany({
            include: { user: true },
            orderBy: { date_time: "desc" },
        });
    }),
    deleteFeedback: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.feeback.delete({
                where: { id: input.id },
            });
        }),
});
