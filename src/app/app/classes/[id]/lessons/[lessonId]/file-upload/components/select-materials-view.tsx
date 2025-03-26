import { FormControl, FormField, FormItem } from "@/components/ui/form";

import MaterialsCheckboxList from "@/components/materials-checkbox-list";

import { type Control } from "react-hook-form";
import { type Id } from "convex/_generated/dataModel";
import { type PDFType } from "@/types/types";

interface SelectMaterialsViewProps {
  materials?: PDFType[];
  control: Control<{
    lessonId: Id<"lessons">;
    selectedMaterials: Id<"pdfs">[];
    uploadedMaterials: File[];
  }>;
  lessonId: Id<"lessons">;
}

export const SelectMaterialsView = ({
  materials,
  control,
  lessonId,
}: SelectMaterialsViewProps) => {
  return (
    <FormField
      control={control}
      name="selectedMaterials"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <MaterialsCheckboxList
              allMaterials={materials}
              selectedMaterials={field.value}
              onChange={field.onChange}
              shouldDisableItem={(pdf) => pdf.lessonIds.includes(lessonId)}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
