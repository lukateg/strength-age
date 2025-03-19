import ItemsScrollArea from "@/components/items-scroll-area";
import ScrollAreaItem from "@/components/scroll-area-item";
import { Button } from "@/components/ui/button";

import { X, File } from "lucide-react";

export default function UploadedMaterialsList({
  uploadedMaterials,
  setValue,
}: {
  uploadedMaterials: File[];
  setValue: (
    name: "uploadedMaterials",
    value: File[],
    options?: Partial<{
      shouldValidate: boolean;
      shouldDirty: boolean;
      shouldTouch: boolean;
    }>
  ) => void;
}) {
  const removeMaterial = (name: string) => {
    setValue(
      "uploadedMaterials",
      uploadedMaterials.filter((material) => material.name !== name),
      { shouldValidate: true }
    );
  };

  return (
    <ItemsScrollArea>
      {uploadedMaterials.map((file) => (
        <ScrollAreaItem key={file.name}>
          <div className="flex items-center gap-4">
            <File className="h-6 w-6 text-primary" />
            <div>
              <p className="font-base">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeMaterial(file.name)}
          >
            <X className="h-4 w-4" />
          </Button>
        </ScrollAreaItem>
      ))}
    </ItemsScrollArea>
  );
}
