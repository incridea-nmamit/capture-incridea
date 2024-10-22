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
    getMediaTeams: protectedProcedure.query(async ({ ctx }) => {
      // Fetch teams where either committee1 or committee2 is 'media'
      const teams = await ctx.db.team.findMany({
        where: {
          OR: [
            { committee1: 'media' },
            { committee2: 'media' },
          ],
        },
      });
    
      // Valid media-related designations to filter by
      const mediaDesignations = [
        'mediahead',
        'mediacohead',
        'leadvideographer',
        'leadphotographer',
        'photographer',
        'videographer',
        'aerialvideographer',
      ];
    
      // Filter and restructure each team object
      const filteredTeams = teams.map((team) => {
        // Collect valid media designations from designation1, 2, and 3
        const combinedDesignations = [
          team.designation1,
          team.designation2,
          team.designation3,
        ]
          .filter((designation) => designation && mediaDesignations.includes(designation))
          .join(', '); // Join them into a single string
    
        // Return a new team object with only the required fields
        return {
          id: team.id, // Keep essential fields like ID (add more if needed)
          name: team.name, // Add name or other fields you want to keep
          committee: 'media', // Always set 'media' if the team is in the media committee
          designation: combinedDesignations,
          image: team.image, // Use combined designations
          say: team.say,
        };
      });
    
      return filteredTeams.length > 0 ? filteredTeams : null;
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
  