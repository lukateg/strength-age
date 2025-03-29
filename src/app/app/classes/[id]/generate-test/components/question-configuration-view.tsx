import { FormControl } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  type Control,
} from "react-hook-form";
import { type TestFormValues } from "../page";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Settings2, SplitSquareHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

const QUESTION_TYPES = [
  { id: "multiple_choice", label: "Multiple Choice" },
  { id: "true_false", label: "True/False" },
  // { id: "fill-blanks", label: "Fill in the Blanks" },
  { id: "short_answer", label: "Short Answer" },
  // { id: "mixed", label: "Mixed (AI-generated)" },
];

// Mock data for multiple lessons (replace with real data)
const SELECTED_LESSONS = [
  { id: 1, name: "Lesson 1", questions: 10 },
  { id: 2, name: "Lesson 2", questions: 10 },
  { id: 3, name: "Lesson 3", questions: 10 },
];

export default function QuestionConfigurationView({
  control,
  distribution,
  scope,
  questionAmount,
  register,
  watch,
  setValue,
}: {
  control: Control<TestFormValues>;
  distribution: string;
  scope: string;
  questionAmount: number;

  register: UseFormRegister<TestFormValues>;
  watch: UseFormWatch<TestFormValues>;
  setValue: UseFormSetValue<TestFormValues>;
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
        {renderQuestionConfiguration({
          scope,
          distribution,
          questionAmount,
          register,
          watch,
          setValue,
        })}
        {distribution === "equal" ? (
          <div className="space-y-4">
            <Label>Total Questions: {questionAmount}</Label>
            <Slider
              value={[questionAmount]}
              onValueChange={(value) =>
                setValue("questionAmount", value[0] ?? 0)
              }
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Each lesson will have{" "}
              {Math.floor(questionAmount / SELECTED_LESSONS.length)} questions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Questions per Lesson</Label>
            <div className="space-y-4">
              {SELECTED_LESSONS.map((lesson) => (
                <div
                  key={lesson.id}
                  className="grid grid-cols-2 gap-4 items-center"
                >
                  <Label>{lesson.name}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    {...register(`lessonQuestions.${lesson.id}`, {
                      valueAsNumber: true,
                    })}
                    className="w-24"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Total questions:{" "}
              {Object.values(watch("lessonQuestions")).reduce<number>(
                (a, b) => (typeof b === "number" ? a + b : a),
                0
              )}
            </p>
          </div>
        )}

        <FormField
          control={control}
          name="questionTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Types</FormLabel>
              <FormControl>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {QUESTION_TYPES.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={type.id}
                          checked={field.value?.includes(type.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, type.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== type.id
                                  )
                                );
                          }}
                        />
                        <label
                          htmlFor={type.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level: {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0] ?? 0)}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </FormControl>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Easy</span>
                <span>Medium</span>
                <span>Hard</span>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

const renderQuestionConfiguration = ({
  scope,
  distribution,
  setValue,
}: {
  scope: string;
  distribution: string;
  questionAmount: number;

  register: UseFormRegister<TestFormValues>;
  watch: UseFormWatch<TestFormValues>;
  setValue: UseFormSetValue<TestFormValues>;
}) => {
  if (scope === "multiple") {
    return (
      <>
        <div className="space-y-4 pb-6 border-b">
          <Label className="text-base">
            How do you want to distribute questions?
          </Label>
          <RadioGroup
            value={distribution}
            onValueChange={(value) =>
              setValue("distribution", value as "equal" | "custom")
            }
            className="grid gap-4"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="equal" id="equal" />
              <Label htmlFor="equal" className="flex items-center gap-2">
                <SplitSquareHorizontal className="h-4 w-4" />
                Equal per lesson
                <span className="text-sm text-muted-foreground">
                  (30 questions across 3 lessons → 10 each)
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Custom per lesson
              </Label>
            </div>
          </RadioGroup>
        </div>
      </>
    );
  }
};
