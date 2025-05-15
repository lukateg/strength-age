"use client";

import { api } from "convex/_generated/api";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import ClassCardDropdown from "../classes/components/class-card/class-card-dropdown";
import Link from "next/link";

import { BookOpen, Eye } from "lucide-react";

export default function RecentClasses() {
  const classes = useAuthenticatedQueryWithStatus(
    api.classes.getAllClassesByUserId
  );

  return (
    <ListCard
      title="Recent Classes"
      description="Your recently created or modified classes"
      items={classes.data}
      isLoading={classes.isPending}
      renderItem={(classItem) => (
        <ListItem key={classItem._id} icon={BookOpen} title={classItem.title}>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/app/classes/${classItem._id}`}>
                <Eye className="h-4 w-4" />
                <span className="hidden md:block ml-2">View</span>
              </Link>
            </Button>

            <ClassCardDropdown classId={classItem._id} />
          </div>
        </ListItem>
      )}
    />
  );
}
