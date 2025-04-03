"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const formSchema = (showExistingMaterials: boolean) =>
  z.object({
    lessonId: z.custom<Id<"lessons">>(),
    selectedMaterials: showExistingMaterials
      ? z
          .array(z.custom<Id<"pdfs">>())
          .min(1, "Please select at least one material")
      : z.array(z.custom<Id<"pdfs">>()),
    uploadedMaterials: !showExistingMaterials
      ? z.array(z.instanceof(File)).min(1, "Please upload at least one file")
      : z.array(z.instanceof(File)),
  });

type FormData = z.infer<ReturnType<typeof formSchema>>;

export default function FileUploadPage() {
  const [showExistingMaterials, setShowExistingMaterials] = useState(false);
  const router = useRouter();
  const { lessons, materials, classId } = useClass();
  const { addPDFToLesson } = useLessonMutations();
  const { uploadPDF } = useMaterialsMutations();
  const { lessonId }: { lessonId: Id<"lessons"> } = useParams();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema(showExistingMaterials)),
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

  const handleAddPDFToLesson = async () => {
    const selectedMaterials = getValues("selectedMaterials");

    await addPDFToLesson({
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
            control={control}
            name="lessonId"
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
              materials={materials}
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
                startUpload={() =>
                  handleSubmit(() => startUpload(uploadedMaterials))()
                }
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
