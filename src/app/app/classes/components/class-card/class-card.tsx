import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import ClassCardDropdown from "./class-card-dropdown";

import { BookOpen } from "lucide-react";

import { type api } from "convex/_generated/api";
import { type FunctionReturnType } from "convex/server";

export default function ClassCard({
  classItem,
}: {
  classItem: FunctionReturnType<
    typeof api.pages.classesPage.getClassesPageData
  >["classesWithPermissions"][number];
}) {
  return (
    <Card key={classItem.title} className="relative">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            {classItem.title}
          </CardTitle>
          <CardDescription>{classItem.description}</CardDescription>
        </div>

        <div className="absolute top-2 right-2">
          <ClassCardDropdown classItem={classItem} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>{classItem.materialCount} Materials</span>
          <span>{classItem.testCount} Tests</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/app/classes/${classItem._id}`}>
            <Button className="w-full" variant="outline">
              View Class
            </Button>
          </Link>
          <Button disabled={!classItem.canGenerateTest} variant={"default"}>
            <Link
              href={`/app/classes/${classItem._id}/generate-test`}
              className="flex items-center justify-center"
            >
              {classItem.canGenerateTest ? "Generate Test" : "Limit Reached"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
