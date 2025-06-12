import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="h-20 w-full mb-6" />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
