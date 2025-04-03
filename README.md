# TODO:

// - think about removing a context and just using queries because you have live updates and sockets

// - implement custom question number per lesson
// - upload material button page should have a dropdown menu of lections to be linked when uploading materials (fetch lections from API)
// - each section has its own functionallity button. lessons section -> create lesson, materials section -> upload materials....
// - remove pdfItems from getLessonData, these need to be separated

// - add delete everything logic
// - add edit everything logic
// - check if all components are server components if possible
// - check why uploading calls 3 requests and is so slow ///
// - change new-class/lesson to create-class/lesson

// for selecting the lessons for test generation use table for lessons. 
// e.g. in table render all lessons. 
// --- single lesson -> table acts like radio button (after selecting one element disable all other)
// --- multiple lesson -> table acts like checkbox list (after selecting all elements trigger selecting whole class testing)
// --- class test -> table selects all checkboxes in table and disables unchecking

// -- Refactor form
// -- create proper retry logic when calling AI
// -- refactor create test route
// -- extract logic for parsing the PDF
// -- hook up all form inputs to the AI route
-- implement view tests page so you can open already generated test to not use AI tokens 
-- add maximum pdf size per prompt when generating text so we do not exceed AI limit per prompt

TOMOROW:
-- add chunking text prompt

LATER:
-- implement loading when generating test
-- implement test review
-- store review in database

LATER: 
-- implement responsive menu and mobile version and start implementing test generator page


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

