import ItemsScrollArea from "@/components/items-scroll-area";
import CheckboxListItem from "@/components/checkbox-list-item";

import { type Id, type Doc } from "convex/_generated/dataModel";
import { type CheckedState } from "@radix-ui/react-checkbox";

interface MaterialsCheckboxListProps {
  allMaterials?: Doc<"materials">[] | null;
  selectedMaterials: Id<"materials">[];
  onChange: (value: Id<"materials">[]) => void;
  shouldDisableItem?: (material: Doc<"materials">) => boolean;
}

export default function MaterialsCheckboxList({
  allMaterials,
  selectedMaterials,
  onChange,
  shouldDisableItem,
}: MaterialsCheckboxListProps) {
  const toggleCheckedMaterial = (
    checked: CheckedState,
    materialId: Id<"materials">
  ) => {
    return checked
      ? onChange([...selectedMaterials, materialId])
      : onChange(selectedMaterials?.filter((value) => value !== materialId));
  };

  return (
    <ItemsScrollArea>
      {allMaterials?.map((material) => (
        <CheckboxListItem
          key={material._id}
          checked={selectedMaterials?.includes(material._id)}
          onCheckedChange={(checked) =>
            toggleCheckedMaterial(checked, material._id)
          }
          disabled={shouldDisableItem?.(material)}
        >
          <div>
            <p className="font-xs">{material.name}</p>
            <p className="text-xs text-muted-foreground">
              {(material.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </CheckboxListItem>
      ))}
    </ItemsScrollArea>
  );
}
