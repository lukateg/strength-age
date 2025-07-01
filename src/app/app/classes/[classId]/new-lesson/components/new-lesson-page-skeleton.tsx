import { Skeleton } from "@/components/ui/skeleton";

export default function NewLessonPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[56px] w-[350px]" />
      <Skeleton className="h-[364px] w-full" />
    </div>
  );
}
