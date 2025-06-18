"use client";

import { useRouter } from "next/navigation";
import { useClassMutations } from "@/hooks/use-class-mutations";

import NotFound from "@/components/data-query/not-found";
import ClassFormSkeleton from "../../components/class-form-skeleton";
import ClassForm, { type ClassFormData } from "../../components/class-form";
import RedirectBackButton from "@/components/redirect-back-button";
import DangerZone from "@/components/danger-zone";
import QueryState from "@/components/data-query/query-state";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useClass } from "@/providers/class-context-provider";

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

  return (
    <QueryState
      query={classData}
      pending={<ClassFormSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const { permissions } = data;
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
                ...data.class_,
              }}
              isSubmitting={isPending}
            />

            {permissions.canDeleteClass && (
              <DangerZone
                onDelete={() => {
                  void deleteClass(data.class_._id ?? "skip").then(() =>
                    router.back()
                  );
                }}
                isDeleting={isPending}
              />
            )}
          </>
        );
      }}
    </QueryState>
  );
}
