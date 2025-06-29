import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ProBorderProps {
  children: ReactNode;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

export function ProBorder({
  children,
  className,
  rounded = "md",
}: ProBorderProps) {
  const roundedClass = `rounded-${rounded}`;

  return (
    <div className={cn("bg-pro p-0.5", roundedClass, className)}>
      <div className={cn("bg-background h-full w-full", roundedClass)}>
        {children}
      </div>
    </div>
  );
}
