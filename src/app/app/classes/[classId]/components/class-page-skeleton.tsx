import { Skeleton } from "@/components/ui/skeleton";

export default function ClassPageSkeleton() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <Skeleton className="h-[72px] w-[307px]" />
        <Skeleton className="h-[42px] w-[165px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-[114px] w-full" />
        ))}
      </div>

      <div defaultValue="recent" className="space-y-6">
        <Skeleton className="h-[40px] w-[400px]" />

        <div className="w-full">
          <Skeleton className="h-[304px] w-full" />
        </div>
      </div>
    </div>
  );
}
