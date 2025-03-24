"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import UploadMaterialsView from "./components/upload-materials-view";
import LabeledSwitch from "@/components/labeled-switch";
import SelectMaterialsView from "./components/select-materials-view";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { toast } from "@/hooks/use-toast";

import { Loader2 } from "lucide-react";

import { type LessonFormData } from "@/types/lesson";
import { type Id } from "convex/_generated/dataModel";

const formSchema = z.object({
  lessonTitle: z
    .string()
    .min(1, "Lesson title is required")
    .max(50, "Lesson title cannot be longer than 50 characters"),
  lessonDescription: z
    .string()
    .min(1, "Lesson description is required")
    .max(200, "Lesson description cannot be longer than 200 characters"),
  uploadedMaterials: z.array(z.instanceof(File)),
  selectedMaterials: z.array(z.custom<Id<"pdfs">>()),
});

type FormData = z.infer<typeof formSchema>;

export default function NewLessonPage() {
  const router = useRouter();
  const [showUploaded, setShowUploaded] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonTitle: "",
      lessonDescription: "",
      uploadedMaterials: [],
      selectedMaterials: [],
    },
  });

  const { handleSubmit, control, setValue, watch } = form;
  const {
    createLesson,
    createLessonWithExistingMaterials,
    createLessonWithNewMaterials,
    classId,
    allMaterials,
  } = useLessonMutations();

  const uploadedMaterials = watch("uploadedMaterials", []);
  const selectedMaterials = watch("selectedMaterials", []);

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        await createLessonWithNewMaterials(form.getValues(), res);
        router.push(`/app/classes/${classId}`);
      }
    },
    onUploadError: () => {
      toast({
        title: "Error",
        description: "Something went wrong with the upload. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    if (!uploadedMaterials.length && !selectedMaterials.length) {
      await createLesson(data);
      router.push(`/app/classes/${classId}`);
      return;
    }

    if (uploadedMaterials.length && !showUploaded) {
      await startUpload(uploadedMaterials);
      return;
    }

    if (selectedMaterials.length && showUploaded) {
      await createLessonWithExistingMaterials(data, selectedMaterials);
      router.push(`/app/classes/${classId}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 mx-auto mt-6 space-y-6">
          <FormField
            control={form.control}
            name="lessonTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter lesson title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lessonDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter lesson description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
              control={control}
              uploadedMaterials={uploadedMaterials}
              setValue={setValue}
            />
          ) : (
            <SelectMaterialsView
              control={control}
              allMaterials={allMaterials}
            />
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/app/classes/${classId}`}>Cancel</Link>
            </Button>

            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating lesson...
                </>
              ) : (
                "Create Lesson"
              )}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
