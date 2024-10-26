import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Teamgroup, position } from "@prisma/client";

export const teamRouter = createTRPCRouter({
  // Add Team Mutation
  addTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        committee: z.nativeEnum(Teamgroup),
        designation: z.nativeEnum(position),
        uploadKey: z.string().min(1, "Upload key is required"),
        say: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      const newTeam = await ctx.db.team.create({
        data: {
          name: input.name,
          committee: input.committee,
          designation: input.designation,
          image: imageUrl,
          say: input.say ?? "", // Handle undefined say field
        },
      });
      return newTeam;
    }),

  // Update Team Mutation
  updateTeam: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Team ID is required"),
        name: z.string().optional(),
        committee: z.nativeEnum(Teamgroup).optional(),
        designation: z.nativeEnum(position).optional(),
        uploadKey: z.string().optional(),
        say: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updates: Partial<{
        name: string;
        committee: Teamgroup;
        designation: position;
        image: string;
        say: string;
      }> = {};

      if (input.name) updates.name = input.name;
      if (input.committee) updates.committee = input.committee;
      if (input.designation) updates.designation = input.designation;
      if (input.uploadKey) updates.image = `https://utfs.io/f/${input.uploadKey}`;
      if (input.say) updates.say = input.say;

      const updatedTeam = await ctx.db.team.update({
        where: { id: input.id },
        data: updates,
      });
      return updatedTeam;
    }),

  // Get All Teams Query
  getAllTeams: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.team.findMany();
    return teams;
  }),
});
