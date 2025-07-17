import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

import type { WebhookEvent } from "@clerk/backend";

import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created": // intentional fallthrough
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("[STRIPE WEBHOOK ROUTE] Received webhook request");

    const signature = request.headers.get("stripe-signature");
    const payload = await request.text();

    if (!signature) {
      console.log("[STRIPE WEBHOOK ROUTE] Missing signature");
      return new Response("No signature", { status: 400 });
    }

    console.log("[STRIPE WEBHOOK ROUTE] Calling internal handler");

    try {
      // Call an internal action to handle the Stripe logic
      const result = await ctx.runAction(internal.stripe.handleStripeWebhook, {
        signature,
        payload,
      });

      // Check if result is a Response object
      if (result instanceof Response) {
        console.log("[STRIPE WEBHOOK ROUTE] Got Response object from handler");
        return result;
      }

      // Otherwise check success property
      if (result.success) {
        console.log("[STRIPE WEBHOOK ROUTE] Successfully processed webhook");
        return new Response(null, { status: 200 });
      } else {
        console.log("[STRIPE WEBHOOK ROUTE] Failed to process webhook");
        return new Response("Error processing event", { status: 400 });
      }
    } catch (err) {
      console.error("[STRIPE WEBHOOK ROUTE] Error handling webhook:", err);
      return new Response("Internal server error", { status: 500 });
    }
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
