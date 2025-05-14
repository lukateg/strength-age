import Link from "next/link";
import { useClassMutations } from "@/hooks/use-class-mutation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";

import { type Id } from "../../../../../../convex/_generated/dataModel";
import AlertDialogModal from "@/components/alert-dialog";

export default function ClassCardDropdown({
  classId,
}: {
  classId: Id<"classes">;
}) {
  const { deleteClass } = useClassMutations();

  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-26">
          <DropdownMenuItem asChild>
            <Link href={`/app/classes/edit-class?classId=${classId}`}>
              Edit
            </Link>
          </DropdownMenuItem>

          <AlertDialogModal
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the
                class and all associated materials, lessons, and tests."
            onConfirm={() => deleteClass(classId)}
            alertTrigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            }
            variant="destructive"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
