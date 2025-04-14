import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialsSectionComponent from "./components/materials-section";
import LessonsSectionComponent from "./components/lessons-section";

import { type Id } from "convex/_generated/dataModel";

import TestsSection from "./components/tests-section";
import TestReviewsSection from "./components/tests-reviews-section";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

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
        <FeatureFlagTooltip>
          <TabsTrigger disabled value="audio">
            Audio Lessons
          </TabsTrigger>
        </FeatureFlagTooltip>
      </TabsList>

      <TabsContent value="lessons" className="space-y-4">
        <LessonsSectionComponent classId={id} />
      </TabsContent>

      <TabsContent value="materials" className="space-y-4">
        <MaterialsSectionComponent classId={id} />
      </TabsContent>

      <TabsContent value="tests" className="space-y-4">
        <TestsSection classId={id} />
      </TabsContent>

      <TabsContent value="test-reviews" className="space-y-4">
        <TestReviewsSection />
      </TabsContent>
    </Tabs>
  );
}
