import { ConvexError } from "convex/values";
import { auth } from "@clerk/nextjs/server";

export async function getConvexToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });

  if (!token) {
    throw new ConvexError({ message: "No Convex token available" });
  }

  return token;
}

export async function getConvexTokenOrNull(): Promise<string | null> {
  const { getToken } = await auth();
  return await getToken({ template: "convex" });
}
