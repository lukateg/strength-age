import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-4 items-center justify-between mb-4">
        <Skeleton className="h-[72px] w-[266px]" />
        <Skeleton className="h-[40px] w-[192px]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
