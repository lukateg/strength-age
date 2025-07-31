"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Star,
  Bug,
  Lightbulb,
  Heart,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useFeedbackMutations } from "@/hooks/use-feedback-mutations";

type FeedbackType = "bug" | "feature" | "complaint" | "compliment" | "general";

// Zod schema for form validation
const feedbackFormSchema = z.object({
  type: z.enum(["bug", "feature", "complaint", "compliment", "general"]),
  rating: z.number().min(1, "Please provide a rating").max(5),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(10, "Please provide a more detailed description")
    .max(1000, "Description is too long"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

const feedbackTypes = [
  {
    value: "bug" as const,
    label: "Bug Report",
    description: "Something isn't working correctly",
    icon: Bug,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    value: "feature" as const,
    label: "Feature Request",
    description: "Suggest a new feature or improvement",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    value: "complaint" as const,
    label: "Issue/Complaint",
    description: "Something bothers you or needs attention",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    value: "compliment" as const,
    label: "Compliment",
    description: "Share what you love about the app",
    icon: Heart,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    value: "general" as const,
    label: "General Feedback",
    description: "Other thoughts or suggestions",
    icon: MessageCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export default function FeedbackModal({
  trigger,
  onSubmit,
}: {
  trigger?: React.ReactNode;
  onSubmit?: (data: FeedbackFormData) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCreateFeedback, isPending } = useFeedbackMutations();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: "general",
      rating: 0,
      title: "",
      description: "",
      email: "",
    },
  });

  const { handleSubmit, watch, reset } = form;
  const watchedValues = watch();
  const selectedType = feedbackTypes.find(
    (type) => type.value === watchedValues.type
  );

  const handleSubmitForm = async (data: FeedbackFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Use our Convex mutation to save feedback
        await handleCreateFeedback({
          type: data.type,
          rating: data.rating,
          title: data.title,
          description: data.description,
          email: data.email ?? undefined,
        });
      }

      // Reset form and close modal
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="w-full" size="default" variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Leave feedback
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div>
              <DialogTitle className="text-xl font-bold">
                Share Your Feedback
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Help us improve Teach.me by sharing your thoughts, reporting
                issues, or suggesting features.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
            {/* Feedback Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of feedback do you have?</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {feedbackTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = field.value === type.value;

                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => field.onChange(type.value)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-8 h-8 rounded-lg ${type.bgColor} flex items-center justify-center`}
                              >
                                <Icon className={`h-4 w-4 ${type.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {type.label}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {type.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How would you rate your experience?</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="transition-all duration-200 hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors duration-200 ${
                                star <= field.value
                                  ? "text-pro-from fill-pro-from"
                                  : "text-muted-foreground hover:text-primary"
                              }`}
                            />
                          </button>
                        ))}
                        {field.value > 0 && (
                          <Badge variant="secondary" className="ml-3">
                            {field.value} star{field.value !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Brief summary of your ${selectedType?.label.toLowerCase()}`}
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide as much detail as possible. If reporting a bug, include steps to reproduce it."
                      {...field}
                      rows={4}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (Optional) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com - We'll only use this to follow up if needed"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
