"use client";

import { ClassProvider } from "@/providers/class-context-provider";

import ClassHeader from "./components/class-header";

import { type Id } from "convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "convex/_generated/api";
import { useParams } from "next/navigation";
import NotFound from "@/components/not-found";
interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: Id<"classes"> }>;
}

export default function ClassLayout({ children }: ClassLayoutProps) {
  const { id }: { id: Id<"classes"> } = useParams();

  const classData = useAuthenticatedQueryWithStatus(api.classes.getClassById, {
    id,
  });

  if (classData.isPending) {
    return (
      <div className="mx-auto container p-6 space-y-10">
        <Skeleton className="h-[55px] w-full " />
        <div className="space-y-6">
          <Skeleton className="h-[36px] w-[391px] " />
          <Skeleton className="h-56 w-full " />
        </div>
      </div>
    );
  }

  if (classData.isError) {
    return <NotFound />;
  }

  return (
    <ClassProvider classId={id}>
      <div className="mx-auto container p-6 space-y-10">
        <ClassHeader
          title={classData.data?.title}
          description={classData.data?.description}
        />
        {children}
      </div>
    </ClassProvider>
  );
}
