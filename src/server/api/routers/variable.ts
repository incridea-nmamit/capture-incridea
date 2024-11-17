import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; // Adjust the import path as needed
import { db } from "~/server/db"; // Assuming you have a Prisma instance setup

export const variableRouter = createTRPCRouter({
  // Define the 'getVariable' query inside the router
  getVariable: publicProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .query(async ({ input }) => { // Use 'query' here instead of 'mutation'
      const { key } = input;

      try {
        // Query the Variables table to find the matching key
        const variable = await db.variables.findUnique({
          where: { key }, // Prisma will look for a unique 'key'
        });

        // If the variable is found, return the value; otherwise, return a message
        if (variable) {
          return { value: variable.value }; // Return the value found
        } else {
          return { message: "Key not found" }; // Or an error message if not found
        }
      } catch (error) {
        // Handle any potential errors (e.g., database errors)
        console.error(error);
        return { message: "An error occurred while fetching the data" };
      }
    }),

    getAllVariables: publicProcedure.query(async ({ ctx }) => {
        const variables = await ctx.db.variables.findMany();
        return variables;
      }),


});
