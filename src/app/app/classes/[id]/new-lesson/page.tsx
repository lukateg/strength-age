"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import ExistingMaterialsList from "./components/existing-materials-list";
import UploadMaterialsSection from "./components/upload-materials-section";
import { type LessonFormData } from "@/types/lesson";
import { useFileUpload } from "@/hooks/use-upload-thing";

export default function NewLessonPage() {
  const router = useRouter();
  const [showUploaded, setShowUploaded] = useState(false);

  const form = useForm<LessonFormData>({
    defaultValues: {
      lessonTitle: "",
      lessonDescription: "",
      uploadedMaterials: [],
      selectedMaterials: [],
    },
  });

  const { handleSubmit, control, setValue, watch } = form;
  const {
    createBasic,
    createWithExistingMaterials,
    createWithNewMaterials,
    classId,
    allMaterials,
  } = useLessonMutations();

  const uploadedMaterials = watch("uploadedMaterials", []);
  const selectedMaterials = watch("selectedMaterials", []);

  const { startUpload, isUploading } = useFileUpload({
    onUploadComplete: (files) => {
      void createWithNewMaterials(form.getValues(), files);
      router.push(`/app/classes/${classId}`);
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    try {
      if (!uploadedMaterials.length && !selectedMaterials.length) {
        await createBasic(data);
        router.push(`/app/classes/${classId}`);
        return;
      }

      if (uploadedMaterials.length && !showUploaded) {
        await startUpload(uploadedMaterials);
        return;
      }

      if (selectedMaterials.length && showUploaded) {
        await createWithExistingMaterials(data, selectedMaterials);
        router.push(`/app/classes/${classId}`);
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to create lesson:", error);
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
            <UploadMaterialsSection
              control={control}
              uploadedMaterials={uploadedMaterials}
              setValue={setValue}
            />
          ) : (
            <ExistingMaterialsList
              allMaterials={allMaterials}
              control={control}
            />
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/app/classes/${classId}`}>Cancel</Link>
            </Button>
            <Button type="submit">Create Lesson</Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
