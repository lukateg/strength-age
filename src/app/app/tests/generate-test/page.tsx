"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

import GenerateTestForm from "@/components/generate-test-form/generate-test-form";

export default function GenerateTestPage() {
  const classes = useQuery(api.classes.getAllClasses);

  return (
    <div className="container mx-auto py-8 px-4">
      <GenerateTestForm classes={classes} />
    </div>
  );
}
