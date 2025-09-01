# 🔄 Domain Update Checklist

When you have your real domain, just follow these simple steps:

## 1. Update Site Configuration
**File**: `/src/config/site.ts`

Replace these values:
```typescript
export const siteConfig = {
  baseUrl: "https://YOURDOMAIN.com", // ← Change this
  name: "YOUR_SITE_NAME",            // ← Change this  
  description: "YOUR_DESCRIPTION",   // ← Change this
  social: {
    twitter: "@YOURHANDLE",          // ← Change this
    facebook: "https://facebook.com/YOURPAGE", // ← Change this
  },
  email: "hello@YOURDOMAIN.com",     // ← Change this
};
```

## 2. Update Sitemap
**File**: `public/sitemap.xml`

Find and replace:
- `https://strengthage.com` → `https://YOURDOMAIN.com`

## 3. Update Robots.txt  
**File**: `public/robots.txt`

Find and replace:
- `https://strengthage.com` → `https://YOURDOMAIN.com`
- `StrengthAge` → `YOUR_SITE_NAME`

## 4. Update LLMs.txt
**File**: `public/llms.txt`

Find and replace:
- `https://strengthage.com` → `https://YOURDOMAIN.com`
- `StrengthAge` → `YOUR_SITE_NAME`
- `hello@strengthage.com` → `hello@YOURDOMAIN.com`

## 5. Add Required Images
Create these files in `/public/`:
- `logo.png` (your logo)
- `strength-age-og-image.jpg` (1200x630px social sharing image)
- `favicon.ico` (your favicon)

## 6. Optional: Update Content
If you want to change "StrengthAge" in the actual content:

**Files to check**:
- `/src/app/page.tsx` (homepage content)
- `/src/app/about/page.tsx` (about page content) 
- `/src/app/methods/page.tsx` (methods page content)
- `/src/components/Header.tsx` (navigation)

**Find and replace**:
- `StrengthAge` → `YOUR_SITE_NAME`
- Any other branding text you want to change

## That's it! 
Just paste your domain info and I'll help you update everything with the exact values.
