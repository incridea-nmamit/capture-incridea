import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const storycatRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.storycategories.findMany();
    return categories;
  }),

  addCat: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existingCategory = await ctx.db.storycategories.findUnique({
        where: { name: input.name },
      });

      if (existingCategory) {
        throw new Error('Category already exists');
      }

      const newCategory = await ctx.db.storycategories.create({
        data: { name: input.name },
      });

      return newCategory;
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedCategory = await ctx.db.storycategories.delete({
        where: { id: input.id },
      });

      return deletedCategory;
    }),
});
