import * as z from "zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import RedirectBackButton from "@/components/redirect-back-button";

import { ArrowLeft, BookOpen } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Class title is required")
    .max(50, "Class title cannot be longer than 50 characters"),
  description: z
    .string()
    .max(200, "Class description cannot be longer than 200 characters"),
});

export type ClassFormData = z.infer<typeof formSchema>;

export default function ClassForm({
  isEditMode = false,
  onSubmit,
  defaultValues,
}: {
  isEditMode?: boolean;
  onSubmit: (data: ClassFormData) => void;
  defaultValues?: { title: string; description?: string };
}) {
  const form = useForm<ClassFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="flex items-center gap-4">
        <RedirectBackButton>
          <ArrowLeft className="h-6 w-6" />
        </RedirectBackButton>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">
              {isEditMode ? "Edit Class" : "New Class"}
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            {isEditMode
              ? "Edit your class details"
              : "Create your classes and materials"}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter class title" {...field} />
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
                  <FormLabel>Class Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter class description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/app/classes`}>Cancel</Link>
              </Button>
              <Button type="submit">
                {isEditMode ? "Save Changes" : "Create Class"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
