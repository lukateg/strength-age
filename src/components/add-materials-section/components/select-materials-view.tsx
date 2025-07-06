import { FormControl, FormField, FormItem } from "@/components/ui/form";

import MaterialsCheckboxList from "@/components/materials-checkbox-list";

import { type Control, type Path } from "react-hook-form";
import { type Doc, type Id } from "convex/_generated/dataModel";

interface SelectMaterialsViewProps<
  T extends { materialsToAdd: Id<"materials">[] },
> {
  control: Control<T>;
  allMaterials?: Doc<"materials">[] | null;
  uploadedMaterials?: Doc<"materials">[] | null;
  className?: string;
}

export function SelectMaterialsView<
  T extends { materialsToAdd: Id<"materials">[] },
>({
  control,
  allMaterials,
  uploadedMaterials,
  className,
}: SelectMaterialsViewProps<T>) {
  const shouldDisableItem = (material: Doc<"materials">) => {
    return uploadedMaterials?.some((m) => m?._id === material._id) ?? false;
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
                shouldDisableItem={
                  uploadedMaterials ? shouldDisableItem : undefined
                }
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
