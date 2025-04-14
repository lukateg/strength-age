"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

import GenerateTestForm from "@/components/generate-test-form/generate-test-form";
import { ArrowLeft } from "lucide-react";
import { BookOpen } from "lucide-react";
import RedirectBackButton from "@/components/redirect-back-button";

export default function GenerateTestPage() {
  const classes = useQuery(api.classes.getAllClasses);

  return (
    <>
      <div className="flex items-center gap-4">
        <RedirectBackButton>
          <ArrowLeft className="h-6 w-6" />
        </RedirectBackButton>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Generate Test</h1>
          </div>
          <p className="text-muted-foreground">
            Create test from existing classes and materials
          </p>
        </div>
      </div>

      <GenerateTestForm classes={classes} />
    </>
  );
}
