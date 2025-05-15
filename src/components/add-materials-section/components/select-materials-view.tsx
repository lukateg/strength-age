import { FormControl, FormField, FormItem } from "@/components/ui/form";

import MaterialsCheckboxList from "@/components/materials-checkbox-list";

import { type Control, type Path } from "react-hook-form";
import { type Doc, type Id } from "convex/_generated/dataModel";

interface SelectMaterialsViewProps<T extends { materialsToAdd: Id<"pdfs">[] }> {
  control: Control<T>;
  allMaterials?: Doc<"pdfs">[] | null;
  uploadedPdfs?: Doc<"pdfs">[] | null;
  className?: string;
}

export function SelectMaterialsView<
  T extends { materialsToAdd: Id<"pdfs">[] },
>({
  control,
  allMaterials,
  uploadedPdfs,
  className,
}: SelectMaterialsViewProps<T>) {
  const shouldDisableItem = (pdf: Doc<"pdfs">) => {
    return uploadedPdfs?.some((p) => p?._id === pdf._id) ?? false;
  };

  return (
    <div className={className}>
      <FormField
        control={control}
        name={"materialsToAdd" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MaterialsCheckboxList
                allMaterials={allMaterials}
                selectedMaterials={
                  Array.isArray(field.value) ? field.value : []
                }
                onChange={field.onChange}
                shouldDisableItem={uploadedPdfs ? shouldDisableItem : undefined}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
