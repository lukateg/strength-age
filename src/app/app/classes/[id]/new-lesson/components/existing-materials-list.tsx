import { FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";

import ItemsScrollArea from "@/components/items-scroll-area";
import ScrollAreaItem from "@/components/scroll-area-item";
import CheckboxListItem from "@/components/checkbox-list-item";

import { type ControllerRenderProps, type Control } from "react-hook-form";
import { type Id } from "convex/_generated/dataModel";
import { type PDFType } from "@/types/types";
import { type CheckedState } from "@radix-ui/react-checkbox";

interface LessonFormData {
  lessonTitle: string;
  lessonDescription: string;
  uploadedMaterials: File[];
  selectedMaterials: Id<"pdfs">[];
}

interface ExistingMaterialsSectionProps {
  allMaterials: PDFType[];
  control: Control<LessonFormData>;
}

export default function ExistingMaterialsSection({
  allMaterials,
  control,
}: ExistingMaterialsSectionProps) {
  const toggleCheckedMaterial = (
    checked: CheckedState,
    pdfId: Id<"pdfs">,
    field: ControllerRenderProps<LessonFormData, "selectedMaterials">
  ) => {
    return checked
      ? field.onChange([...field.value, pdfId])
      : field.onChange(field.value?.filter((value) => value !== pdfId));
  };

  return (
    <ItemsScrollArea>
      {allMaterials?.map((pdf) => (
        <ScrollAreaItem key={pdf._id}>
          <FormField
            key={pdf._id}
            control={control}
            name="selectedMaterials"
            render={({ field }) => (
              <FormItem
                key={pdf._id}
                className="flex items-center justify-between"
              >
                <CheckboxListItem
                  checked={field.value?.includes(pdf._id)}
                  onCheckedChange={(checked) =>
                    toggleCheckedMaterial(checked, pdf._id, field)
                  }
                  name={pdf.name}
                  size={pdf.size}
                />
              </FormItem>
            )}
          />
        </ScrollAreaItem>
      ))}
    </ItemsScrollArea>
  );
}
