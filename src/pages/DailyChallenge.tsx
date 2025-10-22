import { Calendar, Flame, Trophy, Clock, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { getProgress } from "@/lib/storage";
import { useEffect, useState } from "react";

interface Challenge {
  id: number;
  date: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
  streakBonus: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    date: "Today",
    title: "Speed Sign Sprint",
    description: "Identify 10 speed limit variations correctly in under 2 minutes",
    completed: false,
    xp: 100,
    streakBonus: 50,
  },
  {
    id: 2,
    date: "Yesterday",
    title: "Prohibition Master",
    description: "Match 15 prohibition signs with their meanings",
    completed: true,
    xp: 100,
    streakBonus: 50,
  },
  {
    id: 3,
    date: "2 days ago",
    title: "Warning Alert",
    description: "Recognize 12 warning signs and their hazards",
    completed: true,
    xp: 100,
    streakBonus: 50,
  },
  {
    id: 4,
    date: "3 days ago",
    title: "Information Quest",
    description: "Complete a quiz on route markers and road types",
    completed: true,
    xp: 100,
    streakBonus: 50,
  },
];

const DailyChallenge = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const todayChallenge = challenges[0];
  const today = new Date().toISOString().split('T')[0];
  const isTodayComplete = progress.dailyChallenges[today] || false;
  const completedChallenges = Object.keys(progress.dailyChallenges).length;
  const currentStreak = progress.streak;
  const totalXpEarned = completedChallenges * 150;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <header className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Daily Challenge</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            Complete today's challenge for streak bonus
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={currentStreak}
            color="warning"
          />
          <StatCard
            icon={Trophy}
            label="Completed"
            value={completedChallenges}
            color="primary"
          />
          <StatCard
            icon={Zap}
            label="Total XP"
            value={totalXpEarned}
            color="accent"
          />
          <StatCard
            icon={Target}
            label="Success Rate"
            value="95%"
            color="secondary"
          />
        </section>

        {/* Today's Challenge */}
        <section>
          <Card className="p-8 bg-gradient-subtle border-2 border-primary/20">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-primary mb-3">Today's Challenge</Badge>
                  <h2 className="text-3xl font-bold mb-2">
                    {todayChallenge.title}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {todayChallenge.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-warning/10 rounded-full px-4 py-2">
                  <Flame className="w-5 h-5 text-warning" />
                  <span className="font-bold">+{currentStreak} Streak</span>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">Time limit: 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning" />
                  <span className="text-sm">
                    +{todayChallenge.xp} XP base reward
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    +{todayChallenge.streakBonus} XP streak bonus
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => navigate("/daily-challenge/play")}
                  disabled={isTodayComplete}
                >
                  {isTodayComplete ? "Completed Today ✓" : "Start Challenge"}
                </Button>
                {isTodayComplete && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Come back tomorrow for a new challenge!
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Challenge History */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Challenges</h2>
          <div className="space-y-3">
            {challenges.slice(1).map((challenge) => (
              <Card
                key={challenge.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      challenge.completed
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {challenge.completed ? (
                      <Trophy className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {challenge.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {challenge.completed && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      +{challenge.xp + challenge.streakBonus} XP
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    {challenge.completed ? "Retry" : "Resume"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DailyChallenge;
