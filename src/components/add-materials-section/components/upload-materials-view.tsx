import { Label } from "@/components/ui/label";

import FileUploadComponent from "@/components/file-upload/file-upload";
import UploadedMaterialsList from "@/components/file-upload/uploaded-materials-list";

import {
  type UseFormSetValue,
  type Path,
  type PathValue,
} from "react-hook-form";

interface UploadMaterialsViewProps<T extends { materialsToUpload: File[] }> {
  setValue: UseFormSetValue<T>;
  materialsToUpload: File[];
}

export function UploadMaterialsView<T extends { materialsToUpload: File[] }>({
  setValue,
  materialsToUpload,
}: UploadMaterialsViewProps<T>) {
  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue(
        "materialsToUpload" as Path<T>,
        [...materialsToUpload, ...newMaterials] as PathValue<T, Path<T>>,
        {
          shouldValidate: true,
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <Label>Materials</Label>

      <FileUploadComponent
        onDrop={handleFileChange}
        existingFiles={materialsToUpload}
      />

      {!!materialsToUpload.length && (
        <UploadedMaterialsList
          materialsToUpload={materialsToUpload}
          setValue={
            setValue as unknown as UseFormSetValue<{
              materialsToUpload: File[];
            }>
          }
        />
      )}
    </div>
  );
}
