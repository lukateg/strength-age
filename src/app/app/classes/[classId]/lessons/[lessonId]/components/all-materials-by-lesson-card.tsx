"use client";

import { useParams } from "next/navigation";
import { useMaterialsMutations } from "@/hooks/use-materials-mutations";

import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import AlertDialogModal from "@/components/alert-dialog";

import { FileText, Eye, Trash, Upload } from "lucide-react";
import { type Doc } from "../../../../../../../../convex/_generated/dataModel";
import Link from "next/link";

export default function AllMaterialsByLessonCard({
  materials,
}: {
  materials: Doc<"pdfs">[];
}) {
  const { lessonId, classId }: { lessonId: string; classId: string } =
    useParams();

  const { deletePdf } = useMaterialsMutations();

  return (
    <ListCard
      title="Materials"
      description="All materials for this lesson"
      items={materials}
      cardAction={
        <Button asChild>
          <Link
            href={`/app/classes/${classId}/lessons/${lessonId}/file-upload`}
          >
            <Upload className="h-4 w-4 mr-2" />
            Add new material
          </Link>
        </Button>
      }
      renderItem={(pdf) => (
        <ListItem key={pdf?._id} icon={FileText} title={pdf.name}>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-base"
              onClick={() => {
                if (pdf?.fileUrl) {
                  window.open(pdf.fileUrl, "_blank");
                }
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:block ml-2">Preview</span>
            </Button>

            <AlertDialogModal
              onConfirm={async () => {
                if (pdf?._id) {
                  await deletePdf(pdf._id);
                }
              }}
              title="Delete Material"
              description="Are you sure you want to delete this material?"
              variant="destructive"
              alertTrigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-base"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              }
            />
          </div>
        </ListItem>
      )}
    />
  );
}
