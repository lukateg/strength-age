"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useClass } from "@/providers/class-context-provider";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addLessonMaterialsSchema } from "@/lib/schemas";

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
import UploadFilesButton from "@/components/upload-files-button";

import { type Id } from "convex/_generated/dataModel";

type FormData = z.infer<ReturnType<typeof addLessonMaterialsSchema>>;

export default function FileUploadPage() {
  const [showExistingMaterials, setShowExistingMaterials] = useState(false);
  const router = useRouter();
  const { lessons, materials, classId } = useClass();
  const { addExistingPdfsToLesson, uploadNewPdfsToLesson, isUploading } =
    useLessonMutations();
  // const { uploadNewPdfsToLesson } = useMaterialsMutations();
  const { lessonId }: { lessonId: Id<"lessons"> } = useParams();

  const form = useForm<FormData>({
    resolver: zodResolver(addLessonMaterialsSchema(showExistingMaterials)),
    defaultValues: {
      lessonId,
      selectedMaterials: [] as Id<"pdfs">[],
      uploadedMaterials: [] as File[],
    },
  });

  const { control, watch, getValues, setValue, clearErrors, handleSubmit } =
    form;

  const uploadedMaterials = watch("uploadedMaterials", []);
  const selectedMaterials = watch("selectedMaterials", []);

  const handleAddPDFToLesson = async () => {
    const selectedMaterials = getValues("selectedMaterials");
    void addExistingPdfsToLesson({
      pdfIds: selectedMaterials,
      lessonId: lessonId,
    });

    router.push(`/app/classes/${classId}/lessons/${lessonId}`);
  };

  const handleUploadNewPdfsToLesson = async () => {
    const uploadedMaterials = getValues("uploadedMaterials");
    void uploadNewPdfsToLesson({ lessonId, uploadedMaterials });

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
            control={control}
            name="lessonId"
            render={({ field }) => (
              <SelectFormItem
                {...field}
                items={lessons.data}
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
            checked={showExistingMaterials}
            onCheckedChange={(checked) => {
              setShowExistingMaterials(checked);
              clearErrors();
            }}
            label="Select from already uploaded materials"
          />

          {!showExistingMaterials ? (
            <UploadMaterialsView
              setValue={setValue}
              control={control}
              uploadedMaterials={uploadedMaterials}
            />
          ) : (
            <SelectMaterialsView
              materials={materials.data}
              control={control}
              lessonId={lessonId}
            />
          )}

          <CardFooter>
            {showExistingMaterials ? (
              <AddFilesButton
                selectedMaterials={selectedMaterials}
                startAdding={handleSubmit(handleAddPDFToLesson)}
              />
            ) : (
              <UploadFilesButton
                className="w-full"
                startUpload={handleUploadNewPdfsToLesson}
                uploadedMaterials={uploadedMaterials}
                isUploading={isUploading}
              />
            )}
          </CardFooter>
        </Form>
      </CardContent>
    </Card>
  );
}
