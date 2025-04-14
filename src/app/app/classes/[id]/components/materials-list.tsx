import { Button } from "@/components/ui/button";

import ListItem from "@/components/list-item";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { FileText, Loader } from "lucide-react";

import { type PDFType } from "@/types/types";

export default function MaterialsList({
  materials,
}: {
  materials?: PDFType[];
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
        <ListItem key={material._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{material?.name}</span>
          </div>
          <div className="flex gap-2">
            <FeatureFlagTooltip>
              <Button variant="outline" size="sm" disabled>
                Preview
              </Button>
            </FeatureFlagTooltip>
          </div>
        </ListItem>
      ))}
    </>
  );
}
