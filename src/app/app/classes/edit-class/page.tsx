"use client";
import { api } from "../../../../../convex/_generated/api";

import { useRouter, useSearchParams } from "next/navigation";
import { useClassMutations } from "@/hooks/use-class-mutations";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import NotFound from "@/components/not-found";
import ClassFormSkeleton from "../components/class-form-skeleton";
import ClassForm, { type ClassFormData } from "../components/class-form";
import RedirectBackButton from "@/components/redirect-back-button";
import DangerZone from "@/components/danger-zone";

import { ArrowLeft, BookOpen } from "lucide-react";

export default function EditClassPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateClass, deleteClass } = useClassMutations();
  const classId = searchParams.get("classId");
  const classRequest = useAuthenticatedQueryWithStatus(
    api.classes.getClassById,
    {
      id: classId ?? "skip",
    }
  );

  const onSubmit = (data: ClassFormData) => {
    void updateClass({
      classId: classId ?? "skip",
      title: data.title,
      description: data.description,
    }).then(() => router.back());
  };

  if (classRequest.status === "pending") {
    return <ClassFormSkeleton />;
  }

  if (classRequest.status === "error") {
    return <NotFound />;
  }

  if (!classRequest.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Class not found</h3>
        <p className="text-muted-foreground mt-2">
          The class you are looking for does not exist anymore.
        </p>
      </div>
    );
  }

  if (classRequest.status === "success") {
    return (
      <div className="container mx-auto p-6 space-y-10">
        <div className="flex items-center gap-4">
          <RedirectBackButton>
            <ArrowLeft className="h-6 w-6" />
          </RedirectBackButton>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold">Edit Class</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Edit your class details
            </p>
          </div>
        </div>

        <ClassForm
          onSubmit={onSubmit}
          isEditMode={true}
          defaultValues={{
            ...classRequest.data,
          }}
        />

        <DangerZone
          onDelete={() => {
            void deleteClass(classId ?? "skip").then(() => router.back());
          }}
        />
      </div>
    );
  }
}
