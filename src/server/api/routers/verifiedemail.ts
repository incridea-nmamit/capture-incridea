import { initTRPC } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { Context } from '~/server/context';

const t = initTRPC.context<Context>().create();

export const verifiedEmail = t.router({
  addVerifiedEmail: t.procedure.input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const newEmail = await ctx.db.verifiedEmail.create({
        data: {
          email: input.email,
        },
      });
      return newEmail;
    }),

  getEmail: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.verifiedEmail.findMany();
    return data;
  }),
});
