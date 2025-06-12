import ClassCard from "./class-card/class-card";

import { type api } from "convex/_generated/api";
import { type FunctionReturnType } from "convex/server";

export default function ClassesList({
  classes,
}: {
  classes?: FunctionReturnType<
    typeof api.classes.getClassesDataByUserId
  >["classesWithPermissions"];
}) {
  if (classes && classes.length === 0) {
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
      {classes?.map((classItem) => (
        <ClassCard key={classItem.title} classItem={classItem} />
      ))}
    </div>
  );
}
