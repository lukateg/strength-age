import { useClassMutations } from "@/hooks/use-class-mutations";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AlertDialogModal from "@/components/alert-dialog";
import Link from "next/link";

import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import { type api } from "convex/_generated/api";
import { type FunctionReturnType } from "convex/server";

export default function ClassCardDropdown({
  classItem,
}: {
  classItem: FunctionReturnType<
    typeof api.classes.getClassesDataByUserId
  >["classesWithPermissions"][number];
}) {
  //TODO move this into separate component and make this one server component
  const { deleteClass } = useClassMutations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-fit p-2">
        <Button variant="ghost">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-16">
        {classItem.canUpdateClass && (
          <Button
            variant="ghost"
            asChild
            className="justify-start w-full h-fit"
          >
            <DropdownMenuItem asChild>
              <Link href={`/app/classes/edit-class?classId=${classItem._id}`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
          </Button>
        )}

        {classItem.canDeleteClass && (
          <AlertDialogModal
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the
                class and all associated materials, lessons, and tests."
            onConfirm={() => deleteClass(classItem._id)}
            alertTrigger={
              <Button
                variant="destructive-ghost"
                asChild
                className="justify-start w-full h-fit"
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </Button>
            }
            variant="destructive"
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
