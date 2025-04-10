import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DifficultyLevelSection from "./difficulty-level-section";
import TotalQuestionsSection from "./total-questions-section";
import QuestionDistributionSection from "./question-distribution-section";
import QuestionTypesSection from "./question-types-section";

import { type TestFormValues } from "../../page";
import { type Control } from "react-hook-form";

export default function QuestionConfigurationView({
  control,
  lessonsLength,
}: {
  control: Control<TestFormValues>;
  lessonsLength: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Configuration</CardTitle>
        <CardDescription>
          Configure the number and types of questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {lessonsLength > 1 && <QuestionDistributionSection control={control} />}

        <TotalQuestionsSection
          control={control}
          lessonsLength={lessonsLength}
        />

        <QuestionTypesSection control={control} />

        <DifficultyLevelSection control={control} />
      </CardContent>
    </Card>
  );
}
