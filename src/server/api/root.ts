import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { teamRouter } from "./routers/team";
import { eventRouter } from "./routers/event";
import { capturesRouter } from "./routers/capture";
import { downloadLogRouter } from "./routers/downloadlog";
import { removalRequestRouter } from "./routers/requests";
import { userRouter } from "./routers/user";
import { capturecardRouter } from "./routers/capturecard";
import { analyticsRouter } from "./routers/analytics";
import { variableRouter } from "./routers/variable";
import { auditLog } from "./routers/auditlog";
import { verifiedEmail } from "./routers/verifiedemail";
import { likeRouter } from "./routers/like";
import { playbacksRouter } from "./routers/playbacks";
import { moreInfoRouter } from "./routers/moreinfo";
import { verficationRouter } from "./routers/verfications";
import { feedbackRouter } from "./routers/feedback";

export const appRouter = createTRPCRouter({
  team: teamRouter,
  events: eventRouter,
  capture: capturesRouter,
  analytics: analyticsRouter ,
  download: downloadLogRouter,
  request : removalRequestRouter,
  user: userRouter,
  capturecard: capturecardRouter,
  variables: variableRouter,
  audit: auditLog,
  verifiedEmail: verifiedEmail,
  like: likeRouter,
  playbacks :playbacksRouter,
  moreInfo:moreInfoRouter ,
  verfication:verficationRouter,
  feedback:feedbackRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
