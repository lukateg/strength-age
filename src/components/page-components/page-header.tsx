import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { type ReactNode } from "react";

export default function SectionHeader({
  title,
  description,
  backRoute,
  actionButton,
}: {
  title: string;
  description?: string;
  backRoute: string;
  actionButton?: ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={backRoute}>
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {actionButton}
      </div>
    </div>
  );
}
