"use client";
import { api } from "../../../../../convex/_generated/api";

import { useClassMutations } from "@/hooks/use-class-mutation";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { useRouter, useSearchParams } from "next/navigation";
import NotFound from "@/components/not-found";
import ClassFormSkeleton from "../components/class-form-skeleton";
import ClassForm, { type ClassFormData } from "../components/class-form";

export default function EditClassPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateClass } = useClassMutations();
  const classId = searchParams.get("id");
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
    }).then(() => router.push("/app/classes"));
  };

  if (classRequest.status === "pending") {
    return <ClassFormSkeleton />;
  }

  if (classRequest.status === "error") {
    return <NotFound />;
  }

  if (classRequest.status === "success") {
    return (
      <ClassForm
        onSubmit={onSubmit}
        isEditMode={true}
        defaultValues={{
          ...classRequest.data,
        }}
      />
    );
  }
}
