import SelectFormItem from "@/components/select-form-item";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form";

import { type Control } from "react-hook-form";
import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../../convex/_generated/api";

export default function ClassSelection({
  control,
  disabled,
}: {
  control: Control<TestFormValues>;
  disabled?: boolean;
}) {
  const classes = useAuthenticatedQueryWithStatus(
    api.classes.getAllClassesByUserId
  );

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
              items={classes.data}
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
