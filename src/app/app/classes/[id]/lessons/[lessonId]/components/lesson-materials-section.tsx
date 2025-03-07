"use client";

import { api } from "../../../../../../../../convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Headphones } from "lucide-react";

export default function LessonMaterialsSectionComponent() {
  const { lessonId }: { lessonId: Id<"lessons"> } = useParams();
  const lessonData = useQuery(api.lessons.getLessonData, {
    lessonId,
  });

  if (!lessonData) {
    return <div>Loading...</div>;
  }

  const { lesson, lessonPDFs } = lessonData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lesson?.title}</CardTitle>
        <CardDescription>{lesson?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonPDFs.map((pdf) => (
            <Link key={pdf._id} href={`/lessons/${pdf._id}`}>
              <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {pdf.fileUrl}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <FileText className="inline h-4 w-4 mr-1" />
                      {pdf.uploadedAt} documents
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div> */}
        <div className="space-y-4">
          {lessonPDFs.map((pdf) => (
            <div
              key={pdf._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <Headphones className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{pdf.fileUrl}</span>
              </div>
              <Button variant="outline" size="sm">
                Play
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
