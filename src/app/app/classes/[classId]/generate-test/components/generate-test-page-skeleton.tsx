import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function GenerateTestPageSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-[56px] w-[350px]" />
      <div className="space-y-6">
        <Skeleton className="h-[323px] w-full" />
        <Skeleton className="h-[223px] w-full" />
      </div>
    </div>
  );
}
