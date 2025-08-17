import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#2B2D42] text-white hover:bg-[#1a1c2e] transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "text-[#2B2D42] transition-all duration-200 underline underline-offset-4 decoration-[#2B2D42]",
        link: "text-primary underline-offset-4 hover:underline",
        dark: "bg-[#2B2D42] text-white rounded-xs hover:bg-[#1a1c2e] transition-all duration-200",
        ghostWithUnderline:
          "text-[#2B2D42] hover:text-[#4ECDC4] transition-all duration-200 underline underline-offset-4 decoration-[#2B2D42] hover:decoration-[#4ECDC4]",
        newsletter:
          "bg-qa-blue text-qa-neutral-white font-semibold rounded-lg shadow-qa-button hover:bg-qa-blue-hover hover:shadow-qa-button-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xs px-3 text-xs",
        lg: "h-10 rounded-xs px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
