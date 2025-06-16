"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useTestMutations } from "@/hooks/use-test-mutations";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import LessonSelectView from "./components/lesson-select-view/lesson-select-view";
import ClassSelection from "./components/class-selection";
import QuestionConfigurationView from "./components/question-configuration-view/question-configuration-view";
import BasicInformationView from "./components/basic-information-view";
import AdditionalInstructionsView from "./components/additional-instructions-view";

import { testFormSchema, type testSchema } from "@/lib/schemas";

import { type z } from "zod";
import { type FunctionReturnType } from "convex/server";
import { type api } from "../../../convex/_generated/api";

export type TestFormValues = z.infer<typeof testFormSchema>;
export type GeneratedTest = z.infer<typeof testSchema>;

export default function GenerateTestForm({
  classId,
  generatePageData,
}: {
  classId?: string;
  generatePageData: FunctionReturnType<
    typeof api.pages.generateTestPage.getGenerateTestPageData
  >;
}) {
  const router = useRouter();
  const { generateAndUploadTest } = useTestMutations();

  const form = useForm<TestFormValues>({
    defaultValues: {
      testName: "",
      description: "",
      scope: "single",
      distribution: "equal",
      questionAmount: 10,
      difficulty: 50,
      additionalInstructions: "",
      classId: classId ?? "",
      questionTypes: [],
      lessons: [],
    },
    resolver: zodResolver(testFormSchema),
  });
  const { control, watch, handleSubmit } = form;

  const lessonsLength = watch("lessons").length;
  const selectedClassId = watch("classId");

  const onSubmit = async (formData: TestFormValues) => {
    void generateAndUploadTest(formData);
    router.push("/app/tests");
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-8">
        <div className="grid gap-6">
          <BasicInformationView control={control} />

          <ClassSelection
            control={control}
            disabled={!!classId}
            classes={generatePageData.classes}
          />

          <LessonSelectView
            control={control}
            classId={selectedClassId}
            lessons={generatePageData.lessons}
          />

          <QuestionConfigurationView
            control={control}
            lessonsLength={lessonsLength}
          />

          <AdditionalInstructionsView control={control} />

          <Button type="submit" size="lg" className="w-full">
            Generate Test
          </Button>
        </div>
      </form>
    </Form>
  );
}
