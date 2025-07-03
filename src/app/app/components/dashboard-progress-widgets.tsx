import { useUserContext } from "@/providers/user-provider";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CircularProgress from "@/components/progress-components/circular-progress";

import { LIMITATIONS } from "../../../lib/limitations";

export default function DashboardProgress({
  globalSuccessRate,
  totalTestReviews,
}: {
  globalSuccessRate: number;
  totalTestReviews: number;
}) {
  const { user } = useUserContext();

  const storageUsed = user?.data?.totalStorageUsage;
  const storageLimit =
    LIMITATIONS[user?.data?.subscriptionTier ?? "free"].materials;
  const percentageStorageUsed = ((storageUsed ?? 0) / storageLimit) * 100;

  const formatStorageUsage = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${Math.round(mb * 10) / 10}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full h-full">
      <Card className="">
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
                <span className="font-bold text-primary">
                  {formatStorageUsage(storageUsed ?? 0)}MB
                </span>
              </span>
              <span className="mt-2 text-muted-foreground text-sm">
                Max Storage:{" "}
                <span className="font-bold text-primary">
                  {formatStorageUsage(storageLimit)} MB
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg">Global Test Success</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-center">
          <div className="flex flex-col items-start justify-center w-full">
            <div className="flex flex-col items-center justify-center w-full">
              <CircularProgress
                value={globalSuccessRate}
                isColored={true}
                order="ascending"
              />
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <span className="mt-2 text-muted-foreground text-sm">
                Total attempts:{" "}
                <span className="font-bold text-primary">
                  {totalTestReviews}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
