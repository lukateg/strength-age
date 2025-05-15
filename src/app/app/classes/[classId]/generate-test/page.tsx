"use client";

import { useClass } from "@/providers/class-context-provider";

import GenerateTestForm from "@/components/generate-test-form/generate-test-form";

export default function GenerateTestPage() {
  // TODO: refactor this to use classId from the url and use classes from the query inside of the generate test form
  const { classId } = useClass();

  return <GenerateTestForm classId={classId} />;
}
