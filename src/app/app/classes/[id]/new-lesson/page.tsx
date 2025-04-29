"use client";

import type * as z from "zod";
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

import { createLessonSchema } from "@/lib/schemas";

import { Loader2 } from "lucide-react";

import { type LessonFormData } from "@/types/lesson";

type FormData = z.infer<typeof createLessonSchema>;

export default function NewLessonPage() {
  const router = useRouter();
  const [showUploaded, setShowUploaded] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      lessonTitle: "",
      lessonDescription: "",
      uploadedMaterials: [],
      selectedMaterials: [],
    },
  });

  const { handleSubmit, control, setValue, watch } = form;
  const {
    classId,
    allMaterials,
    createLesson,
    isUploading,
    uploadNewPdfsToLesson,
    addExistingPdfsToLesson,
  } = useLessonMutations();

  const uploadedMaterials = watch("uploadedMaterials", []);
  const selectedMaterials = watch("selectedMaterials", []);

  const shouldCreateLessonWithNewMaterials =
    uploadedMaterials.length && !showUploaded;
  const shouldCreateLessonWithExistingMaterials =
    selectedMaterials.length && showUploaded;

  const onSubmit = async (data: LessonFormData) => {
    const lessonId = await createLesson(data);
    if (!lessonId) return;

    if (shouldCreateLessonWithNewMaterials) {
      void uploadNewPdfsToLesson({ lessonId, uploadedMaterials });
    } else if (shouldCreateLessonWithExistingMaterials) {
      await addExistingPdfsToLesson({ lessonId, pdfIds: selectedMaterials });
    }

    router.push(`/app/classes/${classId}`);
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
              allMaterials={allMaterials.data}
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
