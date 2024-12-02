import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const captureRouter = createTRPCRouter({

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

  updateCardExpiry: publicProcedure
    .input(
      z.object({
        id: z.number().min(1, "Event ID is required"),
        CardState: z.enum(['active', 'inactive']),
        cardExpiry: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCard = await ctx.db.captureCard.update({
        where: { id: input.id },
        data: { cardRtime: input.cardExpiry ,
          cardState: input.CardState 
        },
      });

      return {
        message: "Card expiry updated successfully",
        card: updatedCard,
      };
    }),
});
