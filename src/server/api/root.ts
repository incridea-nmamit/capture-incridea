import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { teamRouter } from "./routers/team";
import { eventRouter } from "./routers/event";
import { galleryRouter } from "./routers/gallery";
import { downloadLogRouter } from "./routers/downloadlog";
import { removalRequestRouter } from "./routers/requests";
import { userRouter } from "./routers/user";
import { captureRouter } from "./routers/capturecard";
import { analyticsRouter } from "./routers/analytics";
import { variableRouter } from "./routers/variable";
import { viewerRouter } from "./routers/viewers";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  events: eventRouter,
  gallery: galleryRouter,
  analytics: analyticsRouter ,
  download: downloadLogRouter,
  request : removalRequestRouter,
  user: userRouter,
  capturecard: captureRouter,
  variable: variableRouter,
  viewer: viewerRouter,
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
