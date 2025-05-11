"use client";

import { FormControl, FormField, FormItem } from "@/components/ui/form";

import MaterialsCheckboxList from "@/components/materials-checkbox-list";

import { type Control } from "react-hook-form";
import { type Id } from "convex/_generated/dataModel";
import { type PDFType } from "@/types/types";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../../../convex/_generated/api";

interface SelectMaterialsViewProps {
  materials?: PDFType[] | null;
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
  const uploadedPdfs = useQuery(api.lessons.getPDFsByLessonId, {
    lessonId,
  });

  const shouldDisableItem = (pdf: PDFType) => {
    return uploadedPdfs?.some((p) => p?._id === pdf._id) ?? false;
  };

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
              shouldDisableItem={shouldDisableItem}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
