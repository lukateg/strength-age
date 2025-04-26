"use client";

import { Button } from "@/components/ui/button";

import RedirectBackButton from "@/components/redirect-back-button";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

export default function ClassHeader({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
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
              <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {description}
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
