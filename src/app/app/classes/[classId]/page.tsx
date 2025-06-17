"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import LessonsSectionComponent from "./components/lessons-by-class-card/lessons-by-class-card";
import TestsSection from "./components/tests-by-class-card";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import PageSkeleton from "@/components/page-components/main-page-skeleton";
import NotFound from "@/components/not-found";
import SectionHeader from "@/components/page-components/page-header";
import MaterialsByClassCard from "./components/materials-by-class-card";
import Link from "next/link";

import { useParams } from "next/navigation";
import { useClass } from "@/providers/class-context-provider";

import { Pencil } from "lucide-react";
import { type Id } from "convex/_generated/dataModel";

export default function ClassPage() {
  const { classId }: { classId: Id<"classes"> } = useParams();
  const { classData } = useClass();

  if (classData.isPending) {
    return <PageSkeleton />;
  }

  if (classData.isError) {
    return <NotFound />;
  }
  if (!classData.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Class not found</h3>
        <p className="text-muted-foreground mt-2">
          The class you are looking for does not exist anymore.
        </p>
      </div>
    );
  }

  const { class_, lessons, permissions, materials, tests, testReviews } =
    classData.data;

  return (
    <div className="space-y-10">
      <SectionHeader
        title={class_.title}
        description={class_.description}
        backRoute={`/app/classes`}
        actionButton={
          permissions.canEditClass && (
            <Button className="text-xs md:text-base" asChild>
              <Link href={`/app/classes/${classId}/edit-class`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Class
              </Link>
            </Button>
          )
        }
      />
      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lessons" className="text-xs md:text-base">
            Lessons
          </TabsTrigger>
          <TabsTrigger value="materials" className="text-xs md:text-base">
            Materials
          </TabsTrigger>
          <TabsTrigger value="tests" className="text-xs md:text-base">
            Tests
          </TabsTrigger>
          <FeatureFlagTooltip>
            <TabsTrigger
              disabled
              value="audio"
              className="text-xs md:text-base"
            >
              Audio Lessons
            </TabsTrigger>
          </FeatureFlagTooltip>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <LessonsSectionComponent
            lessons={lessons}
            canCreateLesson={permissions.canCreateLesson}
            classId={classId}
          />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <MaterialsByClassCard
            classId={classId}
            canUploadMaterials={permissions.canUploadMaterials}
            materials={materials}
          />
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <TestsSection
            classId={classId}
            canCreateTest={permissions.canCreateTest}
            tests={tests}
            testReviews={testReviews}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
