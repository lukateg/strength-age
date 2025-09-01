// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const protectedRoute = createRouteMatcher(["/app(.*)"]);
// const publicRoute = createRouteMatcher(["/"]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();
//   if (userId && publicRoute(req)) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/app";

//     return NextResponse.redirect(url);
//   }

//   if (!userId && protectedRoute(req)) {
//     return redirectToSignIn();
//   }

//   // Add X-Robots-Tag header for protected routes to prevent indexing
//   if (protectedRoute(req)) {
//     const response = NextResponse.next();
//     response.headers.set(
//       "X-Robots-Tag",
//       "noindex, nofollow, noarchive, nosnippet"
//     );
//     return response;
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
