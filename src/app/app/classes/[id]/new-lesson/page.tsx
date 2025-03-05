"use client";

import { useForm, Controller } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Upload, Plus, X } from "lucide-react";

// TODO:
// - add validation
// - add error handling
// - add loading state
// - add success state
// - create a reusable upload material component and use it here and in the materials section

interface Material {
  id: string;
  name: string;
  size: string;
}

interface LessonFormData {
  lessonName: string;
  lessonDescription: string;
  materials: Material[];
}

export default function NewLessonPage() {
  const { register, handleSubmit, control, setValue, watch } =
    useForm<LessonFormData>({
      defaultValues: {
        lessonName: "",
        lessonDescription: "",
        materials: [],
      },
    });

  const materials = watch("materials", []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newMaterials = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      }));
      setValue("materials", [...materials, ...newMaterials], {
        shouldValidate: true,
      });
    }
  };

  const removeMaterial = (id: string) => {
    setValue(
      "materials",
      materials.filter((material) => material.id !== id),
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
            render={() => (
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-24 border-dashed"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Upload Materials</span>
                    <span className="text-xs text-muted-foreground">
                      Drag and drop or click to upload
                    </span>
                  </div>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          />

          {materials.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {material.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({material.size})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeMaterial(material.id)}
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
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Lesson</Button>
        </div>
      </form>
    </Card>
  );
}
