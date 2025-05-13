import ItemsScrollArea from "@/components/items-scroll-area";
import ListItem from "@/components/list-item";

import { Button } from "@/components/ui/button";

import { X, File } from "lucide-react";

export default function UploadedMaterialsList({
  materialsToUpload,
  setValue,
}: {
  materialsToUpload: File[];
  setValue: (
    name: "materialsToUpload",
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
      "materialsToUpload",
      materialsToUpload.filter((material) => material.name !== name),
      { shouldValidate: true }
    );
  };

  return (
    <ItemsScrollArea>
      {materialsToUpload.map((file) => (
        <ListItem key={file.name}>
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
        </ListItem>
      ))}
    </ItemsScrollArea>
  );
}
