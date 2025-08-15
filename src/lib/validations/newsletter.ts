import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"), // RFC 5321 email length limit
});

export type NewsletterSubscriptionData = z.infer<
  typeof newsletterSubscriptionSchema
>;

export const beehiivApiSchema = z.object({
  email: z.string().email(),
  utmSource: z.string().optional().default("website"),
  utmCampaign: z.string().optional().default("waitlist"),
  utmMedium: z.string().optional().default("form"),
});

export type BeehiivApiData = z.infer<typeof beehiivApiSchema>;
