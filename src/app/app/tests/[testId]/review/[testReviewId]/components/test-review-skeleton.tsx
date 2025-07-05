import { Skeleton } from "@/components/ui/skeleton";

export default function TestReviewSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="w-[236px] h-[56px]" />

        <Skeleton className="h-[42px] w-[209px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[335px] w-full" />

        <Skeleton className="h-[335px] w-full md:w-1/2" />
      </div>

      <Skeleton className="h-[335px] w-full" />
    </>
  );
}
