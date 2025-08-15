# Beehiiv Newsletter Integration Setup

Your email form is now connected to Beehiiv! Here's how to complete the setup:

## 1. Get Your Beehiiv Credentials

1. Log into your Beehiiv account
2. Go to **Settings > Integrations**
3. Find the **API** section
4. Copy your **Publication ID** 
5. Click **New API Key** to create a new API key
6. Copy the generated API key

## 2. Add Credentials to Your Environment

Create a `.env.local` file in your project root and add:

```env
# Beehiiv Newsletter Integration
BEEHIIV_API_KEY=your_actual_api_key_here
BEEHIIV_PUBLICATION_ID=your_actual_publication_id_here
```

**Important**: Replace the placeholder values with your actual credentials from step 1.

## 3. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your homepage
3. Try submitting the email form
4. Check your Beehiiv dashboard to see if the subscriber was added

## What's Included

✅ **Server Actions**: Modern Next.js server actions for backend logic
✅ **Custom Hook**: `useNewsletterSubscription` for clean state management
✅ **React Hook Form**: Professional form handling with client-side validation
✅ **Zod Validation**: Type-safe form validation on both client and server
✅ **shadcn/ui Components**: Professional UI components (Form, Input, Button, Label)
✅ **Separation of Concerns**: Pure UI components with business logic in server actions
✅ **Error Handling**: Comprehensive error handling with user-friendly messages
✅ **Loading States**: Proper loading states with React transitions
✅ **UTM Tracking**: Tracks source as 'website', campaign as 'waitlist'
✅ **Premium UX**: Beautiful forms with icons, animations, and proper accessibility

## Features

- **Duplicate Protection**: If someone tries to subscribe twice, they get a friendly message
- **Welcome Emails**: New subscribers automatically receive Beehiiv welcome emails
- **Reactivation**: If someone previously unsubscribed, they're automatically reactivated
- **UTM Tracking**: Subscribers are tagged with source/campaign data for analytics
- **Modern Architecture**: Server actions with React transitions for optimal performance
- **Clean Code**: Pure UI components with business logic separated into server actions
- **Form Validation**: Real-time client-side validation with proper error messages
- **Type Safety**: Full TypeScript support with Zod schemas throughout
- **shadcn/ui Integration**: Premium UI components with consistent design system
- **Accessibility**: Proper form labels, ARIA attributes, and keyboard navigation
- **Icons & Animations**: Visual feedback with Lucide icons and smooth transitions
- **Smart Error Handling**: Server-side error processing with user-friendly messages
- **Reusable**: Easy to add more newsletter forms throughout your site
- **Enterprise UX**: Production-ready form handling with proper loading and error states

## Troubleshooting

### "Server configuration error"
- Make sure your `.env.local` file exists and has the correct credentials
- Restart your development server after adding environment variables

### "Failed to subscribe to newsletter"
- Check that your API key has the correct permissions
- Verify your Publication ID is correct
- Check the browser console and server logs for detailed error messages

### Need Help?
- Check your Beehiiv account to see if subscribers are being added
- Look at the browser console (F12) for any JavaScript errors
- Check your server logs for detailed error information

## Usage

The new `NewsletterSubscriptionForm` component can be used anywhere in your app:

```tsx
import { NewsletterSubscriptionForm } from "@/components/newsletter-subscription-form";

// Basic usage (no label)
<NewsletterSubscriptionForm />

// With all options
<NewsletterSubscriptionForm 
  utmCampaign="footer"
  utmSource="website"
  utmMedium="footer-form"
  placeholder="Your email address"
  buttonText="Subscribe Now"
  showLabel={true}  // Shows "Email Address" label
  onSuccess={(data) => {
    console.log('New subscriber:', data.email);
    // Track in analytics, etc.
  }}
/>
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `utmCampaign` | string | "waitlist" | UTM campaign for tracking |
| `utmSource` | string | "website" | UTM source for tracking |
| `utmMedium` | string | "form" | UTM medium for tracking |
| `placeholder` | string | "Enter your email" | Input placeholder text |
| `buttonText` | string | "Count Me In 🚀" | Submit button text |
| `showLabel` | boolean | false | Whether to show "Email Address" label |
| `className` | string | "" | Additional CSS classes |
| `onSuccess` | function | undefined | Callback function on successful submission |

### Architecture

The system now uses modern Next.js patterns:

- **Server Actions**: `subscribeToNewsletter()` handles all backend logic
- **Custom Hook**: `useNewsletterSubscription()` manages form state and transitions
- **Pure UI Component**: Form component only handles display and user interaction
- **Separation of Concerns**: Business logic in server actions, UI logic in components

## Next Steps

Consider adding:
- A proper loading spinner component
- Analytics tracking for form submissions
- A/B testing for different form variations
- Integration with your analytics platform (PostHog, etc.)
- Additional custom fields (name, company, etc.) 