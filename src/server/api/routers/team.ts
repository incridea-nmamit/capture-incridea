import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Teamgroup } from "@prisma/client";

export const teamRouter = createTRPCRouter({
  addTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        committee: z.nativeEnum(Teamgroup),
        designation: z.string(),
        uploadKey: z.string().min(1, "Upload key is required"),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        behance: z.string().optional(),
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
          say: input.say || "",
          github: input.github || "",
          linkedin: input.linkedin || "",
          instagram: input.instagram || "",
          behance: input.behance || "",
        },
      });
      return newTeam;
    }),


  updateTeam: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Team ID is required"),
        name: z.string().optional(),
        committee: z.nativeEnum(Teamgroup).optional(),
        designation: z.string().optional(),
        uploadKey: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        behance: z.string().optional(),
        say: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, uploadKey, ...rest } = input;

      const updates = {
        ...rest,
        ...(uploadKey && { image: `https://utfs.io/f/${uploadKey}` }),
      };

      return ctx.db.team.update({
        where: { id },
        data: updates,
      });
    }),

  getTeamDetailsById: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Team ID is required")
      })
    )
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.id
        }
      })
      return team
    }),

  deleteTeam: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Team ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedTeam = await ctx.db.team.delete({
        where: { id: input.id },
      });
      return deletedTeam;
    }),


  getAllTeams: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.team.findMany({
      orderBy: {
        id: "desc"
      }
    });
    return teams;
  }),

});
