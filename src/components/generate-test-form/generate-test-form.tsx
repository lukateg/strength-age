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
import NotFound from "@/app/not-found";

import { testFormSchema, type testSchema } from "@/lib/schemas";

import { type z } from "zod";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "convex/_generated/api";

export type TestFormValues = z.infer<typeof testFormSchema>;
export type GeneratedTest = z.infer<typeof testSchema>;

export default function GenerateTestForm({ classId }: { classId?: string }) {
  const router = useRouter();
  const { generateAndUploadTest } = useTestMutations();
  const generateTestPageData = useAuthenticatedQueryWithStatus(
    api.pages.generateTestPage.getGenerateTestPageData
  );

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

  if (generateTestPageData.isPending) {
    return <div>Loading...</div>;
  }

  if (generateTestPageData.isError) {
    return <NotFound />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-8">
        <div className="grid gap-6">
          <BasicInformationView control={control} />

          <ClassSelection
            control={control}
            disabled={!!classId}
            classes={generateTestPageData.data?.classes}
          />

          <LessonSelectView
            control={control}
            classId={selectedClassId}
            lessons={generateTestPageData.data?.lessons}
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
