"use client";

import {
  useForm,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploadComponent from "@/components/file-upload";

import { useUploadThing } from "@/hooks/use-upload-thing";
import { useClass } from "@/providers/class-context-provider";

import { X, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { FormField, FormItem, FormControl, Form } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { type Id } from "convex/_generated/dataModel";

// TODO:
// - add validation
// - add error handling
// - add loading state
// - add success state
// - create a reusable upload material component and use it here and in the materials section

interface LessonFormData {
  lessonTitle: string;
  lessonDescription: string;
  uploadedMaterials: File[];
  selectedMaterials: Id<"pdfs">[];
}

// const DEFAULT_FORM_VALUES

export default function NewLessonPage() {
  const {
    classId,
    createLessonWithNewMaterialsMutation,
    userId,
    createLessonMutation,
    createLessonWithExistingMaterialsMutation,
    materials: allMaterials,
  } = useClass();
  const router = useRouter();
  const [showUploaded, setShowUploaded] = useState(false);
  const form = useForm<LessonFormData>({
    defaultValues: {
      lessonTitle: "",
      lessonDescription: "",
      uploadedMaterials: [],
      selectedMaterials: [],
    },
  });

  const { register, handleSubmit, control, setValue, watch } = form;

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        if (res[0]?.serverData.uploadedBy) {
          const { lessonDescription, lessonTitle } =
            control._formValues as LessonFormData;
          const pdfFiles = res.map((pdf) => ({
            fileUrl: pdf.ufsUrl,
            name: pdf.name,
          }));
          void createLessonWithNewMaterialsMutation({
            userId: res[0]?.serverData.uploadedBy,
            classId,
            title: lessonTitle,
            description: lessonDescription,
            pdfFiles,
          });

          router.push(`/app/classes/${classId}`);
          toast({
            title: "Success",
            description: "Uploaded successfully.",
            variant: "default",
          });
        }
      }
    },
    onUploadError: () => {
      toast({
        title: "Error",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadedMaterials = watch("uploadedMaterials", []);
  const selectedMaterials = watch("selectedMaterials", []);

  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue("uploadedMaterials", [...uploadedMaterials, ...newMaterials], {
        shouldValidate: true,
      });
    }
  };

  const removeMaterial = (name: string) => {
    setValue(
      "uploadedMaterials",
      uploadedMaterials.filter((material) => material.name !== name),
      { shouldValidate: true }
    );
  };
  const onSubmit = (data: LessonFormData) => {
    if (!userId) return;

    if (!uploadedMaterials.length && !selectedMaterials.length) {
      console.log("no materials case");
      void createLessonMutation({
        userId,
        classId,
        title: data.lessonTitle,
        description: data.lessonDescription,
      });
      toast({
        title: "Success",
        description: "Lesson created successfully.",
        variant: "default",
      });
      router.push(`/app/classes/${classId}`);
      return;
    }

    if (uploadedMaterials.length && !showUploaded) {
      console.log("uploaded materials case");
      void startUpload(uploadedMaterials);
      return;
    }

    if (selectedMaterials.length && showUploaded) {
      console.log("existing materials case");
      void createLessonWithExistingMaterialsMutation({
        userId,
        classId,
        title: data.lessonTitle,
        description: data.lessonDescription,
        pdfIds: selectedMaterials,
      }).then(() => {
        toast({
          title: "Success",
          description: "Lesson created with existing materials.",
          variant: "default",
        });
        router.push(`/app/classes/${classId}`);
      });
    }
  };

  const toggleCheckedMaterial = (
    checked: CheckedState,
    pdfId: Id<"pdfs">,
    field: ControllerRenderProps<LessonFormData, "selectedMaterials">
  ) => {
    return checked
      ? field.onChange([...field.value, pdfId])
      : field.onChange(field.value?.filter((value) => value !== pdfId));
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 mx-auto mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="lessonTitle">Lesson Title</Label>
            <Input
              id="lessonTitle"
              placeholder="Enter lesson title"
              className="w-full"
              {...register("lessonTitle", {
                required: "Lesson title is required",
              })}
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

          <div className="flex items-center space-x-2">
            <Switch
              id="select-from-uploaded"
              checked={showUploaded}
              onCheckedChange={setShowUploaded}
            />
            <Label htmlFor="select-from-uploaded">
              Select from already uploaded materials
            </Label>
          </div>

          {!showUploaded ? (
            <div className="space-y-4">
              <Label>Materials</Label>

              <Controller
                name="uploadedMaterials"
                control={control}
                render={() => <FileUploadComponent onDrop={handleFileChange} />}
              />

              {uploadedMaterials.length > 0 && (
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="mt-8 space-y-4">
                    {uploadedMaterials.map((file, index) => (
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
          ) : (
            <div className="space-y-4">
              {allMaterials?.map((pdf) => (
                <FormField
                  key={pdf._id}
                  control={control}
                  name="selectedMaterials"
                  render={({ field }) => (
                    <FormItem
                      key={pdf._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(pdf._id)}
                            onCheckedChange={(checked) =>
                              toggleCheckedMaterial(checked, pdf._id, field)
                            }
                          />
                        </FormControl>
                        <div className="flex items-center">
                          <Label className="cursor-pointer">
                            {pdf.fileUrl}
                          </Label>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {/* File Upload */}

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/app/classes/${classId}`}>Cancel</Link>
            </Button>
            <Button type="submit">Create Lesson</Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
