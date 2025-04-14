import { Textarea } from "@/components/ui/textarea";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import {
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { type TestQuestion } from "../page";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { type createAnswerSchema } from "@/lib/schemas";

export default function renderQuestion({
  question,
  index,
  startIndex,
  form,
}: {
  question: TestQuestion;
  index: number;
  startIndex: number;
  form: UseFormReturn<z.infer<ReturnType<typeof createAnswerSchema>>>;
}) {
  const globalIndex = startIndex + index;
  const fieldName = `question-${globalIndex}` as never;

  switch (question.questionType) {
    case "true_false":
      return (
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {question?.availableAnswers?.map((answer: string) => (
                      <div key={answer} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={answer}
                          id={`${globalIndex}-${answer}`}
                        />
                        <Label htmlFor={`${globalIndex}-${answer}`}>
                          {answer}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case "multiple_choice":
      return (
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    {question?.availableAnswers?.map((answer: string) => (
                      <div key={answer} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${globalIndex}-${answer}`}
                          checked={((field.value as string[]) || []).includes(
                            answer
                          )}
                          onCheckedChange={(checked) => {
                            const currentAnswers =
                              (field.value as string[]) || [];
                            const newAnswers = checked
                              ? [...currentAnswers, answer]
                              : currentAnswers.filter((a) => a !== answer);
                            field.onChange(newAnswers);
                          }}
                        />
                        <Label htmlFor={`${globalIndex}-${answer}`}>
                          {answer}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case "short_answer":
      return (
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type your answer here..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    default:
      return null;
  }
}
