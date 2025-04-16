"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../../../../convex/_generated/api";
import { useQuery } from "convex/react";

import RedirectBackButton from "@/components/redirect-back-button";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

import { type Id } from "convex/_generated/dataModel";

export default function ClassHeader({ id }: { id: Id<"classes"> }) {
  const classData = useQuery(api.classes.getClassById, { id });

  if (!classData) {
    return <Skeleton className="h-16 w-full" />;
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
              <h1 className="text-2xl font-bold">{classData.title}</h1>
            </div>
            <p className="text-muted-foreground">{classData.description}</p>
          </div>
        </div>

        <FeatureFlagTooltip>
          <Button disabled>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Class
          </Button>
        </FeatureFlagTooltip>
      </div>
    </div>
  );
}
