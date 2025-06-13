"use client";

import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import ClassCardDropdown from "../classes/components/class-card/class-card-dropdown";
import Link from "next/link";

import { BookOpen, Eye } from "lucide-react";

import { type FunctionReturnType } from "convex/server";
import { type api } from "../../../../convex/_generated/api";

export default function RecentClasses({
  classes,
}: {
  classes: FunctionReturnType<
    typeof api.pages.dashboard.getDashboardData
  >["classes"];
}) {
  return (
    <ListCard
      title="Recent Classes"
      description="Your recently created or modified classes"
      items={classes}
      renderItem={(classItem) => (
        <ListItem key={classItem._id} icon={BookOpen} title={classItem.title}>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/app/classes/${classItem._id}`}>
                <Eye className="h-4 w-4" />
                <span className="hidden md:block ml-2">View</span>
              </Link>
            </Button>

            <ClassCardDropdown classItem={classItem} />
          </div>
        </ListItem>
      )}
    />
  );
}
