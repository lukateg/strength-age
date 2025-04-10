"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useTestMutations } from "@/hooks/use-test-mutation";
import { useClass } from "@/providers/class-context-provider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLoadingContext } from "@/providers/loading-context";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LessonSelectView } from "./components/lesson-select-view/lesson-select-view";

import QuestionConfigurationView from "./components/question-configuration-view/question-configuration-view";
import BasicInformationView from "./components/basic-information-view";

import { type z } from "zod";
import { testFormSchema, type testSchema } from "@/lib/schemas";

export type TestFormValues = z.infer<typeof testFormSchema>;
export type GeneratedTest = z.infer<typeof testSchema>;

export default function CreateTest() {
  const { lessons, classId } = useClass();
  const { createTest } = useTestMutations();
  const router = useRouter();
  const { setLoading } = useLoadingContext();

  const form = useForm<TestFormValues>({
    defaultValues: {
      testName: "",
      description: "",
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
    resolver: zodResolver(testFormSchema),
  });

  const { control, watch, handleSubmit } = form;

  const lessonsLength = watch("lessons").length;

  const onSubmit = async (formData: TestFormValues) => {
    setLoading(true, "Generating test...");
    const isSingleLesson = formData.lessons.length === 1;
    const endpoint = isSingleLesson
      ? "/api/generateTestFromLesson"
      : "/api/generateTestFromLessons";

    const requestBody = {
      lessonIds: formData.lessons,
      questionAmount: formData.questionAmount,
      questionTypes: formData.questionTypes,
      difficulty: formData.difficulty,
      ...(isSingleLesson
        ? {}
        : { questionDistribution: formData.distribution }),
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const { response: generatedTest } = (await response.json()) as {
        response: GeneratedTest;
      };

      const testId = await createTest({
        ...generatedTest,
        classId,
      });
      router.push(`/app/tests/${testId}`);
    } catch (error) {
      console.error("Error generating test:", error);
      // TODO: Add proper error handling/user feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-8">
          <div className="grid gap-6">
            <BasicInformationView control={control} />

            <LessonSelectView lessons={lessons} control={control} />

            <QuestionConfigurationView
              control={control}
              lessonsLength={lessonsLength}
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
