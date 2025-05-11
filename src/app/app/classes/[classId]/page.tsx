"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MaterialsSectionComponent from "./components/materials-section";
import LessonsSectionComponent from "./components/lessons-section";
import TestsSection from "./components/tests-section";
import TestReviewsSection from "./components/tests-reviews-section";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import PageSkeleton from "@/components/page-components/page-skeleton";
import NotFound from "@/components/not-found";

import { useParams } from "next/navigation";
import { useClass } from "@/providers/class-context-provider";

import { type Id } from "convex/_generated/dataModel";
import SectionHeader from "@/components/page-components/page-header";

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

  return (
    <div className="mx-auto container p-6 space-y-10">
      <SectionHeader
        title={classData.data?.title}
        description={classData.data?.description}
        backRoute={`/app/classes`}
        editRoute={`/app/classes/edit-class?id=${classId}`}
        editButtonText={"Edit Class"}
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
          <LessonsSectionComponent classId={classId} />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <MaterialsSectionComponent classId={classId} />
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <TestsSection classId={classId} />
        </TabsContent>

        <TabsContent value="test-reviews" className="space-y-4">
          <TestReviewsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
