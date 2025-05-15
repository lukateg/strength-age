"use client";

import { useClassMutations } from "@/hooks/use-class-mutations";

import { useRouter } from "next/navigation";

import ClassForm, { type ClassFormData } from "../components/class-form";
import RedirectBackButton from "@/components/redirect-back-button";

import { ArrowLeft, BookOpen } from "lucide-react";

export default function CreateClassPage() {
  const router = useRouter();
  const { createClass } = useClassMutations();

  const onSubmit = (data: ClassFormData) => {
    void createClass({
      title: data.title,
      description: data.description,
    }).then(() => router.push("/app/classes"));
  };

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="flex items-center gap-4">
        <RedirectBackButton>
          <ArrowLeft className="h-6 w-6" />
        </RedirectBackButton>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">New Class</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Create your classes and materials
          </p>
        </div>
      </div>
      <ClassForm onSubmit={onSubmit} />
    </div>
  );
}
