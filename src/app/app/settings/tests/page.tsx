"use client";

import { api } from "../../../../../convex/_generated/api";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import SharingSettingsCard from "./components/sharing-settings-card";
import QueryState from "@/components/data-query/query-state";
import SettingsPageSkeleton from "../components/settings-page-skeleton";

export default function TestsPage() {
  const testSettingsData = useAuthenticatedQueryWithStatus(
    api.pages.settingsPage.getTestSettingsPageData
  );

  return (
    <QueryState query={testSettingsData} pending={<SettingsPageSkeleton />}>
      {(data) => {
        const { userPreferences } = data;

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Test Settings</h1>
              <p className="text-muted-foreground mt-2">
                Configure how your tests behave and are shared
              </p>
            </div>

            <SharingSettingsCard
              shouldTestReviewLinksExpire={
                userPreferences?.shouldTestReviewLinksExpire
              }
            />
          </div>
        );
      }}
    </QueryState>
  );
}
