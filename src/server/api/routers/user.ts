import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  // Get All Users Query
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),

  getAllVerifiedUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.verifiedEmail.findMany();
    return users;
  }),

  //getUserRolebyId Query
  getUserRoleById: protectedProcedure.input(
    z.object({
      userId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input.userId },
    });
    return user?.role;
  }),


  // Change User Role Mutation
  changeUserRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(['admin', 'manager', 'editor', 'user', 'smc']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
      return updatedUser;
    }),
});
