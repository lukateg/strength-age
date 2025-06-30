import ItemsScrollArea from "@/components/items-scroll-area";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListCardProps<T> {
  title: string;
  description: string;
  items?: T[] | null;
  isLoading?: boolean;
  emptyMessage?: string;
  renderItem: (item: T) => React.ReactNode;
  height?: string;
  cardAction?: React.ReactNode;
}

export default function ListCard<T>({
  title,
  description,
  items,
  isLoading,
  emptyMessage = "No items found",
  renderItem,
  height = "h-[400px] md:h-[600px]",
  cardAction,
}: ListCardProps<T>) {
  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {cardAction && <div className="self-end">{cardAction}</div>}
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className={cn(height, "overflow-y-auto")}>
          {items && items.length > 0 ? (
            items.map((item) => renderItem(item))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}

interface ListItemProps {
  icon: LucideIcon;
  title: string;
  children?: React.ReactNode;
}

export function ListItem({ icon: Icon, title, children }: ListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b ">
      <div className="flex items-center">
        <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm md:text-base max-w-[14ch] lg:max-w-[20ch] w-[14ch] md:w-full text-ellipsis overflow-hidden whitespace-nowrap">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
