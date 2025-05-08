"use client";

import { useClassMutations } from "@/hooks/use-class-mutation";

import { useRouter } from "next/navigation";

import ClassForm, { type ClassFormData } from "../components/class-form";

export default function CreateClassPage() {
  const router = useRouter();
  const { createClass } = useClassMutations();

  const onSubmit = (data: ClassFormData) => {
    void createClass({
      title: data.title,
      description: data.description,
    }).then(() => router.push("/app/classes"));
  };

  return <ClassForm onSubmit={onSubmit} />;
}
