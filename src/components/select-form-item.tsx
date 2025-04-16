import { FormControl } from "./ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Select } from "./ui/select";
import { FormItem, FormMessage } from "./ui/form";
import { FormDescription, FormLabel } from "./ui/form";

interface Lesson {
  _id: string;
  title: string;
}

export default function SelectFormItem({
  items,
  disabled,
  placeholder,
  value,
  onChange,
  defaultValue,
  label,
  description,
}: {
  items?: Lesson[] | null;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  label?: string;
  description?: string;
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={onChange} disabled={disabled} value={value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue
              placeholder={placeholder}
              defaultValue={defaultValue}
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="none">none</SelectItem>
          {items?.map((item) => (
            <SelectItem key={item._id} value={item._id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormDescription>{description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
}
