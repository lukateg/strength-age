import React from "react";
import { FormControl } from "./ui/form";
import { Checkbox } from "./ui/checkbox";

export default function CheckboxListItem({
  checked,
  onCheckedChange,
  name,
  size,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name: string;
  size: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <FormControl>
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </FormControl>
      <div>
        <p className="font-base">{name}</p>
        <p className="text-sm text-muted-foreground">
          {(size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
