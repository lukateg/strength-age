"use client";

import {
  type Control,
  Controller,
  type UseFormSetValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import FileUploadComponent from "@/components/file-upload";
import UploadedMaterialsList from "@/components/uploaded-materials-list";
import { type Id } from "convex/_generated/dataModel";

interface UploadMaterialsViewProps {
  setValue: UseFormSetValue<{
    lesson: Id<"lessons">;
    selectedMaterials: Id<"pdfs">[];
    uploadedMaterials: File[];
  }>;
  control: Control<{
    lesson: Id<"lessons">;
    selectedMaterials: Id<"pdfs">[];
    uploadedMaterials: File[];
  }>;
  uploadedMaterials: File[];
}

export const UploadMaterialsView = ({
  setValue,
  control,
  uploadedMaterials,
}: UploadMaterialsViewProps) => {
  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue("uploadedMaterials", [...uploadedMaterials, ...newMaterials], {
        shouldValidate: true,
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Label>Materials</Label>

        <Controller
          name="uploadedMaterials"
          control={control}
          render={() => (
            <FileUploadComponent
              onDrop={handleFileChange}
              existingFiles={uploadedMaterials}
            />
          )}
        />

        {!!uploadedMaterials.length && (
          <UploadedMaterialsList
            uploadedMaterials={uploadedMaterials}
            setValue={setValue}
          />
        )}
      </div>
    </>
  );
};
