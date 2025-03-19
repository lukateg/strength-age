import { ScrollArea } from "./ui/scroll-area";

export default function ItemsScrollArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollArea className="h-[340px] w-full rounded-md border p-4">
      <div className="mt-4 space-y-4">{children}</div>
    </ScrollArea>
  );
}
