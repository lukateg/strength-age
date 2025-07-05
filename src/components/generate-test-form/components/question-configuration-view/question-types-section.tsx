import { FormField, FormItem } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { type Control } from "react-hook-form";
import { type TestFormValues } from "../../generate-test-form";

type QuestionType = {
  id: "multiple_choice" | "true_false" | "short_answer";
  label: string;
};

const QUESTION_TYPES: QuestionType[] = [
  { id: "multiple_choice", label: "Multiple Choice" },
  { id: "true_false", label: "True/False" },
  { id: "short_answer", label: "Short Answer" },
];

export default function QuestionTypesSection({
  control,
}: {
  control: Control<TestFormValues>;
}) {
  return (
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
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={field.value?.includes(type.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, type.id])
                          : field.onChange(
                              field.value?.filter((value) => value !== type.id)
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
