import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";

import { FileText, Loader, Eye } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function MaterialsList({
  materials,
}: {
  materials?: (Doc<"pdfs"> | null)[];
}) {
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
          </div>
        </ListItem>
      ))}
    </>
  );
}
