import LessonSelectTable from "./lesson-select-table";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { type Control } from "react-hook-form";
import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";
import { type LessonsType } from "@/types/types";

export default function LessonSelectView({
  control,
  classId,
  lessons,
}: {
  control: Control<TestFormValues>;
  classId: string;
  lessons: LessonsType[] | undefined;
}) {
  const filteredLessons =
    !lessons || !classId || classId === "none"
      ? []
      : lessons.filter((lesson) => lesson.classId === classId);

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
                {!classId || classId === "none" ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Please select a class first to view available lessons
                  </div>
                ) : (
                  <LessonSelectTable lessons={filteredLessons} field={field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
