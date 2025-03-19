import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const listItemVariants = cva(
  "flex items-center justify-between p-4 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-muted",
        outline: "border border-input bg-background",
        ghost: "hover:bg-accent",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "p-4",
        sm: "p-2",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ListItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listItemVariants> {
  children: React.ReactNode;
}

export default function ListItemtem({
  children,
  className,
  variant,
  size,
}: ListItemProps) {
  return (
    <div className={cn(listItemVariants({ variant, size, className }))}>
      {children}
    </div>
  );
}
