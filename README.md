# Teach-me

## TODO

- [ ] Set up Convec and data model
- [ ] Set up Clerk and auth

--------------------------------------------------------------------------------------

# MVP Plan for Teach.me
✅ Core Features
User Authentication (NextAuth.js or Clerk)

Users sign up, log in, and manage their accounts.
Authenticated users can create and manage classes.
Class Management

Users can create, edit, and delete classes.
Each class contains a title, description, and materials.
PDF Upload & Storage (UploadThing)

Users upload PDFs to a class.
Store PDF metadata in Convex and the actual files in UploadThing.
AI-Generated Test from PDFs

A button next to uploaded PDFs to "Generate Test".
Backend AI processes the PDF and generates MCQs, fill-in-the-blanks, and short answers.
Users can take the test and see their scores & history.
Analytics & Tracking

Convex stores test results and user engagement stats.
Use PostHog or Plausible for broader app usage tracking.
📌 Tech Stack for MVP
✅ Frontend: Next.js + Tailwind
✅ Backend: Convex
✅ Storage: UploadThing (for PDFs)
✅ Auth: NextAuth.js or Clerk
✅ AI Integration: TBD (OpenAI API, LangChain, or custom model)
✅ Deployment: Netlify (initially for free hosting)
✅ Analytics: Convex for user stats + PostHog/Plausible for tracking

🚀 Next Steps
1️⃣ Initialize GitHub repo & set up Next.js with Convex & UploadThing.
2️⃣ Choose & implement authentication (NextAuth.js or Clerk).
3️⃣ Build UI for class management & PDF uploads.
4️⃣ Set up AI pipeline for test generation.
5️⃣ Deploy to Netlify & integrate analytics.