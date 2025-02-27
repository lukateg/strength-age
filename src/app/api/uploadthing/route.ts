import { createRouteHandler } from "uploadthing/next";

import { pdfFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: pdfFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
