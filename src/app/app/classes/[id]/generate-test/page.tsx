"use client";

import { useClass } from "@/providers/class-context-provider";
import { useClasses } from "@/providers/classes-provider";

import GenerateTestForm from "@/components/generate-test-form/generate-test-form";

export default function GenerateTestPage() {
  const { classId } = useClass();
  const { classes } = useClasses();

  return (
    <div className="container mx-auto py-8 px-4">
      <GenerateTestForm classes={classes} classId={classId} />
    </div>
  );
}
