import { Checkbox } from "./ui/checkbox";

import ListItem from "./list-item";

export default function CheckboxListItem({
  checked,
  onCheckedChange,
  disabled,
  children,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ListItem variant={disabled ? "default" : "outline"}>
      <div className="flex items-center gap-4">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
        {children}
      </div>
    </ListItem>
  );
}
