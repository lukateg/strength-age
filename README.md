# TODO:

check before launch:
// -- fetch should be removed from all display table components and data should be passed from the page
// -- add maximum pdf size per prompt when generating text so we do not exceed AI limit per prompt
// -- check if all components are server components if possible
// -- check if there is better retry logic when calling the AI
// -- check if there is better way to add chunking text prompt
// -- check if all routes are covered with the fallback and if URL security is enough
// -- check if actions that require modals have them
// -- check if we want to delete all tests and reviews when deleting the class since user could create those within the generate tests page thinking they are not associated with class (if you want that then you need to store the class name with class ID everywhere since tests and test reviews need to display from which class they are created)

TESTING:
-- test prompt splitting and large loads

BUGS
- open class from dashboard and redirect back leads you to classes instead of a dashboard
CAN'T REPRODUCE
-- redirect after test creation still doesn't work properly(test with multiple lessons)
-- creating test from multiple lessons and setting the equal question per lesson returns just questions for one lesson
-- still have some bad redirects on class and test review
-- sign out displays some weird loader
-- implement permission check fix
-- add delete test from test preview

PLAN:
-- write down terms and conditions, privacy policy and documentation(mintlify)
-- check payment of the ai, do you need to upgrade and everything
// add ai usage to the dashboard of posthog
// set a rate limit for total money spent on the model
// set error handling when token teach-me subscription for all limit is out
-- add feedback received, working on it email message
-- Add analytics
-- implement AI cost monitoring setup
-- SEO check
-- check free tier plan and work out permisions and free plan for max classes, lessons, pdfs in mb, tests and ai token calls
-- in bottom left corner in menu button should be "quick start" that redirects to a quick demo and instructions about the app usage and release notes that follows versions and updates
-- load testing
-- check if you need terms and conditions
-- check payment subscription to gemini, will it upgrade automatically and everything needed
-- release to prod
-- wait for the analytics results and think about the compex permisions and test sharing and start sprint 2
-- if test is deleted retry button on testReview page should be disabled

FUTURE FEATURES AND ENHANCMENTS:
-- remove all async logic from abacSchema so you fetch it only once in the page and pass it to the schema
-- add feedback review page
-- write a bit better confirm test modal text
-- modify upload files to not have list below it and instead display files to upload in the dropbox itself.
- export test to json and print it
- 20 days streak gets discount
-- add test sharing
-- add settings page
- test sharing between users and groups
- test preview before starting to work on it
- audio lessons
- invite multiple people to the scheduled test at specific tieme and display leaderbord with result at the end
- pausing or blockin test when changing window while working on a test
- mobile app and generating summaries from materials and voice lessons from summaries
- creating app with 1 empty lesson and 1 regular should notify user that one is empty
- same way as you add authRequired and checkPermission, add checkValidation if needed
-- check if you can persist test generation on the backend so it continues even if user refreshes the page

SETTINGS PAGE
-- in settings page add TEST SETTINGs (setting up if user wants all questions on one page, or he wants pagination)
-- in settings page add TEST SETTINGS (if user wants to have only one question true when multiple questions)
-- in settings page add ANSWER REQUIRED (if user wants to be able to submit test with answers that are not answered)
-- in settings page add I DONT KNOW (if user wants to have don't know answer when multiple question)


MAYBE IN FUTURE
-- add feedback for each test question wrong answered
-- add modals on all needed actions (when exiting touched forms)
-- set each form to not be redirectable back to
-- if file upload becomes to slow change uploadThing for convex store

-TEST GENERATION
-- add limit so user can pass or fail a test
-- add importing previous tests when generating test so AI knows not to generate same questions
--  add dashboard for number of lessons, pass rate, total tests, test review in one of the navigation to single class page
-- implement custom question number per lesson
-- add timer for test
-- add abort test generating when clicking on the X in the loader
-- maybe add sharing tests between user as a social media app
-- add "..." for each pdf and implement edit logic "check if edit can edit text in the uploadThing


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
