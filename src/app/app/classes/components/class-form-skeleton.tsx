import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassFormSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-10">
      <Skeleton className="h-[56px] w-64  "></Skeleton>
      <Skeleton className="w-full h-[362px] "></Skeleton>
    </div>
  );
}
