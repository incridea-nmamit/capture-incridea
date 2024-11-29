import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const captureRouter = createTRPCRouter({
  // Fetch all cards
  getCards: publicProcedure.query(async ({ ctx }) => {
    const cards = await ctx.db.captureCard.findMany();
    return cards;
  }),

  // Fetch cardState by cardName
  getCardStateByName: publicProcedure
  .input(
    z.object({
      cardName: z.string().nonempty("Card name is required"),
    })
  )
  .query(async ({ ctx, input }) => {
    const card = await ctx.db.captureCard.findFirst({
      where: {
        cardName: input.cardName, // Matches based on cardName
      },
    });

    if (!card) {
      throw new Error("Card not found");
    }

    return card.cardState;
  }),
});
