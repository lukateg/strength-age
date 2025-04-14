import { Skeleton } from "@/components/ui/skeleton";

export default function TestSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-20 w-1/2 mx-auto" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
