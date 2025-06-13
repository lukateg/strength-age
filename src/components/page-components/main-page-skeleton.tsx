import { Skeleton } from "@/components/ui/skeleton";

export default function MainPageSkeleton() {
  return (
    <div className="mx-auto container p-6 space-y-10">
      <Skeleton className="h-[55px] w-full" />
      <div className="space-y-6">
        <Skeleton className="h-[36px] w-[391px]" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}
