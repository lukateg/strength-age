import {
  type Control,
  Controller,
  type UseFormSetValue,
} from "react-hook-form";

import FileUploadComponent from "@/components/file-upload";
import UploadedMaterialsList from "@/components/uploaded-materials-list";
import { Label } from "@/components/ui/label";

import { type LessonFormData } from "@/types/lesson";

export default function UploadMaterialsSection({
  control,
  uploadedMaterials,
  setValue,
}: {
  control: Control<LessonFormData>;
  uploadedMaterials: File[];
  setValue: UseFormSetValue<LessonFormData>;
}) {
  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue("uploadedMaterials", [...uploadedMaterials, ...newMaterials], {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Materials</Label>

      <Controller
        name="uploadedMaterials"
        control={control}
        render={() => <FileUploadComponent onDrop={handleFileChange} />}
      />

      {!!uploadedMaterials.length && (
        <UploadedMaterialsList
          uploadedMaterials={uploadedMaterials}
          setValue={setValue}
        />
      )}
    </div>
  );
}
