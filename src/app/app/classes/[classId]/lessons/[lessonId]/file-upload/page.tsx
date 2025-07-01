"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useClass } from "@/providers/class-context-provider";
import { useLesson } from "@/providers/lesson-provider";
import { useUserContext } from "@/providers/user-provider";

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
import Link from "next/link";
import QueryState from "@/components/data-query/query-state";
import LessonFileUploadSkeleton from "./components/lesson-file-upload-skeleton";

import { LIMITATIONS } from "@/lib/limitations";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { type Id } from "convex/_generated/dataModel";

type FormData = z.infer<ReturnType<typeof addLessonMaterialsSchema>>;

export default function FileUploadPage() {
  const [showExistingMaterials, setShowExistingMaterials] = useState(false);
  const router = useRouter();
  const {
    addExistingPdfsToLesson,
    uploadNewPdfsToLesson,
    isUploading,
    isPending,
  } = useLessonMutations();
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

  const handleAddPDFToLesson = async (lessonId: Id<"lessons">) => {
    const materialsToAdd = getValues("materialsToAdd");
    void addExistingPdfsToLesson({
      pdfIds: materialsToAdd,
      lessonId,
    });

    router.push(`/app/classes/${lesson.data?.classId}/lessons/${lessonId}`);
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
    <QueryState query={lesson} pending={<LessonFileUploadSkeleton />}>
      {(data) => (
        <div className="space-y-6">
          <SectionHeader
            title={data.title}
            description={data.description}
            backRoute={`/app/classes/${data.classId}/lessons/${data.lessonId}`}
            actionButton={
              <Button className="text-xs md:text-base" asChild>
                <Link
                  href={`/app/classes/${data.classId}/lessons/${data.lessonId}/edit-lesso`}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Lesson
                </Link>
              </Button>
            }
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
                  uploadedPdfs={data.materials}
                  storageLimit={storageLimit}
                  storageUsed={user.data?.totalStorageUsage ?? 0}
                />

                <CardFooter>
                  {showExistingMaterials ? (
                    <AddFilesButton
                      materialsToAdd={materialsToAdd}
                      startAdding={handleSubmit((data) =>
                        handleAddPDFToLesson(data.lessonId)
                      )}
                    />
                  ) : (
                    <UploadFilesButton
                      className="w-full"
                      startUpload={handleUploadNewPdfsToLesson}
                      materialsToUpload={materialsToUpload}
                      isUploading={isUploading || isPending}
                    />
                  )}
                </CardFooter>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </QueryState>
  );
}
