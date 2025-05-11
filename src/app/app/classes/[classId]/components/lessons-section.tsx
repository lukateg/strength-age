import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LessonsList from "./lessons-list";
import ItemsScrollArea from "@/components/items-scroll-area";

import { type Id } from "convex/_generated/dataModel";

import { Plus } from "lucide-react";
interface LessonsSectionProps {
  classId: Id<"classes">;
}

export default function LessonsSectionComponent({
  classId,
}: LessonsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Course Lessons</CardTitle>
          <CardDescription className="text-sm md:text-base">
            PDF documents and study materials
          </CardDescription>
        </div>
        <Button asChild className="text-xs md:text-base">
          <Link href={`/app/classes/${classId}/new-lesson`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[650px]">
          <LessonsList />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
