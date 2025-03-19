"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { useClass } from "@/providers/class-context-provider";
import { useRouter, useParams } from "next/navigation";

import { type Id } from "convex/_generated/dataModel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileUploadView } from "./components/file-upload-view";
import { ExistingMaterialsView } from "./components/existing-material-view";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useMaterialsMutations } from "@/hooks/use-materials-mutations";

export const FileUploadPage = () => {
  const [showUploaded, setShowUploaded] = useState(false);
  const router = useRouter();
  const { lessons, materials, classId } = useClass();
  const { addPDFToLesson } = useLessonMutations();
  const { uploadPDF } = useMaterialsMutations();
  const { lessonId }: { lessonId: string } = useParams();

  const form = useForm({
    defaultValues: {
      lesson: String(lessonId),
      selectedMaterials: [] as Id<"pdfs">[],
    },
  });

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        try {
          await uploadPDF({
            lessonId,
            pdfFiles: res,
          });

          router.push(`/app/classes/${classId}/lessons/${lessonId}`);
        } catch (error) {
          console.error("Error in upload completion:", error);
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

  const handleAddPDFToLesson = () => {
    const selectedMaterials = form.getValues("selectedMaterials");

    void addPDFToLesson({
      pdfIds: selectedMaterials,
      lessonId: lessonId,
    });

    router.push(`/app/classes/${classId}/lessons/${lessonId}`);
  };

  return (
    <Card className=" m-4">
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
              <FormItem>
                <FormLabel>Lesson</FormLabel>
                <Select onValueChange={field.onChange} {...field} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">none</SelectItem>
                    {lessons?.map((lesson) => (
                      <SelectItem key={lesson._id} value={lesson._id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  You can link material to a specific lesson.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
            <FileUploadView
              isUploading={isUploading}
              startUpload={startUpload}
            />
          ) : (
            <ExistingMaterialsView
              materials={materials}
              form={form}
              lessonId={lessonId}
              addPDFToLesson={handleAddPDFToLesson}
            />
          )}
        </Form>
      </CardContent>
    </Card>
  );
};
export default FileUploadPage;
