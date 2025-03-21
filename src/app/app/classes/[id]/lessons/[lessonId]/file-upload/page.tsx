"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { toast } from "@/hooks/use-toast";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useMaterialsMutations } from "@/hooks/use-materials-mutations";
import { useClass } from "@/providers/class-context-provider";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadMaterialsView } from "./components/upload-materials-view";
import { SelectMaterialsView } from "./components/select-materials-view";
import { Form, FormField } from "@/components/ui/form";

import AddFilesButton from "@/components/ui/add-files-button";
import LabeledSwitch from "@/components/labeled-switch";
import SelectFormItem from "@/components/select-form-item";

import { type Id } from "convex/_generated/dataModel";
import UploadFilesButton from "@/components/upload-files-button";

export const FileUploadPage = () => {
  const [showUploaded, setShowUploaded] = useState(false);
  const router = useRouter();
  const { lessons, materials, classId } = useClass();
  const { addPDFToLesson } = useLessonMutations();
  const { uploadPDF } = useMaterialsMutations();
  const { lessonId }: { lessonId: Id<"lessons"> } = useParams();

  const form = useForm({
    defaultValues: {
      lesson: lessonId,
      selectedMaterials: [] as Id<"pdfs">[],
      uploadedMaterials: [] as File[],
    },
  });

  const uploadedMaterials = form.watch("uploadedMaterials", []);
  const selectedMaterials = form.watch("selectedMaterials", []);

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        await uploadPDF({
          lessonId,
          pdfFiles: res,
        });

        router.push(`/app/classes/${classId}/lessons/${lessonId}`);
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

  const handleAddPDFToLesson = () => {
    const selectedMaterials = form.getValues("selectedMaterials");

    void addPDFToLesson({
      pdfIds: selectedMaterials,
      lessonId: lessonId,
    });

    router.push(`/app/classes/${classId}/lessons/${lessonId}`);
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>
          Drag and drop your files here or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="lesson"
            render={({ field }) => (
              <SelectFormItem
                {...field}
                items={lessons}
                label="Lesson"
                placeholder="Select a lesson"
                defaultValue="none"
                onChange={field.onChange}
                description="You can link material to a specific lesson."
                disabled
              />
            )}
          />

          <LabeledSwitch
            id="select-from-uploaded"
            checked={showUploaded}
            onCheckedChange={setShowUploaded}
            label="Select from already uploaded materials"
          />

          {!showUploaded ? (
            <UploadMaterialsView
              setValue={form.setValue}
              control={form.control}
              uploadedMaterials={uploadedMaterials}
            />
          ) : (
            <SelectMaterialsView
              materials={materials}
              control={form.control}
              lessonId={lessonId}
            />
          )}

          <CardFooter>
            {showUploaded ? (
              <AddFilesButton
                selectedMaterials={selectedMaterials}
                startAdding={handleAddPDFToLesson}
              />
            ) : (
              <UploadFilesButton
                className="w-full"
                startUpload={startUpload}
                uploadedMaterials={uploadedMaterials}
                isUploading={isUploading}
              />
            )}
          </CardFooter>
        </Form>
      </CardContent>
    </Card>
  );
};
export default FileUploadPage;
