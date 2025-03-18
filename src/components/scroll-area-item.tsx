import { cn } from "@/lib/utils";

export default function ScrollAreaItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-muted rounded-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
