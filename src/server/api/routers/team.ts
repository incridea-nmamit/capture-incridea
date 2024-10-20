import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
  import { z } from "zod";
  import { Teamgroup, position } from "@prisma/client";
  
  export const teamRouter = createTRPCRouter({
    getAllTeams: protectedProcedure.query(async ({ ctx }) => {
      const teams = await ctx.db.team.findMany({});
      return teams ?? null;
    }),
    
    addTeam: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Team name is required"),
          committee1: z.nativeEnum(Teamgroup),
          committee2: z.nativeEnum(Teamgroup).default("none"),
          designation1: z.nativeEnum(position),
          designation2: z.nativeEnum(position).default("none"),
          designation3: z.nativeEnum(position).default("none"),
          uploadKey: z.string().min(1, "Upload key is required"), // Add uploadKey input
          say: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const imageUrl = `https://utfs.io/f/${input.uploadKey}`; // Construct the image URL
  
        const newTeam = await ctx.db.team.create({
          data: {
            name: input.name,
            committee1: input.committee1,
            committee2: input.committee2,
            designation1: input.designation1,
            designation2: input.designation2,
            designation3: input.designation3,
            image: imageUrl, // Use the constructed URL
            say: input.say,
          },
        });
  
        return newTeam;
      }),


      updateTeam: protectedProcedure
  .input(
    z.object({
      id: z.string().min(1, "Team ID is required"), // Keep it as string for input
      name: z.string().optional(),
      committee1: z.nativeEnum(Teamgroup).optional(),
      committee2: z.nativeEnum(Teamgroup).optional(),
      designation1: z.nativeEnum(position).optional(),
      designation2: z.nativeEnum(position).optional(),
      designation3: z.nativeEnum(position).optional(),
      uploadKey: z.string().optional(),
      say: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updates: any = {};

    if (input.name) updates.name = input.name;
    if (input.committee1) updates.committee1 = input.committee1;
    if (input.committee2) updates.committee2 = input.committee2;
    if (input.designation1) updates.designation1 = input.designation1;
    if (input.designation2) updates.designation2 = input.designation2;
    if (input.designation3) updates.designation3 = input.designation3;
    if (input.uploadKey) updates.image = `https://utfs.io/f/${input.uploadKey}`;
    if (input.say) updates.say = input.say;

    // Convert id to number when updating the database
    const updatedTeam = await ctx.db.team.update({
      where: { id: Number(input.id) }, // Convert to number here
      data: updates,
    });

    return updatedTeam;
  }),
  deleteTeam: protectedProcedure
    .input(z.object({ id: z.string().min(1, "Team ID is required") }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.team.delete({
        where: { id: Number(input.id) }, // Convert to number for deletion
      });
    }),

  });
  