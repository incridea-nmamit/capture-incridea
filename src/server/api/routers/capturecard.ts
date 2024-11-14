// src/server/trpc/router/captureCard.ts
import {createTRPCRouter, publicProcedure } from "../trpc";

export const captureRouter = createTRPCRouter({
    getCards: publicProcedure.query(async ({ ctx }) => {
        const cards = await ctx.db.captureCard.findMany();
        return cards;
      }),
});
