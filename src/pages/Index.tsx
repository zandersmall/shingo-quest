import { useState } from "react";
import {
  Flame,
  Trophy,
  Target,
  BookOpen,
  BrainCircuit,
  CreditCard,
  Calendar,
  Award,
  Star,
  Zap,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import ActionCard from "@/components/ActionCard";
import ProgressBar from "@/components/ProgressBar";
import AchievementBadge from "@/components/AchievementBadge";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-signs.jpg";
import SignCard from "@/components/SignCard";
import { roadSigns } from "@/data/roadSigns";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [xp] = useState(1250);
  const [streak] = useState(7);
  const [level] = useState(5);
  const [signsLearned] = useState(42);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-primary text-primary-foreground py-12 px-4">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shingō Quest</h1>
              <p className="text-primary-foreground/90 text-lg">
                Master Japanese Road Signs
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Flame className="w-5 h-5 text-warning animate-float" />
              <span className="font-bold text-xl">{streak} Day Streak</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Level {level}</span>
              <span className="text-sm text-primary-foreground/80">
                {xp} / 2000 XP
              </span>
            </div>
            <ProgressBar 
              label="" 
              current={xp} 
              max={2000}
              color="primary"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Trophy} label="Total XP" value={xp} color="primary" />
          <StatCard icon={Target} label="Signs Learned" value={signsLearned} color="accent" />
          <StatCard icon={Zap} label="Current Level" value={level} color="warning" />
          <StatCard icon={Award} label="Achievements" value="8/24" color="secondary" />
        </section>

        {/* Action Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Start Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              icon={BookOpen}
              title="Lessons"
              description="Progressive courses from basics to advanced"
              buttonText="Continue"
              color="primary"
              onClick={() => navigate("/lessons")}
            />
            <ActionCard
              icon={BrainCircuit}
              title="Quizzes"
              description="Test your knowledge and earn bonus XP"
              buttonText="Start Quiz"
              color="accent"
              onClick={() => navigate("/quizzes")}
            />
            <ActionCard
              icon={CreditCard}
              title="Flashcards"
              description="Spaced repetition for better retention"
              buttonText="Review"
              color="warning"
              onClick={() => navigate("/flashcards")}
            />
            <ActionCard
              icon={Calendar}
              title="Daily Challenge"
              description="Complete today's challenge for streak bonus"
              buttonText="Challenge"
              color="secondary"
              onClick={() => navigate("/daily-challenge")}
            />
          </div>
        </section>

        {/* Progress Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <Card className="p-6 shadow-card space-y-4">
            <ProgressBar
              label="Information Signs"
              current={15}
              max={25}
              color="primary"
            />
            <ProgressBar
              label="Prohibition Signs"
              current={12}
              max={30}
              color="accent"
            />
            <ProgressBar
              label="Warning Signs"
              current={15}
              max={28}
              color="warning"
            />
          </Card>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AchievementBadge
              icon={Flame}
              title="Week Warrior"
              description="7 day streak"
              unlocked
            />
            <AchievementBadge
              icon={Star}
              title="Perfect Score"
              description="100% on quiz"
              unlocked
            />
            <AchievementBadge
              icon={Target}
              title="Sign Master"
              description="Learn 50 signs"
              unlocked={false}
            />
            <AchievementBadge
              icon={Trophy}
              title="Champion"
              description="Reach level 10"
              unlocked={false}
            />
          </div>
        </section>

        {/* Sign Library */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Sign Library</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {roadSigns.map((sign) => (
              <SignCard 
                key={sign.id} 
                sign={sign}
                onClick={() => console.log('Sign clicked:', sign.name)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
