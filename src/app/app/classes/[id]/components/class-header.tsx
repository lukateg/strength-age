"use client";

import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "../../../../../../convex/_generated/api";
import { useQuery } from "convex/react";

import RedirectBackButton from "@/components/redirect-back-button";

import { type Id } from "convex/_generated/dataModel";

export default function ClassHeader({ id }: { id: Id<"classes"> }) {
  const classData = useQuery(api.classes.getClassById, { id });

  if (!classData) {
    return <div>Class not found</div>;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className=" flex items-center gap-4">
          <RedirectBackButton>
            <ArrowLeft className="h-6 w-6" />
          </RedirectBackButton>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{classData.title}</h1>
            </div>
            <p className="text-muted-foreground">{classData.description}</p>
          </div>
        </div>
        {/* <div>
        <Link href={`/app/classes/${id}`}>
          <h1 className="text-4xl font-bold">Advanced Mathematics</h1>
        </Link>
        <p className="text-muted-foreground mt-2">Professor: John Doe</p>
      </div> */}
        {/* <Link href={`/app/classes/${id}/file-upload`}> */}
        <Button>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Class
        </Button>
        {/* </Link> */}
      </div>
    </div>
  );
}
