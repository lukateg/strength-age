"use client";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MaterialsSection from "./components/materials-section";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import SectionHeader from "@/components/page-components/page-header";

import { type Id } from "convex/_generated/dataModel";
import PageSkeleton from "@/components/page-components/page-skeleton";
import NotFound from "@/components/not-found";

export default function LessonPage() {
  const {
    lessonId,
    classId,
  }: { lessonId: Id<"lessons">; classId: Id<"classes"> } = useParams();
  const lessonData = useAuthenticatedQueryWithStatus(
    api.lessons.getLessonById,
    {
      lessonId,
    }
  );

  if (lessonData.isPending) {
    return <PageSkeleton />;
  }

  if (lessonData.isError) {
    return <NotFound />;
  }
  if (!lessonData.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Lesson not found</h3>
        <p className="text-muted-foreground mt-2">
          The lesson you are looking for does not exist anymore.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title={lessonData.data?.title}
        description={lessonData.data?.description}
        backRoute={`/app/classes/${classId}`}
        editRoute={`/app/classes/${classId}/edit-lesson?lessonId=${lessonId}`}
        editButtonText={"Edit Lesson"}
      />
      <Tabs defaultValue="lessonMaterials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lessonMaterials">Uploaded Materials</TabsTrigger>
          <FeatureFlagTooltip>
            <TabsTrigger value="audio-materials" disabled>
              Audio Materials
            </TabsTrigger>
          </FeatureFlagTooltip>
        </TabsList>

        <TabsContent value="lessonMaterials" className="space-y-4">
          <MaterialsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
