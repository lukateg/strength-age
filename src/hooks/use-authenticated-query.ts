import { makeUseQueryWithStatus } from "convex-helpers/react";
import { extractErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

import { useQueries } from "convex-helpers/react/cache/hooks";
import { useConvexAuth } from "convex/react";

import { type OptionalRestArgsOrSkip } from "convex/react";
import { type FunctionReference, type FunctionReturnType } from "convex/server";
export type QueryStatus<Query extends FunctionReference<"query">> =
  | {
      status: "success";
      data: FunctionReturnType<Query>;
      error: undefined;
      isSuccess: true;
      isPending: false;
      isError: false;
    }
  | {
      status: "pending";
      data: undefined;
      error: undefined;
      isSuccess: false;
      isPending: true;
      isError: false;
    }
  | {
      status: "error";
      data: undefined;
      error: Error;
      isSuccess: false;
      isPending: false;
      isError: true;
    };

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);

export function useAuthenticatedQueryWithStatus<
  Query extends FunctionReference<"query">,
>(query: Query, args?: OptionalRestArgsOrSkip<Query>[0] | "skip") {
  const { isAuthenticated } = useConvexAuth();
  const queryResult = useQueryWithStatus(
    query,
    isAuthenticated ? args : "skip"
  );

  if (queryResult.status === "error") {
    const errorMessage = extractErrorMessage(queryResult.error);
    toast.error(errorMessage);
  }

  return queryResult;
}
