<<<<<<< HEAD
# Shingō Quest 🚦

**Master Japanese Road Signs** - A gamified learning platform for mastering Japanese traffic signs and road regulations.

Shingō Quest is an interactive web application designed to help learners master Japanese road signs through engaging lessons, quizzes, and spaced repetition flashcards. Perfect for anyone preparing for the Japanese driving test or looking to understand Japanese traffic regulations.

## ✨ Features

### 🎓 Learning Modules
- **Interactive Lessons**: Slide-based lessons covering different sign categories (Information, Prohibition, Warning, Regulatory)
- **Quizzes**: Timed multiple-choice quizzes with difficulty levels (Easy, Medium, Hard, Expert)
- **Flashcards**: Spaced repetition system for long-term retention using the SM-2 algorithm

### 🎮 Gamification
- **XP System**: Earn experience points by completing lessons, quizzes, and flashcards
- **Leveling**: Progress through levels based on total XP earned
- **Streak Tracking**: Daily activity streaks to maintain consistent learning
- **Achievements**: Unlock badges for milestones (7-day streak, level ups, sign mastery)
- **Progress Tracking**: Visual progress bars and statistics for all learning activities

### 🔐 User Features
- **Authentication**: Secure user accounts with Supabase Auth
- **Personalized Dashboard**: Track your learning journey with stats, achievements, and progress
- **Sign Library**: Browse and learn from a comprehensive catalog of Japanese road signs
- **Progress Persistence**: All progress saved in real-time to the cloud

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript** - Modern UI framework with type safety
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **TanStack Query (React Query)** - Server state management and caching
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library built on Radix UI
- **Zod** - Schema validation
- **React Hook Form** - Form state management

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - **PostgreSQL** - Relational database
  - **Supabase Auth** - Authentication system
  - **Row Level Security (RLS)** - Database-level security policies
  - **Real-time Subscriptions** - Live data updates
  - **Database Triggers** - Automated profile creation and updates

### Additional Libraries
- **Canvas Confetti** - Celebration animations
- **date-fns** - Date utility functions
- **lucide-react** - Icon library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zandersmall/quest-ja.git
   cd quest-ja
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration files in `supabase/migrations/` to set up your database schema
   - Copy your Supabase URL and anon key

4. **Configure environment variables**
   - Update `src/integrations/supabase/client.ts` with your Supabase credentials:
     ```typescript
     const SUPABASE_URL = "your-supabase-url";
     const SUPABASE_PUBLISHABLE_KEY = "your-supabase-anon-key";
     ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:8080` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production build will be in the `dist` directory.

## 📁 Project Structure

```
quest-ja/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   ├── pages/              # Page components (routes)
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication hook
│   │   └── useSupabaseData.tsx  # Data fetching hooks
│   ├── integrations/      # Third-party integrations
│   │   └── supabase/       # Supabase client and types
│   ├── data/               # Static data (lessons, quizzes, signs)
│   ├── lib/                # Utility functions
│   └── App.tsx             # Main app component
├── supabase/
│   └── migrations/         # Database migration files
├── public/                 # Static assets
└── package.json
```

## 🗄️ Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `user_progress` - XP, level, and streak tracking
- `lesson_progress` - Lesson completion status
- `quiz_scores` - Quiz results and performance
- `flashcard_progress` - Spaced repetition algorithm data
- `user_learned_signs` - Tracks which signs users have learned
- `achievements` - User achievement badges
- `road_signs` - Catalog of Japanese road signs

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## 🎯 Key Features Explained

### Gamification System
- **XP Calculation**: Users earn XP for completing activities (lessons: 100-300 XP, quizzes: 50-500 XP)
- **Leveling**: Level = `floor(total_xp / 1000) + 1`
- **Streak System**: Tracks consecutive days of activity, resets if a day is missed
- **Achievements**: Automatically awarded for milestones (streaks, levels, sign mastery)

### Spaced Repetition
The flashcard system uses the SM-2 algorithm to optimize review intervals:
- Tracks ease factor, interval, and repetitions per card
- Calculates due dates based on user performance
- Helps with long-term retention of sign meanings

### Security
- All database tables use Row Level Security (RLS)
- Users can only view/modify their own data
- Authentication handled securely by Supabase
- Database triggers automatically create user profiles on signup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Japanese road sign images and content
- Built with modern web technologies for optimal learning experience

## 🌐 Live Demo

Visit the live application: **https://quest-ja.vercel.app**

---

**Made with ❤️ for Japanese language learners and driving test candidates**
