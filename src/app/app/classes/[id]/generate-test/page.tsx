"use client";

import { useClass } from "@/providers/class-context-provider";
import { useClasses } from "@/providers/classes-provider";

import GenerateTestForm from "@/components/generate-test-form/generate-test-form";
import { BookOpen } from "lucide-react";
import RedirectBackButton from "@/components/redirect-back-button";
import { ArrowLeft } from "lucide-react";

export default function GenerateTestPage() {
  // TODO: refactor this to use classId from the url and use classes from the query inside of the generate test form
  const { classId } = useClass();
  const { classes } = useClasses();

  return <GenerateTestForm classes={classes} classId={classId} />;
}
