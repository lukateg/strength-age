"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newsletterSubscriptionSchema,
  type NewsletterSubscriptionData,
} from "@/lib/validations/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle, AlertCircle, Rocket } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/use-newsletter-subscription";

interface NewsletterSubscriptionFormProps {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (data: NewsletterSubscriptionData) => void;
  showLabel?: boolean;
}

export function NewsletterSubscriptionForm({
  utmCampaign = "waitlist",
  utmSource = "website",
  utmMedium = "form",
  placeholder = "Enter your email",
  buttonText = "Count Me In",
  className = "",
  onSuccess,
  showLabel = false,
}: NewsletterSubscriptionFormProps) {
  const { subscribe, clearMessage, isSubmitting, message, isSuccess } =
    useNewsletterSubscription({
      utmSource,
      utmCampaign,
      utmMedium,
      onSuccess,
    });

  const form = useForm<NewsletterSubscriptionData>({
    resolver: zodResolver(newsletterSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterSubscriptionData) => {
    clearMessage();
    await subscribe(data);

    if (isSuccess) {
      form.reset();
    }
  };

  // Clear form on success
  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  const getMessageIcon = (isSuccess: boolean) => {
    if (isSuccess) {
      return <CheckCircle className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const getMessageStyles = (isSuccess: boolean) => {
    if (isSuccess) {
      return "bg-qa-success/10 text-qa-success border border-qa-success/20";
    }
    return "bg-qa-error/10 text-qa-error border border-qa-error/20";
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                {showLabel && (
                  <FormLabel className="text-qa-neutral-dark">
                    Email Address
                  </FormLabel>
                )}
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    type="email"
                    disabled={isSubmitting}
                    className="h-12 px-4 border-qa-neutral-border focus:ring-qa-blue focus:border-qa-blue"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-qa-error text-sm" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="h-12 px-6"
          >
            {isSubmitting ? "Subscribing..." : buttonText}
            <Rocket className="w-6 h-6 text-qa-neutral-white" />
          </Button>
        </form>
      </Form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${getMessageStyles(isSuccess)}`}
        >
          {getMessageIcon(isSuccess)}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
