"use client";

import { useMaterialsMutations } from "@/hooks/use-materials-mutations";
import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import AlertDialogModal from "@/components/alert-dialog";
import Link from "next/link";

import { FileText, Trash, Eye, Upload } from "lucide-react";
import { type Doc } from "convex/_generated/dataModel";

export default function MaterialsByClassCard({
  classId,
  canUploadMaterials,
  materials,
}: {
  classId: string;
  canUploadMaterials: boolean;
  materials: Doc<"pdfs">[];
}) {
  const { deletePdf, isPending } = useMaterialsMutations();

  return (
    <ListCard
      title="Course Materials"
      description="PDF documents and study materials"
      items={materials}
      cardAction={
        <Button disabled={!canUploadMaterials} variant="purple">
          <Link
            href={`/app/classes/${classId}/file-upload`}
            className="flex items-center justify-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            {canUploadMaterials
              ? "Upload Materials"
              : "Upgrade to upload materials"}
          </Link>
        </Button>
      }
      renderItem={(material) => (
        <ListItem key={material._id} icon={FileText} title={material.name}>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-base"
              onClick={() => {
                if (material?.fileUrl) {
                  window.open(material.fileUrl, "_blank");
                }
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:block ml-2">Preview</span>
            </Button>

            <AlertDialogModal
              onConfirm={async () => {
                if (material?._id) {
                  await deletePdf(material._id);
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
                  disabled={isPending}
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
