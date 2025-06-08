import { useClassMutations } from "@/hooks/use-class-mutations";
import { useUserContext } from "@/providers/user-provider";

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

import { type Doc } from "../../../../../../convex/_generated/dataModel";

export default function ClassCardDropdown({
  classItem,
}: {
  classItem: Doc<"classes">;
}) {
  const { deleteClass } = useClassMutations();
  const { can } = useUserContext();

  const canEditClass = can("classes", "update", {
    class: classItem,
  });
  const canDeleteClass = can("classes", "delete", {
    class: classItem,
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-fit p-2">
        <Button variant="ghost">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-16">
        {canEditClass && (
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

        {canDeleteClass && (
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
