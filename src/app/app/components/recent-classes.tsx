import ItemsScrollArea from "@/components/items-scroll-area";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { BookOpen, Eye } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function RecentClasses({
  classesByUser,
}: {
  classesByUser?: Doc<"classes">[] | null;
}) {
  if (!classesByUser) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Classes</CardTitle>
        <CardDescription>
          Your recently created or modified classes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[600px]">
          {classesByUser.length > 0 ? (
            classesByUser.map((classItem) => (
              <div
                key={classItem._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{classItem.title}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/app/classes/${classItem._id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="hidden md:block ml-2">View</span>
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No classes found</p>
            </div>
          )}
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
