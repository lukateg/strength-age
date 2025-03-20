import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

import MaterialsCheckboxList from "@/components/materials-checkbox-list";

import { type UseFormReturn } from "react-hook-form";
import { type Id } from "convex/_generated/dataModel";
import { type PDFType } from "@/types/types";

import { Cloud } from "lucide-react";

interface ExistingMaterialsViewProps {
  materials: PDFType[];
  form: UseFormReturn<
    {
      lesson: string;
      selectedMaterials: Id<"pdfs">[];
    },
    unknown,
    undefined
  >;
  lessonId: Id<"lessons">;
  addPDFToLesson: () => void;
}

export const ExistingMaterialsView = ({
  materials,
  form,
  lessonId,
  addPDFToLesson,
}: ExistingMaterialsViewProps) => {
  return (
    <>
      <FormField
        control={form.control}
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

      <CardFooter>
        <Button
          className="w-full"
          onClick={addPDFToLesson}
          disabled={form.watch("selectedMaterials").length === 0}
        >
          <>
            <Cloud className="mr-2 h-4 w-4" />
            Add selected materials to lesson
          </>
        </Button>
      </CardFooter>
    </>
  );
};
