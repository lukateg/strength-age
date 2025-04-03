import { type LessonsType } from "@/types/types";
import { type Control } from "react-hook-form";
import { type TestFormValues } from "../page";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import LessonSelectTable from "./lesson-select-table";

export type Lesson = {
  _id: string;
  title: string;
};

export function LessonSelectView({
  lessons,
  control,
}: {
  lessons?: LessonsType[];
  control: Control<TestFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lessons Selection</CardTitle>
        <CardDescription>
          Select the lessons you want to include in the test
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="lessons"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LessonSelectTable lessons={lessons} field={field} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
