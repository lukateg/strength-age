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

import { EllipsisVertical, Pencil, Trash } from "lucide-react";

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
      <DropdownMenuContent className="w-16">
        <Button variant="ghost" asChild className="justify-start w-full h-fit">
          <DropdownMenuItem asChild>
            <Link
              href={`/app/classes/${classId}/edit-lesson?lessonId=${lessonId}`}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        </Button>

        <AlertDialogModal
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete the
                lesson and all associated materials."
          onConfirm={() => deleteLesson(lessonId)}
          variant="destructive"
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
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
