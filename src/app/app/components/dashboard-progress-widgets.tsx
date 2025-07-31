import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CircularProgress from "@/components/progress-components/circular-progress";
import { AlertTriangle } from "lucide-react";

import { LIMITATIONS } from "../../../lib/limitations";
import { type Doc } from "convex/_generated/dataModel";
import { formatTokenUsageNumber } from "@/lib/utils";

export default function DashboardProgress({
  totalStorageUsage,
  tokensUsedThisMonth,
  subscriptionTier,
}: {
  totalStorageUsage: number;
  tokensUsedThisMonth: number;
  subscriptionTier: Doc<"users">["subscriptionTier"];
}) {
  const storageLimit = LIMITATIONS[subscriptionTier].materials;
  const tokensLimit = LIMITATIONS[subscriptionTier].tokens;

  const rawPercentageStorageUsed =
    ((totalStorageUsage ?? 0) / storageLimit) * 100;
  const rawPercentageTokensUsed =
    ((tokensUsedThisMonth ?? 0) / tokensLimit) * 100;

  // Cap percentages at 100%
  const percentageStorageUsed = Math.min(rawPercentageStorageUsed, 100);
  const percentageTokensUsed = Math.min(rawPercentageTokensUsed, 100);

  // Check if limits are exceeded
  const isStorageMaxed = rawPercentageStorageUsed >= 100;
  const isTokensMaxed = rawPercentageTokensUsed >= 100;

  const formatStorageUsage = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${Math.round(mb * 10) / 10} MB`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full h-full">
      <Card className="relative">
        {isStorageMaxed && (
          <div className="absolute top-1 right-1 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded-md text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              <span>Limit Reached</span>
            </div>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Storage Used</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-center flex-1">
          <div className="flex flex-col items-start justify-center w-full">
            <div className="flex flex-col items-center justify-center w-full">
              <CircularProgress
                value={percentageStorageUsed}
                isColored={true}
                order="descending"
              />
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <span className="mt-2 text-muted-foreground text-sm">
                Storage Used:{" "}
                <span
                  className={`font-bold ${isStorageMaxed ? "text-warning" : "text-primary"}`}
                >
                  {formatStorageUsage(
                    isStorageMaxed ? storageLimit : totalStorageUsage
                  )}
                </span>
              </span>
              <span className="mt-2 text-muted-foreground text-sm">
                Max Storage:{" "}
                <span className="font-bold text-primary">
                  {formatStorageUsage(storageLimit)}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        {isTokensMaxed && (
          <div className="absolute top-1 right-1 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded-md text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              <span>Limit Reached</span>
            </div>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg">Monthly Tokens Used</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-center">
          <div className="flex flex-col items-start justify-center w-full">
            <div className="flex flex-col items-center justify-center w-full">
              <CircularProgress
                value={percentageTokensUsed}
                isColored={true}
                order="descending"
              />
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <span className="mt-2 text-muted-foreground text-sm">
                Tokens Used:{" "}
                <span
                  className={`font-bold ${isTokensMaxed ? "text-warning" : "text-primary"}`}
                >
                  {formatTokenUsageNumber(
                    isTokensMaxed ? tokensLimit : tokensUsedThisMonth
                  )}
                </span>
              </span>
              <span className="mt-2 text-muted-foreground text-sm">
                Max Tokens:{" "}
                <span className="font-bold text-primary">
                  {formatTokenUsageNumber(tokensLimit)}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
