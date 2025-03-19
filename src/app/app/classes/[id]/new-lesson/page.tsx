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

import ExistingMaterialsList from "./components/existing-materials-list";
import UploadMaterialsSection from "./components/upload-materials-section";

import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { toast } from "@/hooks/use-toast";

import { type LessonFormData } from "@/types/lesson";

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

  // this works
  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        try {
          await createWithNewMaterials(form.getValues(), res);
          router.push(`/app/classes/${classId}`);
        } catch (error) {
          toast({
            title: "Error",
            description:
              "Failed to create lesson with materials. Please try again.",
            variant: "destructive",
          });
        }
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
      console.error("Failed to create lesson:", error);
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
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
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Create Lesson"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
