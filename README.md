# TODO:

check before launch:
// -- add maximum pdf size per prompt when generating text so we do not exceed AI limit per prompt
// -- check if all components are server components if possible
// -- check if there is better retry logic when calling the AI
// -- check if there is better way to add chunking text prompt
// -- check if all routes are covered with the fallback and if URL security is enough

-- remove pdfItems from getLessonData, these need to be separated
-- check why uploading calls 3 requests and is so slow ///
-- create suspense component for pending and error state
-- create custom fetch function with convex token
-- retry test multiple times and redirect back willaredirect you through multiple test reviews
// - add error messages for each scenario that comes from the server -- iplement solution across all mutations and whole app
// - lesson page should be new page because redirect works bad
-- handle case when statusText: 'Service Unavailable' 
-- implement proper error boundary
-- use normaliseId across app where you use id from the url
-- implement not authorised to read/write if userId doesnt match creatorId
-- change userId on all tables to be createdBy
-- rename SelectFormItem to FormSelect
-- remove all loading... 
-- create main page components like main-header and reuse it across the app
-- check if we want to delete all tests and reviews when deleting the class since user could create those within the generate tests page thinking they are not associated with class
-- replace all history back buttons with normal routes and align all layout patterns
-- edit lesson opens edit page and there we render delete button
-- delete modal should have red confirm button
-- create dialog component that accepts onConfirm, confirmText, CancelText, descriptionText ....
-- edit section buttons should have beautifull purple design maybe
-- for exit test set new icon (exit door icon)
-- check case when generating test with lesson that has 0 materials

BUGS
-- redirect after test creation still doesn't work properly(test with multiple lessons)
-- creating test from multiple lessons and setting the equal question per lesson returns just questions for one lesson
-- lesson title is not working when generating multiple lesson test

finish the edit and delete lesson and tests and reviews
create consistent pattern for loading skeleton, error case, and not found case
create reusable components for error and not found case and use them across the app
test fast clicks on submit buttons that do not have disabled props
edit lesson has no submit button


TODO: 
-- add "..." for a test and implement edit test page if possible, if not implement just delete
-- add delete test review

PLAN:
-- Add delete and edit
-- create beautiful destructive and positive buttons and reusable dialog that will have positive, default, and destructive variant
-- add permisions so user can access only its own content (change param userId to createdBy)
-- add share button for test result and implement share link logic
-- add modals on all needed actions
-- add additional info prompt when generating the test
-- handle case when LLM is not working
-- add test preview page that would be oppened when test is generated or before retrying test that has basic info and a start (positive) button
-- add settings page
-- Add analytics
-- add payments
-- add free tier permission system
-- pocisti bagove
-- SEO check
-- check free tier plan and work out permisions and free plan for max classes, lessons, pdfs in mb, tests and ai token calls
-- in bottom left corner in menu button should be "quick start" that redirects to a quick demo and instructions about the app usage and release notes that follows versions and updates
-- release to prod
-- wait for the analytics results and think about the compex permisions and test sharing and start sprint 2

