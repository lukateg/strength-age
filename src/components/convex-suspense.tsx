"use client";
import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // or your preferred loader

interface ConvexSuspenseProps<T> {
  data: T | undefined;
  children: (data: T) => ReactNode;
  fallback?: ReactNode;
}

export function ConvexSuspense<T>({
  data,
  children,
  fallback = <Skeleton className="h-8 w-full" />,
}: ConvexSuspenseProps<T>) {
  if (data === undefined) {
    return fallback;
  }

  return <>{children(data)}</>;
}
