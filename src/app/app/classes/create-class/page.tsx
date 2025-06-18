"use client";

import { useClassMutations } from "@/hooks/use-class-mutations";

import { useRouter } from "next/navigation";

import ClassForm, { type ClassFormData } from "../components/class-form";

import SectionHeader from "@/components/page-components/page-header";

export default function CreateClassPage() {
  const router = useRouter();
  const { createClass, isPending } = useClassMutations();

  const onSubmit = async (data: ClassFormData) => {
    const classId = await createClass({
      title: data.title,
      description: data.description,
    });
    if (!classId) return;
    router.push(`/app/classes/${classId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-10">
      <SectionHeader
        title="New Class"
        description="Create your classes and materials"
        backRoute={"/app/classes"}
      />

      <ClassForm onSubmit={onSubmit} isSubmitting={isPending} />
    </div>
  );
}
