import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { teamRouter } from "./routers/team";
import { eventRouter } from "./routers/event";
import { galleryRouter } from "./routers/gallery";
import { webRouter } from "./routers/web";
import { downloadLogRouter } from "./routers/downloadlog";
import { removalRequestRouter } from "./routers/removalrequest";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  events: eventRouter,
  gallery: galleryRouter,
  web: webRouter,
  download: downloadLogRouter,
  removalrequest : removalRequestRouter 
});


// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
