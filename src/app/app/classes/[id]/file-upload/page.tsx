"use client";

import * as z from "zod";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@/hooks/use-toast";
import { useUploadThing } from "@/hooks/use-upload-thing";
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
import { Form, FormField } from "@/components/ui/form";

import FileUploadComponent from "@/components/file-upload";
import UploadFilesButton from "@/components/upload-files-button";
import UploadedMaterialsList from "@/components/uploaded-materials-list";
import SelectFormItem from "@/components/select-form-item";

import { type Id } from "convex/_generated/dataModel";

const formSchema = z.object({
  lessonId: z.custom<Id<"lessons">>(),
  uploadedMaterials: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file."),
});

type FormData = z.infer<typeof formSchema>;

export default function FileUploadPage() {
  const { classId, lessons } = useClass();
  const { uploadPDF } = useMaterialsMutations();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { lessonId: "", uploadedMaterials: [] },
  });
  const { watch, setValue } = form;

  const uploadedMaterials = watch("uploadedMaterials", []);

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        void uploadPDF({
          lessonId: form.getValues("lessonId"),
          pdfFiles: res,
        });

        // TODO: redirect to the all materials page
        router.push(`/app/classes/${classId}`);
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

  const handleFileChange = (newMaterials: File[]) => {
    if (newMaterials.length) {
      setValue("uploadedMaterials", [...uploadedMaterials, ...newMaterials], {
        shouldValidate: true,
      });
    }
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
            name="lessonId"
            render={({ field }) => (
              <SelectFormItem
                items={lessons}
                label="Select Lesson"
                placeholder="none"
                defaultValue="none"
                onChange={field.onChange}
                description="You can link material to a specific lesson."
              />
            )}
          />
        </Form>

        <Controller
          name="uploadedMaterials"
          control={form.control}
          render={() => (
            <FileUploadComponent
              onDrop={handleFileChange}
              existingFiles={uploadedMaterials}
            />
          )}
        />

        {!!uploadedMaterials.length && (
          <UploadedMaterialsList
            uploadedMaterials={uploadedMaterials}
            setValue={setValue}
          />
        )}
      </CardContent>

      <CardFooter>
        <UploadFilesButton
          startUpload={startUpload}
          uploadedMaterials={uploadedMaterials}
          isUploading={isUploading}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
