import { useState, useEffect } from "react";
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
  LogOut,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import ActionCard from "@/components/ActionCard";
import ProgressBar from "@/components/ProgressBar";
import AchievementBadge from "@/components/AchievementBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.png";
import SignCard from "@/components/SignCard";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress, useRoadSigns } from "@/hooks/useSupabaseData";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { progress, loading: progressLoading } = useUserProgress();
  const { signs, loading: signsLoading } = useRoadSigns();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { total_xp = 0, level = 1, current_streak = 0 } = progress || {};

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <header 
        className="relative overflow-hidden py-12 px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
        <div className="relative max-w-6xl mx-auto text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shingō Quest</h1>
              <p className="text-white/90 text-lg">
                Master Japanese Road Signs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Flame className="w-5 h-5 text-orange-400 animate-float" />
                <span className="font-bold text-xl">{current_streak} Day Streak</span>
              </div>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                size="icon"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Level {level}</span>
              <span className="text-sm text-white/80">
                {total_xp} / {level * 1000} XP
              </span>
            </div>
            <ProgressBar 
              label="" 
              current={total_xp} 
              max={level * 1000}
              color="primary"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Trophy} label="Total XP" value={total_xp} color="primary" />
          <StatCard icon={Target} label="Signs Available" value={signs.length} color="accent" />
          <StatCard icon={Zap} label="Current Level" value={level} color="warning" />
          <StatCard icon={Flame} label="Current Streak" value={`${current_streak} days`} color="secondary" />
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
          {signsLoading ? (
            <p>Loading signs...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {signs.map((sign) => (
                <SignCard 
                  key={sign.id} 
                  sign={{ 
                    id: sign.id, 
                    name: sign.name, 
                    imagePath: sign.image_url, 
                    category: sign.category 
                  }}
                  onClick={() => console.log('Sign clicked:', sign.name)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
