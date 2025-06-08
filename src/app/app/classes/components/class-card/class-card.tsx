import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ClassCardDropdown from "./class-card-dropdown";

import { BookOpen } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function ClassCard({
  classItem,
}: {
  classItem: Doc<"classes">;
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
          <span>15 Materials</span>
          <span>7 Tests</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/app/classes/${classItem._id}`}>
            <Button className="w-full" variant="outline">
              View Class
            </Button>
          </Link>
          <Link href={`/app/classes/${classItem._id}/generate-test`}>
            <Button className="w-full">Generate Test</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
