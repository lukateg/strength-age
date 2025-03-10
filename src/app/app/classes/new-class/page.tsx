"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useClasses } from "@/providers/classes-provider";
import { useRouter } from "next/navigation";

interface ClassFormData {
  title: string;
  description: string;
}

// TODO:
// - add error handling and loading

export default function NewClassPage() {
  const router = useRouter();
  const { createClassMutation } = useClasses();
  const { register, handleSubmit } = useForm<ClassFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: ClassFormData) => {
    void createClassMutation(data).then(() => router.push("/app/classes"));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">New Class</h1>
          <p className="text-muted-foreground mt-2">
            Create your classes and materials
          </p>
        </div>
      </div>

      <Card className="p-6 mx-auto mt-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="classTitle">Class Title</Label>
            <Input
              id="classTitle"
              placeholder="Enter class title"
              className="w-full"
              {...register("title", {
                required: "Class title is required",
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classDescription">Class Description</Label>
            <Textarea
              id="classDescription"
              placeholder="Enter class description"
              className="min-h-[120px]"
              {...register("description", {
                required: "Class description is required",
              })}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/app/classes`}>Cancel</Link>
            </Button>
            <Button type="submit">Create Class</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
