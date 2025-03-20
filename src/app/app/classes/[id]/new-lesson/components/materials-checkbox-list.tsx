import ItemsScrollArea from "@/components/items-scroll-area";
import CheckboxListItem from "@/components/checkbox-list-item";

import { type Id } from "convex/_generated/dataModel";
import { type PDFType } from "@/types/types";
import { type CheckedState } from "@radix-ui/react-checkbox";

interface MaterialsCheckboxListProps {
  allMaterials: PDFType[];
  selectedMaterials: Id<"pdfs">[];
  onChange: (value: Id<"pdfs">[]) => void;
  shouldDisableItem?: (pdf: PDFType) => boolean;
}

export default function MaterialsCheckboxList({
  allMaterials,
  selectedMaterials,
  onChange,
  shouldDisableItem,
}: MaterialsCheckboxListProps) {
  const toggleCheckedMaterial = (checked: CheckedState, pdfId: Id<"pdfs">) => {
    return checked
      ? onChange([...selectedMaterials, pdfId])
      : onChange(selectedMaterials?.filter((value) => value !== pdfId));
  };

  return (
    <ItemsScrollArea>
      {allMaterials?.map((pdf) => (
        <CheckboxListItem
          key={pdf._id}
          checked={selectedMaterials?.includes(pdf._id)}
          onCheckedChange={(checked) => toggleCheckedMaterial(checked, pdf._id)}
          disabled={shouldDisableItem?.(pdf)}
        >
          <div>
            <p className="font-base">{pdf.name}</p>
            <p className="text-sm text-muted-foreground">
              {(pdf.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </CheckboxListItem>
      ))}
    </ItemsScrollArea>
  );
}
