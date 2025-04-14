import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialsSectionComponent from "./components/materials-section";
import LessonsSectionComponent from "./components/lessons-section";

import { Headphones } from "lucide-react";

import { type Id } from "convex/_generated/dataModel";

import TestsSection from "./components/tests-section";
import TestReviewsSection from "./components/tests-reviews-section";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ id: Id<"classes"> }>;
}) {
  const { id } = await params;
  return (
    <Tabs defaultValue="lessons" className="space-y-6">
      <TabsList>
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="tests">Tests</TabsTrigger>
        <TabsTrigger value="test-reviews">Test Reviews</TabsTrigger>
        <div title="To be implemented...">
          <TabsTrigger disabled value="audio">
            Audio Lessons
          </TabsTrigger>
        </div>
      </TabsList>

      <TabsContent value="lessons" className="space-y-4">
        <LessonsSectionComponent classId={id} />
      </TabsContent>

      <TabsContent value="materials" className="space-y-4">
        <MaterialsSectionComponent classId={id} />
      </TabsContent>

      <TabsContent value="audio" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Audio Lessons</CardTitle>
            <CardDescription>
              Generated and uploaded audio content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Lecture 1 - Basics of Calculus",
                "Lecture 2 - Understanding Derivatives",
              ].map((audio) => (
                <div
                  key={audio}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <Headphones className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{audio}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Play
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tests" className="space-y-4">
        <TestsSection classId={id} />
      </TabsContent>

      <TabsContent value="test-reviews" className="space-y-4">
        <TestReviewsSection classId={id} />
      </TabsContent>
    </Tabs>
  );
}
