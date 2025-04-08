import { type Control } from "react-hook-form";
import { type TestFormValues } from "../../page";
import { FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { FormControl } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
export default function TotalQuestionsSection({
  control,
  lessonsLength,
}: {
  control: Control<TestFormValues>;
  lessonsLength: number;
}) {
  return (
    <FormField
      control={control}
      name="questionAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Total Questions: {field.value}</FormLabel>
          <FormControl>
            <Slider
              value={[field.value]}
              onValueChange={(value) => field.onChange(value[0] ?? 0)}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </FormControl>
          {!!lessonsLength && (
            <p className="text-sm text-muted-foreground">
              Each lesson will have {Math.floor(field.value / lessonsLength)}{" "}
              questions
            </p>
          )}
        </FormItem>
      )}
    />
  );
}
