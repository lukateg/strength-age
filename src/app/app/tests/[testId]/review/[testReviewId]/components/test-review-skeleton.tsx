import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestReviewSkeleton() {
  return (
    <>
      <div className="flex items-center">
        <Skeleton className="h-20 w-full" />
      </div>

      <Card>
        <Skeleton className="h-96 w-full" />
      </Card>
    </>
  );
}
