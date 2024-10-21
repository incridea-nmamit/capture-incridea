import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { State, EventType, Day } from "@prisma/client";

export const eventRouter = createTRPCRouter({
  // Get all events
  getAllEvents: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.events.findMany({});
    return events ?? [];
  }),

  // Add a new event
  addEvent: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Event name is required"),
        description: z.string().min(1, "Event description is required"),
        uploadKey: z.string().min(1, "Upload key is required"),
        type: z.nativeEnum(EventType),
        day: z.nativeEnum(Day),
        visibility: z.nativeEnum(State).default("active"), // Defaults to active
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.uploadKey}`;
      const newEvent = await ctx.db.events.create({
        data: {
          name: input.name,
          description: input.description,
          image: imageUrl,
          type: input.type,
          day: input.day,
          visibility: input.visibility,
        },
      });

      return newEvent;
    }),

  // Update event visibility (toggle between active and inactive)
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

    if (!event) {
      throw new Error("Event not found");
    }

    const updatedEvent = await ctx.db.events.update({
      where: { id: input.id },
      data: {
        visibility: event.visibility === "active" ? "inactive" : "active",
      },
    });

    return updatedEvent;
  }),
  // Delete an event
  deleteEvent: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Event ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.events.delete({
        where: { id: input.id },
      });

      return { message: "Event deleted successfully" };
    }),
});
