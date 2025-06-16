"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Form, FormField } from "@/components/ui/form";
import { AddMaterialsView } from "@/components/add-materials-section/add-materials-section";

import AddFilesButton from "@/components/ui/add-files-button";
import FormSelect from "@/components/form-select";
import SectionHeader from "@/components/page-components/page-header";
import UploadFilesButton from "@/components/upload-files-button";
import TotalStorageUsedCard from "@/components/file-upload/total-storage-used-card";

import { type Id } from "convex/_generated/dataModel";
import { useLesson } from "@/providers/lesson-provider";
import { useUserContext } from "@/providers/user-provider";

import { LIMITATIONS } from "@/shared/constants";

type FormData = z.infer<ReturnType<typeof addLessonMaterialsSchema>>;

export default function FileUploadPage() {
  const [showExistingMaterials, setShowExistingMaterials] = useState(false);
  const router = useRouter();
  const { addExistingPdfsToLesson, uploadNewPdfsToLesson, isUploading } =
    useLessonMutations();
  const { lesson } = useLesson();
  const { classData } = useClass();
  const { user } = useUserContext();

  const storageLimit =
    LIMITATIONS[user.data?.subscriptionTier ?? "free"].materials;

  const form = useForm<FormData>({
    resolver: zodResolver(addLessonMaterialsSchema(showExistingMaterials)),
    defaultValues: {
      lessonId: lesson.data?.lessonId,
      materialsToAdd: [] as Id<"pdfs">[],
      materialsToUpload: [] as File[],
    },
  });

  const { control, watch, getValues, setValue, clearErrors, handleSubmit } =
    form;

  const materialsToUpload = watch("materialsToUpload", []);
  const materialsToAdd = watch("materialsToAdd", []);

  // TODO implement suspense
  if (!lesson.data) {
    return <div>Loading...</div>;
  }

  const handleAddPDFToLesson = async () => {
    const materialsToAdd = getValues("materialsToAdd");
    void addExistingPdfsToLesson({
      pdfIds: materialsToAdd,
      lessonId: lesson.data?.lessonId,
    });

    router.push(
      `/app/classes/${lesson.data?.classId}/lessons/${lesson.data?.lessonId}`
    );
  };

  const handleUploadNewPdfsToLesson = async () => {
    const materialsToUpload = getValues("materialsToUpload");
    void uploadNewPdfsToLesson({
      lessonId: lesson.data?.lessonId,
      materialsToUpload,
    });

    router.push(
      `/app/classes/${lesson.data?.classId}/lessons/${lesson.data?.lessonId}`
    );
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        title={lesson.data?.title}
        description={lesson.data?.description}
        backRoute={`/app/classes/${lesson.data?.classId}/lessons/${lesson.data?.lessonId}`}
        editRoute={`/app/classes/${lesson.data?.classId}/lessons/${lesson.data?.lessonId}/edit-lesson`}
        editButtonText={"Edit Lesson"}
      />

      <TotalStorageUsedCard
        materialsToUpload={materialsToUpload}
        storageUsed={user.data?.totalStorageUsage ?? 0}
        maxStorageLimit={storageLimit}
      />

      <Card>
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
                <FormSelect
                  {...field}
                  items={classData.data?.lessons}
                  label="Lesson"
                  placeholder="Select a lesson"
                  defaultValue="none"
                  onChange={field.onChange}
                  description="You can link material to a specific lesson."
                  disabled
                />
              )}
            />

            <AddMaterialsView<FormData>
              showExistingMaterials={showExistingMaterials}
              onShowExistingMaterialsChange={setShowExistingMaterials}
              materialsToUpload={materialsToUpload}
              allMaterials={classData.data?.materials}
              control={control}
              setValue={setValue}
              clearErrors={clearErrors}
              uploadedPdfs={lesson.data?.materials}
              storageLimit={storageLimit}
              storageUsed={user.data?.totalStorageUsage ?? 0}
            />

            <CardFooter>
              {showExistingMaterials ? (
                <AddFilesButton
                  materialsToAdd={materialsToAdd}
                  startAdding={handleSubmit(handleAddPDFToLesson)}
                />
              ) : (
                <UploadFilesButton
                  className="w-full"
                  startUpload={handleUploadNewPdfsToLesson}
                  materialsToUpload={materialsToUpload}
                  isUploading={isUploading}
                />
              )}
            </CardFooter>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
