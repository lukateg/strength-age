import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  type UseFormReturn,
  type ControllerRenderProps,
} from "react-hook-form";
import { type Id } from "convex/_generated/dataModel";
import { type PDFType } from "@/types/types";
import { type CheckedState } from "@radix-ui/react-checkbox";

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
  lessonId: string;
  addPDFToLesson: () => void;
}

export const ExistingMaterialsView = ({
  materials,
  form,
  lessonId,
  addPDFToLesson,
}: ExistingMaterialsViewProps) => {
  const toggleCheckedMaterial = (
    checked: CheckedState,
    pdfId: Id<"pdfs">,
    field: ControllerRenderProps<
      {
        lesson: string;
        selectedMaterials: Id<"pdfs">[];
      },
      "selectedMaterials"
    >
  ) => {
    return checked
      ? field.onChange([...field.value, pdfId])
      : field.onChange(field.value?.filter((value) => value !== pdfId));
  };
  return (
    <>
      <div className="space-y-4">
        {materials?.map((pdf) => (
          <FormField
            key={pdf._id}
            control={form.control}
            name="selectedMaterials"
            render={({ field }) => (
              <FormItem
                key={pdf._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(pdf._id)}
                      onCheckedChange={(checked) =>
                        toggleCheckedMaterial(checked, pdf._id, field)
                      }
                      disabled={pdf.lessonIds.includes(lessonId)}
                    />
                  </FormControl>
                  <div className="flex items-center">
                    <Label className="cursor-pointer">{pdf.fileUrl}</Label>
                  </div>
                </div>
              </FormItem>
            )}
          />
        ))}
      </div>

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
