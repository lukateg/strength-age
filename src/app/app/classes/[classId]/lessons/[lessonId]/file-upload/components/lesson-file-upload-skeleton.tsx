import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LessonFileUploadSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[56px] w-[350px]" />
      <Skeleton className="h-[140px] w-full" />
      <Skeleton className="h-[617px] w-full" />
    </div>
  );
}
