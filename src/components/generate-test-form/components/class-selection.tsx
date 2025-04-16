import SelectFormItem from "@/components/select-form-item";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form";

import { type Doc } from "convex/_generated/dataModel";
import { type Control } from "react-hook-form";
import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";

export default function ClassSelection({
  control,
  classes,
  disabled,
}: {
  control: Control<TestFormValues>;
  classes?: Doc<"classes">[] | null;
  disabled?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Selection</CardTitle>
        <CardDescription>Select the class for your test</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="classId"
          render={({ field }) => (
            <SelectFormItem
              {...field}
              items={classes}
              label="Class"
              placeholder="Select a class"
              defaultValue="none"
              onChange={field.onChange}
              description="You can create a test only for a specific class."
              disabled={disabled}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
