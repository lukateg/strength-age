import { Skeleton } from "@/components/ui/skeleton";

import ClassCard from "./class-card/class-card";
import NotFound from "@/components/not-found";

import { type Doc } from "convex/_generated/dataModel";
import { type QueryStatus } from "@/hooks/use-authenticated-query";
import { type FunctionReference } from "convex/server";
import { type EmptyObject } from "react-hook-form";

export default function ClassesList({
  classes,
}: {
  classes: QueryStatus<
    FunctionReference<
      "query",
      "public",
      EmptyObject,
      Doc<"classes">[],
      string | undefined
    >
  >;
}) {
  if (classes.isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (classes.isError) {
    return <NotFound />;
  }

  if (classes.isSuccess && classes.data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Classes Yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first class to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 ">
      {classes.data.map((classItem) => (
        <ClassCard key={classItem.title} classItem={classItem} />
      ))}
    </div>
  );
}
