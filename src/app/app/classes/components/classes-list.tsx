"use client";

import Link from "next/link";
import { useClasses } from "@/providers/classes-provider";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesList() {
  const { classes } = useClasses();

  if (classes.isPending) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (classes.isError) {
    return <div>Error loading classes</div>;
  }

  if (classes.isSuccess && classes.data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Classes Yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first class to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classes.data.map((classItem) => (
        <Card key={classItem.title}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              {classItem.title}
            </CardTitle>
            <CardDescription>{classItem.description}</CardDescription>
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
      ))}
    </div>
  );
}
