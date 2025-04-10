import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Control } from "react-hook-form";
import { type TestFormValues } from "../generate-test-form";

export default function BasicInformationView({
  control,
}: {
  control: Control<TestFormValues>;
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
