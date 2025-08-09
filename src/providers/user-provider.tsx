"use client";

import { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";
import {
  type QueryStatus,
  useAuthenticatedQueryWithStatus,
} from "@/hooks/use-authenticated-query";

interface UserContextType {
  user: QueryStatus<typeof api.users.getCurrentUserByClerkIdQuery>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userData = useAuthenticatedQueryWithStatus(
    api.users.getCurrentUserByClerkIdQuery
  );
  return (
    <UserContext.Provider
      value={{
        user: userData,
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
