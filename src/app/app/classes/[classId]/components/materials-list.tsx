"use client";

import { useMaterialsMutations } from "@/hooks/use-materials-mutations";

import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";
import AlertDialogModal from "@/components/alert-dialog";

import { FileText, Loader, Eye, Trash } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function MaterialsList({
  materials,
}: {
  materials?: (Doc<"pdfs"> | null)[];
}) {
  const { deletePdf } = useMaterialsMutations();

  if (!materials) {
    return <Loader />;
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Materials Yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first material to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {materials?.map((material) => (
        <ListItem key={material?._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm md:text-base w-[12ch] text-ellipsis overflow-hidden whitespace-nowrap">
              {material?.name}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-base"
              onClick={() => window.open(material?.fileUrl, "_blank")}
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
      ))}
    </>
  );
}
