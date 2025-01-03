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
import { smcRouter } from "./routers/smc";
import { storycatRouter } from "./routers/storycat";
import { storiesRouter } from "./routers/stories";
import { auditLog } from "./routers/auditlog";
import { verifiedEmail } from "./routers/verifiedemail";

export const appRouter = createTRPCRouter({
  team: teamRouter,
  events: eventRouter,
  gallery: galleryRouter,
  analytics: analyticsRouter ,
  download: downloadLogRouter,
  request : removalRequestRouter,
  user: userRouter,
  capturecard: captureRouter,
  variables: variableRouter,
  smc: smcRouter,
  stories: storiesRouter,
  storycat: storycatRouter,
  audit: auditLog,
  verifiedEmail: verifiedEmail
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
