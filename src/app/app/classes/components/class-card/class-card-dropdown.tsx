import Link from "next/link";
import { useClassMutations } from "@/hooks/use-class-mutation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import { type Id } from "../../../../../../convex/_generated/dataModel";
import AlertDialogModal from "@/components/alert-dialog";

export default function ClassCardDropdown({
  classId,
}: {
  classId: Id<"classes">;
}) {
  const { deleteClass } = useClassMutations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-fit p-2">
        <Button variant="ghost">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-16">
        <Button variant="ghost" asChild className="justify-start w-full h-fit">
          <DropdownMenuItem asChild>
            <Link href={`/app/classes/edit-class?classId=${classId}`}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        </Button>

        <AlertDialogModal
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete the
                class and all associated materials, lessons, and tests."
          onConfirm={() => deleteClass(classId)}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
