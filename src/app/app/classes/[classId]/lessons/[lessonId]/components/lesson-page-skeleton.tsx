import { Skeleton } from "@/components/ui/skeleton";

export default function LessonPageSkeleton() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <Skeleton className="h-[72px] w-[307px]" />
        <Skeleton className="h-[42px] w-[165px]" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-[40px] w-[290px]" />

        <Skeleton className="h-[304px] w-full" />
      </div>
    </div>
  );
}
