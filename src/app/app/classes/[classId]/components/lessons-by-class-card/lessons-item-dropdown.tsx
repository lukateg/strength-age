"use client";
import Link from "next/link";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AlertDialogModal from "@/components/alert-dialog";

import { type Id } from "../../../../../../../convex/_generated/dataModel";

import { EllipsisVertical } from "lucide-react";

export default function LessonsItemDropdown({
  lessonId,
  classId,
}: {
  lessonId: Id<"lessons">;
  classId: Id<"classes">;
}) {
  const { deleteLesson } = useLessonMutations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-fit p-2">
        <Button variant="ghost">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-26">
        <DropdownMenuItem asChild>
          <Link
            href={`/app/classes/${classId}/edit-lesson?lessonId=${lessonId}`}
          >
            Edit
          </Link>
        </DropdownMenuItem>

        <AlertDialogModal
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete the
                lesson and all associated materials."
          onConfirm={() => deleteLesson(lessonId)}
          variant="destructive"
          alertTrigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
