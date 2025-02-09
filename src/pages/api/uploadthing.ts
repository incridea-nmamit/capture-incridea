/**
 * UploadThing API Configuration
 * Sets up file upload route handler with logging
 */

import { createRouteHandler } from "uploadthing/next-legacy";
import { ourFileRouter } from "~/server/uploadthing";

export default createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: "All"
  }
});
