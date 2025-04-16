import { Skeleton } from "@/components/ui/skeleton";

export default function TestReviewSkeleton() {
  return (
    <>
      <div className="flex items-center">
        <Skeleton className="h-20 w-full" />
      </div>

      <div>
        <Skeleton className="h-96 w-full" />
      </div>
    </>
  );
}
