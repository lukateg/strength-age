"use client";

import { useLesson } from "@/providers/lesson-provider";

import AllMaterialsByLessonCard from "./components/all-materials-by-lesson-card";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import SectionHeader from "@/components/page-components/page-header";
import PageSkeleton from "@/components/page-components/main-page-skeleton";
import NotFound from "@/components/data-query/not-found";
import Link from "next/link";
import QueryState from "@/components/data-query/query-state";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function LessonPage() {
  const { lesson } = useLesson();

  return (
    <QueryState query={lesson} pending={<PageSkeleton />} noData={<NotFound />}>
      {(data) => {
        const {
          materials,
          title,
          description,
          canEditLesson,
          classId,
          lessonId,
        } = data;
        return (
          <>
            <div className="space-y-10">
              <SectionHeader
                title={title}
                description={description}
                backRoute={`/app/classes/${classId}`}
                actionButton={
                  canEditLesson && (
                    <Button className="text-xs md:text-base" asChild>
                      <Link
                        href={`/app/classes/${classId}/lessons/${lessonId}/edit-lesson`}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Lesson
                      </Link>
                    </Button>
                  )
                }
              />
              <Tabs defaultValue="lessonMaterials" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="lessonMaterials">
                    Uploaded Materials
                  </TabsTrigger>
                  <FeatureFlagTooltip>
                    <TabsTrigger value="audio-materials" disabled>
                      Audio Materials
                    </TabsTrigger>
                  </FeatureFlagTooltip>
                </TabsList>

                <TabsContent value="lessonMaterials" className="space-y-4">
                  <AllMaterialsByLessonCard materials={materials} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        );
      }}
    </QueryState>
  );
}
