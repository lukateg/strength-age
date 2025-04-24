"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../../../../convex/_generated/api";

import RedirectBackButton from "@/components/redirect-back-button";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

import { type Id } from "convex/_generated/dataModel";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

export default function ClassHeader({ id }: { id: Id<"classes"> }) {
  const classData = useAuthenticatedQueryWithStatus(api.classes.getClassById, {
    id,
  });

  if (classData.isPending) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (classData.isError) {
    return <div>Failed to load class title</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className=" flex items-center gap-4">
          <RedirectBackButton>
            <ArrowLeft className="h-6 w-6" />
          </RedirectBackButton>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold">
                {classData.data?.title}
              </h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {classData.data?.description}
            </p>
          </div>
        </div>

        <FeatureFlagTooltip>
          <Button disabled className="text-xs md:text-base">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Class
          </Button>
        </FeatureFlagTooltip>
      </div>
    </div>
  );
}
