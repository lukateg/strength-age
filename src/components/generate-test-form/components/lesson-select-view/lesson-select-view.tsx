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

import { api } from "../../../../../convex/_generated/api";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
// TODO: usePreloadQuery for lessons, remove props and add suspense and keep this as server component

export default function LessonSelectView({
  // lessons,
  control,
  classId,
}: {
  // lessons?: LessonsType[];
  control: Control<TestFormValues>;
  classId: string;
}) {
  const lessons = useAuthenticatedQueryWithStatus(
    api.lessons.getLessonsByClass,
    classId && classId !== "none" ? { classId } : "skip"
  );

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
                  <LessonSelectTable lessons={lessons.data} field={field} />
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
