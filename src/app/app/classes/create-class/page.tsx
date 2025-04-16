"use client";

import { useForm } from "react-hook-form";
import { useClassMutations } from "@/hooks/use-class-mutation";

import Link from "next/link";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BookOpen } from "lucide-react";
import { ArrowLeft } from "lucide-react";

import RedirectBackButton from "@/components/redirect-back-button";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Class title is required")
    .max(50, "Class title cannot be longer than 50 characters"),
  description: z
    .string()
    .min(1, "Class description is required")
    .max(200, "Class description cannot be longer than 200 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewClassPage() {
  const router = useRouter();
  const { createClass } = useClassMutations();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: FormData) => {
    void createClass({
      title: data.title,
      description: data.description,
    }).then(() => router.push("/app/classes"));
  };

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="flex items-center gap-4">
        <RedirectBackButton>
          <ArrowLeft className="h-6 w-6" />
        </RedirectBackButton>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">New Class</h1>
          </div>
          <p className="text-muted-foreground">
            Create your classes and materials
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
              <Button type="submit">Create Class</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
