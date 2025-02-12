import { createTRPCRouter, protectedProcedure, } from '~/server/api/trpc';
import { z } from 'zod';
import { CollegeType } from '@prisma/client';

export const verficationRouter = createTRPCRouter({
    getAllVerfiedEmails: protectedProcedure.query(async ({ ctx }) => {
        const verifications = await ctx.db.verifiedEmail.findMany({
            orderBy: { id: 'desc' },
        });

        return verifications ?? [];
    }),

    deleteVerfication: protectedProcedure
        .input(z.object({ id: z.number().min(1, 'Verification ID is required') }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.verifiedEmail.delete({ where: { id: input.id } });
            return { message: 'Verification deleted successfully' };
        }),


    addVerfication: protectedProcedure
        .input(z.object({
            email: z.string().email('Invalid email address'),
            name: z.string().min(1, 'Name is required'),
            phone_number: z.string().min(1, 'Phone number is required'),
            college: z.nativeEnum(CollegeType)
        }))
        .mutation(async ({ ctx, input }) => {
            const verification = await ctx.db.verifiedEmail.create({
                data: {
                    email: input.email,
                    name: input.name,
                    phone_number: input.phone_number,
                    college: input.college,
                },
            });

            return verification;
        }),

});
