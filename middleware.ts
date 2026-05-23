import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// queste due rotte sono quelle pubbliche
// tutte le altre no
const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/about",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const isAdminUser = auth().userId === process.env.ADMIN_USER_ID;

  if (isAdminRoute(request) && !isAdminUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicRoute(request)) {
    await auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
