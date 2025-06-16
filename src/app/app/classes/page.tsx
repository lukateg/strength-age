"use client";

import { useClasses } from "@/providers/classes-provider";
import { Button } from "@/components/ui/button";

import ClassesList from "./components/classes-list";
import Link from "next/link";
import NotFound from "@/components/not-found";
import ClassesPageSkeleton from "./components/classes-page-skeleton";

import { Plus } from "lucide-react";

export default function ClassesPage() {
  const { classesPageData } = useClasses();

  if (classesPageData?.isPending) {
    return <ClassesPageSkeleton />;
  }

  if (classesPageData?.isError) {
    return <NotFound />;
  }

  const { permissions, classesWithPermissions } = classesPageData?.data;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">My Classes</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage your classes and materials
          </p>
        </div>
        <Button disabled={!permissions.canCreateClass}>
          <Link
            href="/app/classes/create-class"
            className={"flex items-center justify-center"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {permissions.canCreateClass
              ? "Create Class"
              : "Upgrade to create classes"}
          </Link>
        </Button>
      </div>

      <ClassesList classes={classesWithPermissions} />
    </div>
  );
}
