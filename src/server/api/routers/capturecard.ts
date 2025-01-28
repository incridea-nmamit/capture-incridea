import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const capturecardRouter = createTRPCRouter({

  getCards: publicProcedure.query(async ({ ctx }) => {
    const cards = await ctx.db.captureCard.findMany();
    return cards;
  }),


  getCardStateByName: publicProcedure
  .input(
    z.object({
      cardName: z.string().nonempty("Card name is required"),
    })
  )
  .query(async ({ ctx, input }) => {
    const card = await ctx.db.captureCard.findFirst({
      where: {
        cardName: input.cardName
      },
    });

    if (!card) {
      throw new Error("Card not found");
    }

    return card.cardState;
  }),

  updateCardVisibility: protectedProcedure
  .input(
    z.object({
      cardName: z.string().nonempty("Card name is required"),
      newValue: z.boolean(),  
    })
  )
  .mutation(async ({ ctx, input }) => {
    const card = await ctx.db.captureCard.findFirst({
      where: { cardName: input.cardName },
    });

    if (!card) {
      throw new Error("Card not found");
    }

    // Update the card state
    const updatedCard = await ctx.db.captureCard.update({
      where: { id: card.id }, // Use the card's ID to update
      data: {
        cardState: input.newValue,
      },
    });

    return updatedCard;
  }),

});
