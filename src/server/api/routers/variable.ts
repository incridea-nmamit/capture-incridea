import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"; 
import { db } from "~/server/db"; 

export const variableRouter = createTRPCRouter({

  getVariable: publicProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .query(async ({ input }) => { 
      const { key } = input;

      try {

        const variable = await db.variables.findUnique({
          where: { key }, 
        });
        if (variable) {
          return { value: variable.value }; 
        } else {
          return { message: "Key not found" };
        }
      } catch (error) {
        console.error(error);
        return { message: "An error occurred while fetching the data" };
      }
    }),

  updateKey: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        key: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { value, key } = input;
      await db.variables.updateMany({
        where: { key },
        data: {
          value,
        },
      });
    }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      const variables = await ctx.db.variables.findMany();
      return variables;
    }),
});
