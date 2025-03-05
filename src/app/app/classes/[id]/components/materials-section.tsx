"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useClass } from "@/providers/class-context-provider";

import { FileText } from "lucide-react";

export default function MaterialsSectionComponent() {
  const { materials, isLoading, error } = useClass();

  // if (isLoading) return <div>Loading materials...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Materials</CardTitle>
        <CardDescription>PDF documents and study materials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{material.fileUrl}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
