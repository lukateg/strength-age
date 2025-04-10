import { FormControl } from "./ui/form";

import { type Control, type FieldValues } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FormField, FormLabel } from "./ui/form";
import { FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function BasicInformationView({
  control,
}: {
  control: Control<{
    testName: string;
    description: string;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Set the basic details for your test</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="testName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="test-name">Test Name (optional)</FormLabel>
              <FormControl>
                <Input
                  id="test-name"
                  placeholder="Enter test name or let AI generate one"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="test-description">
                Description (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  id="test-description"
                  placeholder="Add a description to help organize your tests"
                  className="resize-none"
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
