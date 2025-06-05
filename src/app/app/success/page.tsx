import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api } from "convex/_generated/api";
import { fetchAction } from "convex/nextjs";

export const dynamic = "force-dynamic";

const ConfirmStripeSessionComponent = async () => {
  const { userId, getToken } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  try {
    // Get the auth token from Clerk
    const token = await getToken({ template: "convex" });

    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    // Call the action with the auth token
    await fetchAction(api.stripe.triggerStripeSyncForUser, {}, { token });
  } catch (error) {
    console.error("Error triggering stripe sync for user", error);
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return redirect("/app");
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe_session_id: string | undefined }>;
}) {
  // Wait for searchParams to be available
  const { stripe_session_id } = await searchParams;
  console.log("[SUCCESS PAGE] Checkout session ID", stripe_session_id);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<div>One moment...</div>}>
        <ConfirmStripeSessionComponent />
      </Suspense>
    </div>
  );
}
