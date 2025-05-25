"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useClass } from "@/providers/class-context-provider";
import { useQuery } from "convex/react";

import type * as z from "zod";
import { api } from "../../../../../../../../convex/_generated/api";
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

import { type Id } from "convex/_generated/dataModel";

type FormData = z.infer<ReturnType<typeof addLessonMaterialsSchema>>;

export default function FileUploadPage() {
  const [showExistingMaterials, setShowExistingMaterials] = useState(false);
  const router = useRouter();
  const { lessonsByClass, materialsByClass } = useClass();
  const { addExistingPdfsToLesson, uploadNewPdfsToLesson, isUploading } =
    useLessonMutations();
  const { lessonId, classId }: { lessonId: string; classId: string } =
    useParams();
  const lessonData = useQuery(api.lessons.getLessonById, {
    lessonId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(addLessonMaterialsSchema(showExistingMaterials)),
    defaultValues: {
      lessonId,
      materialsToAdd: [] as Id<"pdfs">[],
      materialsToUpload: [] as File[],
    },
  });
  const uploadedPdfs = useQuery(api.lessons.getPDFsByLessonId, {
    lessonId,
  });

  const { control, watch, getValues, setValue, clearErrors, handleSubmit } =
    form;

  const materialsToUpload = watch("materialsToUpload", []);
  const materialsToAdd = watch("materialsToAdd", []);

  const handleAddPDFToLesson = async () => {
    const materialsToAdd = getValues("materialsToAdd");
    void addExistingPdfsToLesson({
      pdfIds: materialsToAdd,
      lessonId: lessonId,
    });

    router.push(`/app/classes/${classId}/lessons/${lessonId}`);
  };

  const handleUploadNewPdfsToLesson = async () => {
    const materialsToUpload = getValues("materialsToUpload");
    void uploadNewPdfsToLesson({ lessonId, materialsToUpload });

    router.push(`/app/classes/${classId}/lessons/${lessonId}`);
  };
  // TODO implement suspense
  if (!lessonData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title={lessonData?.title}
        description={lessonData?.description}
        backRoute={`/app/classes/${classId}/lessons/${lessonId}`}
        editRoute={`/app/classes/${classId}/edit-lesson?lessonId=${lessonId}`}
        editButtonText={"Edit Lesson"}
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
                  items={lessonsByClass.data}
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
              allMaterials={materialsByClass.data}
              control={control}
              setValue={setValue}
              clearErrors={clearErrors}
              uploadedPdfs={uploadedPdfs}
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
