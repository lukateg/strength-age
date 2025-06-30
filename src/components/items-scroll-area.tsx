import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export default function ItemsScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ScrollArea
      className={cn(
        "h-[340px] w-full rounded-md border overflow-y-auto",
        className
      )}
    >
      <div className="h-full">{children}</div>
    </ScrollArea>
  );
}
