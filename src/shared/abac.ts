import { Doc } from "convex/_generated/dataModel";

export const hasPermission = (
  user: Doc<"users">,
  resource: string,
  action: string,
  data?: Record<string, unknown>
) => {
  return true;
};