SETTINGS PAGE
-- in settings page add TEST SETTINGs (setting up if user wants all questions on one page, or he wants pagination)
-- in settings page add TEST SETTINGS (if user wants to have only one question true when multiple questions)
-- in settings page add ANSWER REQUIRED (if user wants to be able to submit test with answers that are not answered)
-- in settings page add I DONT KNOW (if user wants to have don't know answer when multiple question)

MAYBE IN FUTURE
-TEST GENERATION
-- add additional prompt section to test generation so user can add additional instruction for test
-- add importing previous tests when generating test so AI knows not to generate same questions
--  add dashboard for number of lessons, pass rate, total tests, test review in one of the navigation to single class page
-- implement custom question number per lesson
-- add abort test generating when clicking on the X in the loader
-- maybe add sharing tests between user as a social media app
-- add "..." for each pdf and implement edit logic "check if edit can edit text in the uploadThing


FUTURE FEATURES:
- test sharing between users and groups
- test preview before starting to work on it
- audio lessons

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

## 📌 Tech Stack for MVP
✅ Frontend: Next.js + Tailwind

✅ Backend: Convex

✅ Storage: UploadThing (for PDFs)

✅ Auth: Clerk

✅ AI Integration: TBD (OpenAI API, LangChain, or custom model)

✅ Deployment: Netlify (initially for free hosting)

✅ Analytics: Convex for user stats + PostHog/Plausible for tracking

✅ Hosting: Hostinger + Coolify / vercel / netlify


## 🚀 TODO:

✅ Initialize GitHub repo & set up Next.js with Convex.

✅ Deploy to Netlify and build CI.

✅ Set up authentication (NextAuth.js or Clerk).

✅ Create a landing page.

✅ Protect app page and create redirect if un/authenticated.

[ ] Build UI for class management & PDF uploads.

[ ] Hook up Upload thing.

[ ] Set up AI pipeline for test generation.

[ ] Integrate analytics.


# Teach-me core features and strategie

## Core Differentiating Features
These will set Teach.me apart from competitors and make it valuable for students.

1. AI-Powered Test Generation (Unique Twist)

✅ Upload PDFs → AI understands the content → Generates structured quizzes, flashcards, and practice tests.

💡 Enhancements: 

Difficulty Scaling – AI adapts questions to user progress (e.g., easier first, harder later).
Smart Answer Explanations – AI provides detailed explanations instead of just "Correct" or "Wrong."
Multiple Testing Modes – MCQs, fill-in-the-blanks, short answers, and AI-generated essay topics.


2. Study Timeline & Smart Scheduling

✅ AI analyzes uploaded materials → Creates a personalized study plan based on exam dates & learning pace.

💡 Enhancements:

Calendar Integration – Sync study schedule with Google Calendar.
Adaptive Learning – If a user struggles with certain topics, the AI re-prioritizes them in the schedule.
Reminder System – Smart notifications for "Revision Time" and "Test Yourself Today."


3. Voice-Powered Learning (AI Voice from PDFs)

✅ AI reads PDFs aloud but does more than basic text-to-speech.

💡 Enhancements:

Structured Audio Lessons – AI summarizes key topics before reading.
Interactive Mode – AI asks questions mid-way through to keep users engaged.
Voice Commands – "Pause," "Summarize this section," "Give me a quiz on what I just heard."
🔹 Competitor Gap: Other apps just read text aloud; this would make it interactive & educational.


4. AI-Powered Smart Notes & Summarization

✅ AI extracts key points from PDFs → Converts them into bullet points & flashcards.

💡 Enhancements:

Auto Highlighting – AI marks important sections in user-uploaded PDFs.
Context-Aware Flashcards – AI automatically creates Q&A pairs based on key concepts.
🔹 Competitor Gap: Quizlet requires manual input, but Teach.me auto-generates study materials.
📚 Collaboration & Sharing Features
Features to encourage social learning and expand user engagement.


5. Multi-User Class Collaboration

✅ Users can create & share classes with friends or study groups.

💡 Enhancements:

Live Study Sessions – Users can take quizzes together in real-time and compare scores.
AI-Suggested Study Buddies – AI matches students with similar subjects & learning styles.
Leaderboard & Challenges – Gamify learning with points & rewards.
🔹 Competitor Gap: Google Classroom is teacher-led, but Teach.me is student-driven.


6. AI Study Assistant (Chat-Based)

✅ Built-in AI chatbot that answers questions from uploaded materials.

💡 Enhancements:

PDF-Specific Q&A – "Explain Chapter 3 in simple terms" or "Give me a summary of this section."
Personalized Learning Tips – AI suggests learning techniques based on past performance.

🔹 Competitor Gap: ChatGPT exists, but it doesn’t connect directly to user materials like Teach.me would.


7. Progress Tracking & Analytics

✅ Track test scores, study time, and weak areas needing improvement.

💡 Enhancements:

Smart Reports – AI analyzes user performance & suggests focus areas.
Confidence Level Indicator – Users rate their confidence before & after each test to see improvement.
Streaks & Badges – Encourage consistency (e.g., "You studied 5 days in a row!").

🔹 Competitor Gap: Most study apps track progress manually; Teach.me automates it.

## 💰 Monetization Strategy

To stay competitive while covering AI & storage costs, you could use:

Freemium Model

🔹 Free Tier – 5-10 free PDFs, limited AI quiz generations per month.

🔹 Premium Tier ($5-10/month) – Unlimited uploads, AI tests, smart notes, and voice learning.

🔹 Pay-Per-Use Option – One-time payment for extra AI features without full subscription.


## 🚀 Final Competitive Advantage
✅ AI-Powered Everything – Not just test generation, but smart summarization, interactive voice learning, and study scheduling.

✅ Student-Centered Collaboration – Unlike Google Classroom, this is built for students, not teachers.

✅ Unique AI Study Tools – Voice learning, chatbot, and adaptive study plans make it smarter than Quizlet.

✅ Gamification & Social Learning – Keeps students motivated and engaged.
