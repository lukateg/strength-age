import MaterialsCheckboxList from "@/components/materials-checkbox-list";

import { FormControl, FormField } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";

import { type Control } from "react-hook-form";
import { type LessonFormData } from "@/types/lesson";
import { type PDFType } from "@/types/types";

export default function SelectMaterialsView({
  control,
  allMaterials,
}: {
  control: Control<LessonFormData>;
  allMaterials?: PDFType[];
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="selectedMaterials"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MaterialsCheckboxList
                allMaterials={allMaterials}
                selectedMaterials={field.value}
                onChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
