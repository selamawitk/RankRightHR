AI-Powered Job Matcher
An intelligent job application and evaluation platform built in just 5 hours using React, Express, Prisma, and OpenAI.

 Overview
This app streamlines hiring by allowing recruiters to post jobs, candidates to apply, and AI to instantly evaluate applications. Designed for fast prototyping and clarity in functionality.

🕔 5-Hour Hackathon Plan
Time	Task Description
0–1 hr	Set up authentication, protected routes, and basic navigation.
1–2 hr	Build Job Post form and Job Listings page (CRUD).
2–3 hr	Implement Application Submission form (resume, links, etc).
3–4 hr	Connect OpenAI API for candidate evaluation and scoring logic.
4–5 hr	Render results, polish UI, test end-to-end functionality.

⚙ Features
Authentication & Routing
Integrated BetterAuth (or placeholder) for login and protected pages.

Guards for posting jobs and applying.

Job Posting
Form to post new jobs (title, description, requirements).

Job listing page with live database updates using Prisma.

 Candidate Application
Application form to upload resume, add GitHub/portfolio, and write a cover letter.

Submission stored and sent to AI evaluation endpoint.

 AI Evaluation
OpenAI-powered scoring system ranks applicants.

Returns component scores (skills, experience, culture fit), total score, strengths & improvements.

 Results Page
Displays ranking and breakdown of applicant evaluation.

Clear and insightful feedback for recruiters.

 Tech Stack
Frontend: React, TailwindCSS

Backend: Express.js, Node.js

Database: Prisma + SQLite/PostgreSQL

AI: OpenAI API

Auth: BetterAuth (or mock login system for demo)

Screenshots (optional)
Job Posting → Application → AI Results view (add here if available).
 How to Run Locally

# Clone the repository
git clone (https://github.com/selamawitk/RankRightHR)

# Install dependencies
cd client && npm install
cd ../server && npm install

# Set up environment variables and database
npx prisma migrate dev

# Run development servers
cd client && npm run dev
cd ../server && npm run dev
Teamwork
This project was built in under 5 hours with clear feature separation and collaboration.
Each feature was developed independently and integrated smoothly, focusing on simplicity, speed, and functionality.

