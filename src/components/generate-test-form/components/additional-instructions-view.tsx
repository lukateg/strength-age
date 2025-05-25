import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormLabel,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { type TestFormValues } from "../generate-test-form";
import { type Control } from "react-hook-form";

export default function AdditionalInstructionsView({
  control,
}: {
  control: Control<TestFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Instructions</CardTitle>
        <CardDescription>
          Set the additional instructions for your test
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="additionalInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="additional-instructions">
                Additional Instructions (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  id="additional-instructions"
                  placeholder="Enter additional instructions"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
