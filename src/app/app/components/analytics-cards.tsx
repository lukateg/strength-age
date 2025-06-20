import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalyticsCardsProps {
  storageUsed: number;
  maxStorage: number;
  successRate: number;
}

export function AnalyticsCards({
  storageUsed,
  maxStorage,
  successRate,
}: AnalyticsCardsProps) {
  // Convert bytes to MB for display
  const storageUsedMB = Math.round(storageUsed / (1024 * 1024));
  const maxStorageMB = Math.round(maxStorage / (1024 * 1024));
  const storagePercentage = (storageUsedMB / maxStorageMB) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="stroke-muted"
                  fill="none"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                />
                {/* Progress circle */}
                <circle
                  className="stroke-primary transition-all duration-300 ease-in-out"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(storagePercentage * 251.2) / 100} 251.2`}
                  transform="rotate(-90 50 50)"
                  cx="50"
                  cy="50"
                  r="40"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{storageUsedMB}MB</span>
                <span className="text-xs text-muted-foreground">
                  of {maxStorageMB}MB
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="stroke-muted"
                  fill="none"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                />
                {/* Progress circle */}
                <circle
                  className="stroke-primary transition-all duration-300 ease-in-out"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(successRate * 251.2) / 100} 251.2`}
                  transform="rotate(-90 50 50)"
                  cx="50"
                  cy="50"
                  r="40"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{successRate}%</span>
                <span className="text-xs text-muted-foreground">
                  Success Rate
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
