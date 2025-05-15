"use client";

import { useMaterialsMutations } from "@/hooks/use-materials-mutations";
import { useClass } from "@/providers/class-context-provider";
import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import AlertDialogModal from "@/components/alert-dialog";

import { FileText, Trash, Eye } from "lucide-react";

export default function MaterialsSectionComponent() {
  const { materialsByClass } = useClass();
  const { deletePdf } = useMaterialsMutations();

  if (materialsByClass.isError) {
    return <div>Error loading materials</div>;
  }

  return (
    <ListCard
      title="Course Materials"
      description="PDF documents and study materials"
      items={materialsByClass.data}
      isLoading={materialsByClass.isPending}
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
