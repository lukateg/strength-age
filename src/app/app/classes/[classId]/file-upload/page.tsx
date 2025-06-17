"use client";

import * as z from "zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useClass } from "@/providers/class-context-provider";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";

import FileUploadComponent from "@/components/file-upload/file-upload";
import UploadFilesButton from "@/components/upload-files-button";
import UploadedMaterialsList from "@/components/file-upload/uploaded-materials-list";
import FormSelect from "@/components/form-select";
import SectionHeader from "@/components/page-components/page-header";
import NotFound from "@/components/not-found";
import PageSkeleton from "@/components/page-components/main-page-skeleton";
import TotalStorageUsedCard from "@/components/file-upload/total-storage-used-card";

import { type Id } from "../../../../../../convex/_generated/dataModel";
import { useUserContext } from "@/providers/user-provider";
import { LIMITATIONS } from "@/shared/constants";

const formSchema = z.object({
  lessonId: z.custom<Id<"lessons">>(),
  materialsToUpload: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file."),
});

type FormData = z.infer<typeof formSchema>;

export default function FileUploadPage() {
  const { classData } = useClass();
  const { user } = useUserContext();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { lessonId: "", materialsToUpload: [] },
  });
  const { watch, setValue } = form;
  const { uploadNewPdfsToLesson, isUploading, isPending } =
    useLessonMutations();

  const materialsToUpload = watch("materialsToUpload", []);
  const storageLimit =
    LIMITATIONS[user.data?.subscriptionTier ?? "free"].materials;

  const handleUpload = async () => {
    void uploadNewPdfsToLesson({
      lessonId: form.getValues("lessonId"),
      materialsToUpload,
    });

    router.push(`/app/classes/${classData.data?.class_._id}`);
  };

  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue("materialsToUpload", [...materialsToUpload, ...newMaterials], {
        shouldValidate: true,
      });
    }
  };

  if (classData.isError) {
    return <NotFound />;
  }

  if (classData.isPending) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title={classData.data?.class_.title}
        description={classData.data?.class_.description}
        backRoute={`/app/classes/${classData.data?.class_._id}`}
        editButtonText={"Upload Materials"}
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
              control={form.control}
              name="lessonId"
              render={({ field }) => (
                <FormSelect
                  items={classData.data?.lessons}
                  label="Select Lesson"
                  placeholder="none"
                  defaultValue="none"
                  onChange={field.onChange}
                  description="You can link material to a specific lesson."
                />
              )}
            />
          </Form>

          <FileUploadComponent
            onDrop={handleFileChange}
            existingFiles={materialsToUpload}
            storageUsed={user.data?.totalStorageUsage ?? 0}
            storageLimit={storageLimit}
          />

          {!!materialsToUpload.length && (
            <UploadedMaterialsList
              materialsToUpload={materialsToUpload}
              setValue={setValue}
            />
          )}
        </CardContent>

        <CardFooter>
          <UploadFilesButton
            startUpload={handleUpload}
            materialsToUpload={materialsToUpload}
            isUploading={isUploading || isPending}
            className="w-full"
          />
        </CardFooter>
      </Card>
    </div>
  );
}
