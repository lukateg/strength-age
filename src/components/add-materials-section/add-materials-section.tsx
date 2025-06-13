import { UploadMaterialsView } from "@/components/add-materials-section/components/upload-materials-view";
import { SelectMaterialsView } from "@/components/add-materials-section/components/select-materials-view";

import LabeledSwitch from "@/components/labeled-switch";

import {
  type Control,
  type UseFormSetValue,
  type UseFormClearErrors,
} from "react-hook-form";
import { type Doc, type Id } from "convex/_generated/dataModel";

interface MaterialSelectionProps<
  T extends { materialsToUpload: File[]; materialsToAdd: Id<"pdfs">[] },
> {
  showExistingMaterials: boolean;
  onShowExistingMaterialsChange: (checked: boolean) => void;
  materialsToUpload: File[];
  allMaterials: Doc<"pdfs">[] | undefined;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  uploadedPdfs?: Doc<"pdfs">[];
  storageUsed: number;
  storageLimit: number;
}

export function AddMaterialsView<
  T extends { materialsToUpload: File[]; materialsToAdd: Id<"pdfs">[] },
>({
  showExistingMaterials,
  onShowExistingMaterialsChange,
  materialsToUpload,
  allMaterials,
  control,
  setValue,
  clearErrors,
  uploadedPdfs,
  storageUsed,
  storageLimit,
}: MaterialSelectionProps<T>) {
  return (
    <>
      <LabeledSwitch
        id="select-from-uploaded"
        checked={showExistingMaterials}
        onCheckedChange={(checked: boolean) => {
          clearErrors();
          onShowExistingMaterialsChange(checked);
        }}
        label="Select from already uploaded materials"
      />

      {!showExistingMaterials ? (
        <UploadMaterialsView
          materialsToUpload={materialsToUpload}
          setValue={setValue}
          storageUsed={storageUsed}
          storageLimit={storageLimit}
        />
      ) : (
        <SelectMaterialsView
          control={control}
          allMaterials={allMaterials}
          uploadedPdfs={uploadedPdfs}
        />
      )}
    </>
  );
}
