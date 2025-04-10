import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

import { type Control } from "react-hook-form";
import { type TestFormValues } from "../../generate-test-form";

import { Settings2, SplitSquareHorizontal } from "lucide-react";

export default function QuestionDistributionSection({
  control,
}: {
  control: Control<TestFormValues>;
}) {
  return (
    <FormField
      control={control}
      name="distribution"
      render={({ field }) => (
        <FormItem className="space-y-4 pb-6 border-b">
          <FormLabel className="text-base">
            How do you want to distribute questions?
          </FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
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
                <RadioGroupItem value="proportional" id="proportional" />
                <Label
                  htmlFor="proportional"
                  className="flex items-center gap-2"
                >
                  <Settings2 className="h-4 w-4" />
                  Proportional per lesson
                  <span className="text-sm text-muted-foreground">
                    (let AI decide how many questions per lesson)
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
