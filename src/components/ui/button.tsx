import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center text-xs md:text-base gap-1 justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        destructive:
          "border border-red-500 bg-red-100/90 text-red-500 dark:bg-red-900/50 dark:text-red-500 p-1 dark:hover:bg-red-800/60 hover:bg-red-300/50",
        "destructive-outline":
          "border border-red-500  text-red-500  dark:text-red-400 p-1 dark:hover:bg-red-800/60 hover:bg-red-300/40",
        "destructive-ghost":
          "text-red-500 hover:bg-accent hover:text-red-500 dark:hover:text-red-500",

        positive:
          "border border-green-400 bg-green-100/90 text-green-400 dark:bg-green-900/50 dark:text-green-400 p-1 dark:hover:bg-green-800/60 hover:bg-green-300/40",
        "positive-outline":
          "border border-green-500  text-green-500  dark:text-green-400 p-1 dark:hover:bg-green-800/60 hover:bg-green-300/40",

        orange:
          "border border-orange-500 bg-orange-100/90 text-orange-500 dark:bg-orange-900/50 dark:text-orange-400 p-1 dark:hover:bg-orange-800/60 hover:bg-orange-300/40",
        "orange-outline":
          "border border-orange-500  text-orange-500  dark:text-orange-400 p-1 dark:hover:bg-orange-800/60 hover:bg-orange-300/40",

        purple:
          "border border-purple-500 bg-purple-100/90 text-purple-500 dark:bg-purple-900/50 dark:text-purple-400 p-1 dark:hover:bg-purple-800/60 hover:bg-purple-300/40",
        "purple-outline":
          "border border-purple-500  text-purple-500  dark:text-purple-400 p-1 dark:hover:bg-purple-800/60 hover:bg-purple-300/40",

        caution:
          "border border-yellow-500 bg-yellow-100/90 text-yellow-500 dark:bg-yellow-900/50 dark:text-yellow-400 p-1 dark:hover:bg-yellow-800/60 hover:bg-yellow-300/40",
        "caution-outline":
          "border border-yellow-500  text-yellow-500  dark:text-yellow-400 p-1 dark:hover:bg-yellow-800/60 hover:bg-yellow-300/40",

        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "p-2 md:px-4 md:py-2 h-fit",
        sm: "p-2 md:px-3 h-9 rounded-md",
        lg: "p-2 md:px-8 h-11 rounded-md",
        icon: "h-10 w-10 p-2",
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
