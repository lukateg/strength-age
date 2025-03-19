"use client";

import ItemsScrollArea from "@/components/items-scroll-area";
import ListItem from "@/components/list-item";
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
  const { materials } = useClass();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Materials</CardTitle>
        <CardDescription>PDF documents and study materials</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          {materials?.map((material) => (
            <ListItem key={material._id} variant="outline">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{material?.name}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </ListItem>
          ))}
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
