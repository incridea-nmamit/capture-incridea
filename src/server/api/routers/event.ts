import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { EventType, Day } from "@prisma/client";

export const eventRouter = createTRPCRouter({
  // Fetch all events
  getAllEvents: publicProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.events.findMany();
    return events ?? [];
  }),

  getEvents: publicProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.events.findMany();
    return events ?? [];
  }),

  // Add a new event
  addEvent: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Event name is required"),
        description: z.string().min(1, "Event description is required"),
        shortDescription: z.string().min(1, "Short description is required"),
        uploadKey: z.string().min(1, "Upload key is required"),
        type: z.nativeEnum(EventType),
        day: z.nativeEnum(Day),
        visibility: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      const newEvent = await ctx.db.events.create({
        data: {
          name: input.name,
          description: input.description,
          shortDescription: input.shortDescription,
          image: imageUrl,
          type: input.type,
          day: input.day,
          visibility: input.visibility,
        },
      });

      return newEvent;
    }),

  getEventById: protectedProcedure.input(z.object({
    id: z.number().min(1, "Event ID is required"),
  })).query(async ({ ctx, input }) => {
    const event = await ctx.db.events.findUnique({
      where: { id: input.id },
    });
    if (!event) throw new Error("Event not found");
    return event;
  }),

  
  editEvent: protectedProcedure
    .input(
      z.object({
        id:z.number().min(1, "Event ID is required"),
        name: z.string().min(1, "Event name is required").optional(),
        description: z.string().min(1, "Event description is required").optional(),
        shortDescription: z.string().min(1, "Short description is required").optional(),
        uploadKey: z.string().min(1, "Upload key is required").optional(),
        type: z.nativeEnum(EventType).optional(),
        day: z.nativeEnum(Day).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      const newEvent = await ctx.db.events.update({
        where:{id: input.id},
        data: {
          name: input.name!,
          description: input.description!,
          shortDescription: input.shortDescription!,
          image: imageUrl,
          type: input.type!,
          day: input.day!,
        },
      });

      return newEvent;
    }),


  // Toggle event visibility between active and inactive
  updateEventVisibility: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Event ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.events.findUnique({
        where: { id: input.id },
      });

      if (!event) throw new Error("Event not found");

      const updatedEvent = await ctx.db.events.update({
        where: { id: input.id },
        data: {
          visibility: event.visibility === true ? false : true,
        },
      });

      return updatedEvent;
    }),

  // Delete an event by ID
  deleteEvent: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Event ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedEvent = await ctx.db.events.delete({
        where: { id: input.id },
      });
      return deletedEvent;
    }),

  // Get event by name
  getEventByName: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Event name is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.events.findFirst({
        where: { name: input.name },
      });

      if (!event) throw new Error("Event not found");

      return event;
    }),
});
