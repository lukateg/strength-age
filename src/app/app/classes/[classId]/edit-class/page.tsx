"use client";

import { useRouter } from "next/navigation";
import { useClassMutations } from "@/hooks/use-class-mutations";

import NotFound from "@/components/not-found";
import ClassFormSkeleton from "../../components/class-form-skeleton";
import ClassForm, { type ClassFormData } from "../../components/class-form";
import RedirectBackButton from "@/components/redirect-back-button";
import DangerZone from "@/components/danger-zone";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useClass } from "@/providers/class-context-provider";
import { getPreviousRoute } from "@/lib/utils";

// TODO: choose between using the class context provider or the query

export default function EditClassPage() {
  const router = useRouter();
  const { updateClass, deleteClass, isPending } = useClassMutations();
  const { classData } = useClass();

  const onSubmit = (data: ClassFormData) => {
    void updateClass({
      classId: classData.data?.class_._id ?? "skip",
      title: data.title,
      description: data.description,
    }).then(() => router.back());
  };

  if (classData.isPending) {
    return <ClassFormSkeleton />;
  }

  if (classData.isError) {
    return <NotFound />;
  }

  if (!classData.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Class not found</h3>
        <p className="text-muted-foreground mt-2">
          The class you are looking for does not exist anymore.
        </p>
      </div>
    );
  }

  const { permissions } = classData.data;

  if (classData.data) {
    return (
      <>
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
            ...classData.data.class_,
          }}
          isSubmitting={isPending}
        />

        {permissions.canDeleteClass && (
          <DangerZone
            onDelete={() => {
              void deleteClass(classData.data?.class_._id ?? "skip").then(() =>
                router.back()
              );
            }}
            isDeleting={isPending}
          />
        )}
      </>
    );
  }
}
