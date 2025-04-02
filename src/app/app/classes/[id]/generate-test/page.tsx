"use client";

import { useTestMutations } from "@/hooks/use-test-mutation";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LessonSelectView } from "./components/lesson-select-view";
import { useClass } from "@/providers/class-context-provider";

import QuestionConfigurationView from "./components/question-configuration-view";
import TestScopeView from "./components/test-scope-view";
import BasicInformationView from "./components/basic-information-view";

import { type Id } from "convex/_generated/dataModel";
import { type z } from "zod";
import { type testSchema } from "@/lib/schemas";

export type TestFormValues = {
  testName: string;
  description: string;
  scope: "single" | "multiple" | "whole";
  distribution: "equal" | "custom";
  questionAmount: number;
  difficulty: number;
  questionTypes: string[];
  lessonQuestions: Record<string, number>;
  lessons: Id<"lessons">[];
};

export type testType = z.infer<typeof testSchema>;

export default function CreateTest() {
  const { lessons, classId } = useClass();
  const { createTest } = useTestMutations();
  const router = useRouter();

  const form = useForm<TestFormValues>({
    defaultValues: {
      scope: "single",
      distribution: "equal",
      questionAmount: 10,
      difficulty: 50,
      questionTypes: [],
      lessonQuestions: {
        "1": 10,
        "2": 10,
        "3": 10,
      },
      lessons: [],
    },
  });

  const { control, watch, setValue, handleSubmit, register } = form;

  const scope = watch("scope");
  const distribution = watch("distribution");
  const questionAmount = watch("questionAmount");
  // const difficulty = watch("difficulty");

  const onSubmit = async (formData: TestFormValues) => {
    // console.log(formData, "form data");
    if (formData.lessons.length === 1) {
      const response = await fetch("/api/generateTest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonIds: formData.lessons,
          questionAmount: formData.questionAmount,
          questionTypes: formData.questionTypes,
          difficulty: formData.difficulty,
        }),
      });

      // TODO: add schema type
      const data = (await response.json()) as { response: testType };
      console.log("Generated Test:", data);
    }
    if (formData.lessons.length > 1) {
      // TODO: add type safety when calling the api
      const response = await fetch("/api/generateTestFromLessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonIds: formData.lessons,
          questionAmount: formData.questionAmount,
          questionTypes: formData.questionTypes,
          difficulty: formData.difficulty,
          distribution: formData.distribution,
        }),
      });
      const data = (await response.json()) as { response: testType };
      console.log("Generated Test:", data);
    }

    // const testId = await createTest({
    //   ...data.response,
    //   classId,
    // });

    // router.push(`/app/tests/${testId}`);
    // console.log("Test ID:", testId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-8">
          <div className="grid gap-6">
            <BasicInformationView control={control} />

            <TestScopeView scope={scope} setValue={setValue} />

            <LessonSelectView lessons={lessons} control={control} />

            <QuestionConfigurationView
              control={control}
              scope={scope}
              distribution={distribution}
              questionAmount={questionAmount}
              register={register}
              watch={watch}
              setValue={setValue}
            />

            <Button type="submit" size="lg" className="w-full">
              Generate Test
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
