import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import MaterialsSection from "./components/materials-section";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { Brain } from "lucide-react";

export default function LessonPage({}) {
  return (
    <Tabs defaultValue="lessonMaterials" className="space-y-6">
      <TabsList>
        <TabsTrigger value="lessonMaterials">Uploaded Materials</TabsTrigger>
        <TabsTrigger value="tests">Tests</TabsTrigger>
        <FeatureFlagTooltip>
          <TabsTrigger value="audio-materials" disabled>
            Audio Materials
          </TabsTrigger>
        </FeatureFlagTooltip>
      </TabsList>

      <TabsContent value="lessonMaterials" className="space-y-4">
        <MaterialsSection />
      </TabsContent>

      <TabsContent value="tests" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Tests</CardTitle>
            <CardDescription>
              AI-generated tests from your materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Test 1 - Calculus Basics",
                "Test 2 - Derivatives Practice",
              ].map((test) => (
                <div
                  key={test}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{test}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Take Test
                    </Button>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
