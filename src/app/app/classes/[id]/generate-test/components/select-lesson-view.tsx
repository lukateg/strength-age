import { FormControl } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CheckboxListItem from "@/components/checkbox-list-item";
import ItemsScrollArea from "@/components/items-scroll-area";

import { type TestFormValues } from "../page";
import { type Control } from "react-hook-form";
import { type LessonsType } from "@/types/types";

export default function SelectLessonView({
  control,
  lessons,
}: {
  control: Control<TestFormValues>;
  lessons: LessonsType[] | undefined;
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
                <ItemsScrollArea>
                  {lessons?.map((lesson) => (
                    <CheckboxListItem
                      key={lesson._id}
                      checked={field.value.includes(lesson._id)}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked
                            ? [...field.value, lesson._id]
                            : field.value.filter((id) => id !== lesson._id)
                        )
                      }
                      //   disabled={shouldDisableItem?.(pdf)}
                    >
                      <div>
                        <p className="font-base">{lesson.title}</p>
                      </div>
                    </CheckboxListItem>
                  ))}
                </ItemsScrollArea>
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
