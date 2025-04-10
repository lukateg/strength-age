import { FormField, FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

import { type Control } from "react-hook-form";
import { type TestFormValues } from "../../generate-test-form";

export default function DifficultyLevelSection({
  control,
}: {
  control: Control<TestFormValues>;
}) {
  return (
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
  );
}
