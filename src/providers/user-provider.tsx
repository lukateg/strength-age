"use client";

import { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";
import { type Doc } from "../../convex/_generated/dataModel";
import {
  type QueryStatus,
  useAuthenticatedQueryWithStatus,
} from "@/hooks/use-authenticated-query";
import { hasPermission, type Permissions } from "../shared/abac";

interface UserContextType {
  user: Doc<"users"> | null;
  isLoading: boolean;
  can: <Resource extends keyof Permissions>(
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
  ) => boolean;
  userStorageUsage: QueryStatus<typeof api.materials.getTotalSizeOfPdfsByUser>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userQuery = useAuthenticatedQueryWithStatus(
    api.users.getCurrentUserQuery
  );
  const user = userQuery.data ?? null;

  const userStorageUsage = useAuthenticatedQueryWithStatus(
    api.materials.getTotalSizeOfPdfsByUser
  );

  const can = <Resource extends keyof Permissions>(
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
  ) => {
    if (!user) return false;
    return hasPermission(user, resource, action, data);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: userQuery.status === "pending",
        can,
        userStorageUsage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
