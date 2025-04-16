// import { useUser } from "@clerk/nextjs";
// import {
//     type OptionalRestArgsOrSkip,
//     useQuery,
// } from "convex/react";
// import { type FunctionReference } from "convex/server";

//   /**
//    * A wrapper around useQuery that automatically handles authentication state.
//    * If the user is not authenticated, the query is skipped.
//    */
// export function useAuthenticatedQuery<
//   Query extends FunctionReference<"query">
// >(query: Query, ...args: OptionalRestArgsOrSkip<Query>): Query["_returnType"] | undefined {
//   const { user } = useUser(); // Clerk provides the logged-in user
//   const isAuthenticated = !!user;

//   return useQuery(query, isAuthenticated ? args : "skip");
// }
