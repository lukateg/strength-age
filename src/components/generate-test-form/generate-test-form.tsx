"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useTestMutations } from "@/hooks/use-test-mutations";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLoadingContext } from "@/providers/loading-context";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import LessonSelectView from "./components/lesson-select-view/lesson-select-view";
import ClassSelection from "./components/class-selection";
import QuestionConfigurationView from "./components/question-configuration-view/question-configuration-view";
import BasicInformationView from "./components/basic-information-view";

import { testFormSchema, type testSchema } from "@/lib/schemas";
import { generateTest } from "@/server/test-actions";

import { type z } from "zod";
import AdditionalInstructionsView from "./components/additional-instructions-view";

export type TestFormValues = z.infer<typeof testFormSchema>;
export type GeneratedTest = z.infer<typeof testSchema>;

export default function GenerateTestForm({ classId }: { classId?: string }) {
  const router = useRouter();
  const { createTest } = useTestMutations();
  const { setLoading } = useLoadingContext();

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
    setLoading(true, "Generating test...");
    try {
      const generatedTest = await generateTest(formData);
      const testId = await createTest({
        ...generatedTest,
        classId: formData.classId,
      });
      router.replace(`/app/tests/${testId}`);
    } catch (error) {
      let errorMessage = "An unknown error occurred. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-8">
        <div className="grid gap-6">
          <BasicInformationView control={control} />

          <ClassSelection control={control} disabled={!!classId} />

          <LessonSelectView classId={selectedClassId} control={control} />

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
