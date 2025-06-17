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
  isSubmitting,
}: {
  isEditMode?: boolean;
  onSubmit: (data: ClassFormData) => void;
  defaultValues?: { title: string; description?: string };
  isSubmitting: boolean;
}) {
  const form = useForm<ClassFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
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
            <Button type="submit" disabled={isSubmitting}>
              {isEditMode ? "Save Changes" : "Create Class"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
