"use client";

import Link from "next/link";
import { useClasses } from "@/providers/classes-provider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BookOpen, Plus } from "lucide-react";

export function ClassesPage() {
  const { classes } = useClasses();

  if (!classes) {
    return <div> Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your classes and materials
          </p>
        </div>
        <Link href="/app/classes/new-class">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Class
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
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
                <Button className="w-full">Generate Test</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ClassesPage;
