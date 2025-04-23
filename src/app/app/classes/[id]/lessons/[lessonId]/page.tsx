import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MaterialsSection from "./components/materials-section";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

export default function LessonPage({}) {
  return (
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
  );
}
