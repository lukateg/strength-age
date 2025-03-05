"use client";

import { useForm, Controller } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { X, File } from "lucide-react";
import FileUploadComponent from "@/components/file-upload";
import { useClass } from "@/providers/class-context-provider";
import Link from "next/link";

// TODO:
// - add validation
// - add error handling
// - add loading state
// - add success state
// - create a reusable upload material component and use it here and in the materials section

// - ON SUBMIT: add uploadThing logic and on complete update convex database with new lesson

// interface Material {
//   id: string;
//   name: string;
//   size: string;
// }

interface LessonFormData {
  lessonName: string;
  lessonDescription: string;
  materials: File[];
}

export default function NewLessonPage() {
  const { classId } = useClass();
  const { register, handleSubmit, control, setValue, watch } =
    useForm<LessonFormData>({
      defaultValues: {
        lessonName: "",
        lessonDescription: "",
        materials: [],
      },
    });

  const materials = watch("materials", []);

  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue("materials", [...materials, ...newMaterials], {
        shouldValidate: true,
      });
    }
  };

  const removeMaterial = (name: string) => {
    setValue(
      "materials",
      materials.filter((material) => material.name !== name),
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: LessonFormData) => {
    console.log("Submitted Lesson Data:", data);
    // Handle form submission logic here (API call, etc.)
  };

  return (
    <Card className="p-6 mx-auto mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Lesson Name */}
        <div className="space-y-2">
          <Label htmlFor="lessonName">Lesson Name</Label>
          <Input
            id="lessonName"
            placeholder="Enter lesson name"
            className="w-full"
            {...register("lessonName", { required: "Lesson name is required" })}
          />
        </div>

        {/* Lesson Description */}
        <div className="space-y-2">
          <Label htmlFor="lessonDescription">Lesson Description</Label>
          <Textarea
            id="lessonDescription"
            placeholder="Enter lesson description"
            className="min-h-[120px]"
            {...register("lessonDescription", {
              required: "Lesson description is required",
            })}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <Label>Materials</Label>

          <Controller
            name="materials"
            control={control}
            render={() => <FileUploadComponent onDrop={handleFileChange} />}
          />

          {materials.length > 0 && (
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="mt-8 space-y-4">
                {materials.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <File className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMaterial(file.name)}
                      // disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/app/classes/${classId}`}>Cancel</Link>
          </Button>
          <Button type="submit">Create Lesson</Button>
        </div>
      </form>
    </Card>
  );
}
