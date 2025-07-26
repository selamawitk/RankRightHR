# HireScore - AI-Powered HR Platform

HireScore is an AI-powered HR tool designed to streamline the hiring process for small and medium-sized businesses (SMEs). Employers can post jobs, candidates can apply with their materials, and our AI provides objective, bias-free scoring and insights.

## Features

- **🚀 AI-Powered Evaluation**: Instant candidate scoring using OpenAI ChatGPT
- **🛡️ Bias-Free Scoring**: Objective evaluation based solely on professional qualifications
- **📊 Detailed Analytics**: Comprehensive scoring breakdown with strengths and improvement areas
- **👥 Role-Based Access**: Separate interfaces for employers and candidates
- **⚡ Modern Tech Stack**: Built with Next.js, Prisma, PostgreSQL, and BetterAuth

## Tech Stack

- **Frontend/Backend**: Next.js 14+ with TypeScript (full-stack)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: BetterAuth
- **AI**: OpenAI ChatGPT API
- **Styling**: TailwindCSS + shadcn/ui
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone and install dependencies**

```bash
git clone <your-repo>
cd hirescore
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hirescore_db"

# BetterAuth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Set up the database**

```bash
# Create database
createdb hirescore_db

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

4. **Start development server**

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Database Schema

### Core Models

- **User**: Employers and candidates with role-based access
- **Job**: Job postings with requirements and metadata
- **Application**: Candidate applications with resume and additional materials
- **Score**: AI-generated evaluation results with detailed breakdown

### Key Features

- Unique application constraint (one per candidate per job)
- Comprehensive scoring system (0-100 for each component)
- Structured feedback with strengths, improvements, and tips
- Support for multiple file types (resume, GitHub, website, cover letter)

## API Endpoints

### Authentication

- `POST /api/auth/[...betterauth]` - BetterAuth handlers

### Jobs

- `GET /api/jobs` - List all active jobs
- `POST /api/jobs` - Create new job (employers only)

### Applications

- `GET /api/applications` - List applications (role-based filtering)
- `POST /api/applications` - Submit application with AI evaluation

## User Flows

### For Employers

1. Register with employer role
2. Post job with title and description
3. View ranked applications with AI scores
4. Review detailed candidate insights

### For Candidates

1. Register with candidate role
2. Browse available jobs
3. Submit application with resume + optional materials
4. Receive instant AI feedback and scoring

## AI Evaluation Process

Our AI evaluation system:

1. **Input Processing**: Analyzes resume, GitHub profile, website, and cover letter
2. **Bias-Free Scoring**: Evaluates based purely on professional qualifications
3. **Multi-Dimensional Analysis**:
   - Technical skills assessment
   - Experience relevance
   - Culture fit indicators
   - Communication quality
4. **Structured Output**: Returns detailed scores, strengths, improvements, and actionable tips

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes
npx prisma studio      # Open Prisma Studio
npx prisma migrate dev  # Create and apply migrations

# Code Quality
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript checks
```

## Environment Setup

### Local PostgreSQL (macOS)

```bash
# Install PostgreSQL
brew install postgresql
brew services start postgresql

# Create database and user
createdb hirescore_db
psql postgres -c "CREATE USER hirescore WITH PASSWORD 'password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE hirescore_db TO hirescore;"
```

### Local PostgreSQL (Ubuntu)

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database and user
sudo -u postgres createdb hirescore_db
sudo -u postgres psql -c "CREATE USER hirescore WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hirescore_db TO hirescore;"
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**

```bash
npm i -g vercel
vercel
```

2. **Set environment variables** in Vercel dashboard
3. **Set up PostgreSQL** (recommend Neon, Supabase, or Railway)
4. **Deploy**: Automatic on git push

### Database Providers

- **Neon**: PostgreSQL with generous free tier
- **Supabase**: Full backend with PostgreSQL
- **Railway**: Simple deployment with PostgreSQL
- **Vercel Postgres**: Integrated with Vercel

## Project Structure

```
hirescore/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Protected dashboard
│   │   └── jobs/          # Job-related pages
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   └── features/      # Feature-specific components
│   └── lib/
│       ├── auth.ts        # BetterAuth configuration
│       ├── prisma.ts      # Prisma client
│       ├── openai.ts      # AI evaluation logic
│       └── utils.ts       # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:

- Open a GitHub issue
- Check the documentation
- Review the setup instructions

---

**Built with ❤️ for bias-free, intelligent hiring**
