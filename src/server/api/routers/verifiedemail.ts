import { initTRPC } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { Context } from '~/server/context';
import { CollegeType } from "@prisma/client";


const t = initTRPC.context<Context>().create();

export const verifiedEmail = t.router({
  addVerifiedEmail: t.procedure.input(z.object({ email: z.string().email(), phone_number:z.string(),name:z.string()}))
    .mutation(async ({ ctx, input }) => {
      const newEmail = await ctx.db.verifiedEmail.create({
        data: {
          email: input.email,
          name:input.name,
          phone_number:input.phone_number,
          college:input.email.endsWith("nmamit.in")?CollegeType.internal:CollegeType.external,
        },
      });
      return newEmail;
    }),

  getEmail: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.verifiedEmail.findMany();
    return data;
  }),
});
