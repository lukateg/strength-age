import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

export default function SectionHeader({
  title,
  description,
  backRoute,
  editRoute,
  editButtonText,
}: {
  title: string;
  description?: string;
  backRoute: string;
  editRoute?: string;
  editButtonText?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className=" flex items-center gap-4">
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

        {editRoute && editButtonText && (
          <Button disabled className="text-xs md:text-base" asChild>
            <Link href={editRoute}>
              <Pencil className="h-4 w-4 mr-2" />
              {editButtonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
