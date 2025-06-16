"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { createLessonSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";

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
import { AddMaterialsView } from "@/components/add-materials-section/add-materials-section";

import { Loader2 } from "lucide-react";

import { type LessonFormData } from "@/types/lesson";
import { type Doc } from "convex/_generated/dataModel";
import { useClass } from "@/providers/class-context-provider";
import TotalStorageUsedCard from "@/components/file-upload/total-storage-used-card";
import { LIMITATIONS } from "@/shared/constants";
import { useUserContext } from "@/providers/user-provider";

export default function LessonForm({
  isEditMode = false,
  onSubmit,
  defaultValues,
  materials,
  isSubmitting,
}: {
  isEditMode?: boolean;
  onSubmit: (data: LessonFormData) => void;
  defaultValues?: Doc<"lessons">;
  materials: Doc<"pdfs">[];
  isSubmitting: boolean;
}) {
  const form = useForm<LessonFormData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      materialsToUpload: [],
      materialsToAdd: [],
      showExistingMaterials: false,
    },
  });

  const { handleSubmit, control, setValue, watch, clearErrors } = form;
  const { classId } = useClass();
  const { user } = useUserContext();
  const materialsToUpload = watch("materialsToUpload", []);
  const showExistingMaterials = watch("showExistingMaterials", false);

  const storageLimit =
    LIMITATIONS[user.data?.subscriptionTier ?? "free"].materials;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 mx-auto mt-6 space-y-6">
          <FormField
            control={form.control}
            name="title"
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
            name="description"
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

          {!isEditMode && (
            <>
              <TotalStorageUsedCard
                materialsToUpload={materialsToUpload}
                storageUsed={user.data?.totalStorageUsage ?? 0}
                maxStorageLimit={storageLimit}
              />

              <AddMaterialsView<LessonFormData>
                showExistingMaterials={showExistingMaterials}
                onShowExistingMaterialsChange={(checked) =>
                  setValue("showExistingMaterials", checked)
                }
                materialsToUpload={materialsToUpload}
                allMaterials={materials}
                control={control}
                setValue={setValue}
                clearErrors={clearErrors}
                storageUsed={user.data?.totalStorageUsage ?? 0}
                storageLimit={storageLimit}
              />
            </>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/app/classes/${classId}`}>Cancel</Link>
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              <div className="flex items-center">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting
                  ? `${isEditMode ? "Updating" : "Creating"} Lesson...`
                  : `${isEditMode ? "Update" : "Create"} Lesson`}
              </div>
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
