"use client";

import { NewsletterSubscriptionForm } from "./newsletter-subscription-form";

/**
 * Example footer newsletter signup form
 * This demonstrates how to reuse the NewsletterSubscriptionForm component
 * with different UTM parameters and styling
 */
export function FooterNewsletterForm() {
  return (
    <div className="bg-qa-neutral-footer p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-qa-neutral-dark mb-2">
        Stay Updated
      </h3>
      <p className="text-sm text-qa-neutral-medium mb-4">
        Get the latest SEO tips and product updates delivered to your inbox.
      </p>

      <NewsletterSubscriptionForm
        utmCampaign="footer"
        utmSource="website"
        utmMedium="footer-form"
        placeholder="Your email address"
        buttonText="Subscribe"
        className="max-w-sm"
        showLabel={true}
        onSuccess={(data) => {
          // You can add analytics tracking here
          console.log("Footer subscription:", data.email);
        }}
      />
    </div>
  );
}

// Example usage:
// import { FooterNewsletterForm } from "@/components/footer-newsletter-form";
//
// <FooterNewsletterForm />
